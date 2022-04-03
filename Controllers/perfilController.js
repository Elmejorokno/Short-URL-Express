const formidable = require('formidable')
const jimp = require('jimp')
const path = require('path')
const fs = require('fs')
const User = require('../models/User')
const { validationResult } = require('express-validator')

const perfilForm = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    return res.render('perfil', {
      username: user.username,
      imagePath: user.imagePath,
      mensajes: req.flash('mensajes')
    })
  } catch (error) {
    req.flash('mensajes', [{ msg: error.message }])
    return res.redirect('/profile')
  }
}

const editarFotoPerfil = async (req, res) => {
  const form = new formidable.IncomingForm()
  form.maxFileSize = 50 * 1024 * 1024 //5 mb

  console.log(__dirname)

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) throw new Error('Falló en la subida de imagen. ' + err)

      const file = files.filePicture

      /* VALIDACIONES DEL ARCHIVO */
      if (file.originalFilename === '') {
        throw new Error('Agrega una imagen')
      } else if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
        throw new Error('Agrega una imagen de tipo JPEG o PNG')
      } else if (file.size > 50 * 1024 * 1024) {
        throw new Error('Tamaño excedido, el limite son 5MB')
      }

      const imageType = file.mimetype.split('/')[1]
      const dirImage = path.join(
        __dirname,
        `../public/img/perfil/${req.user.id}.${imageType}`
      )

      fs.renameSync(file.filepath, dirImage)

      /*REDIMENSIONAR LA IMAGEN A 200 * 200 PX*/
      const image = await jimp.read(dirImage)
      image.resize(200, 200).quality(90).writeAsync(dirImage)

      const user = await User.findById(req.user.id)
      if (!user) throw new Error('El usuario no existe.')
      user.imagePath = `${req.user.id}.${imageType}`
      await user.save()

      req.flash('mensajes', [{ msg: 'Imagen actualizada correctamente.' }])
    } catch (error) {
      req.flash('mensajes', [{ msg: error.message }])
    } finally {
      return res.redirect('/profile')
    }
  })
}

const editarUsername = async (req, res) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    req.flash('mensajes', errores.array())
    return res.redirect('/profile')
  }

  const { tUsername } = req.body

  try {
    if (req.user.username !== tUsername) {
      const user = await User.findById(req.user.id)
      if (!user) throw new Error('El usuario no existe.')
      user.username = tUsername
      await user.save()

      req.flash('mensajes', [{ msg: 'Username actualizado correctamente.' }])
    }
  } catch (error) {
    req.flash('mensajes', [{ msg: error.message }])
  } finally {
    return res.redirect('/profile')
  }
}

module.exports = {
  perfilForm,
  editarFotoPerfil,
  editarUsername
}
