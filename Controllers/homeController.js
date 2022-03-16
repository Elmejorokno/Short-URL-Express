const Url = require('../models/Url')
const { nanoid } = require('nanoid')
const { validationResult } = require('express-validator')

const leerUrls = async (req, res) => {
  try {
    const urls = await Url.find().lean()
    res.render('home', { urls, mensajes: req.flash('mensajes') })
  } catch (error) {
    req.flash('mensajes', [{ msg: 'Error al leer las urls. ' + error.message }])
    return res.redirect('/')
  }
}

const agregarUrl = async (req, res) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    console.log('hay un error aquí con express validator')
    req.flash('mensajes', errores.array())
    return res.redirect('/')
  }
  try {
    const { tOriginUrl } = req.body
    const url = new Url({ originURL: tOriginUrl, shortURL: nanoid(8) })
    await url.save()
    return res.redirect('/')
  } catch (error) {
    console.log(error)
    req.flash('mensajes', [{ msg: 'Error al agregar la url. ' + error }])
    return res.redirect('/')
  }
}

const eliminarUrl = async (req, res) => {
  const { idUrl } = req.params
  try {
    await Url.findByIdAndDelete(idUrl)
    res.redirect('/')
  } catch (error) {
    req.flash('mensajes', [{ msg: 'Error al eliminar la url. ' + error }])
    return res.redirect('/')
  }
}

const editarUrlForm = async (req, res) => {
  const { idUrl } = req.params
  try {
    const elemUrl = await Url.findById(idUrl).lean()
    res.render('home', { elemUrl })
  } catch (error) {
    req.flash('mensajes', [
      { msg: 'Error al cargar el formulario de editar url. ' + error },
    ])
    return res.redirect('/')
  }
}

const editarUrl = async (req, res) => {
  const { idUrl } = req.params
  const { tOriginUrl } = req.body
  try {
    await Url.findByIdAndUpdate(idUrl, { originURL: tOriginUrl })
    return res.redirect('/')
  } catch (error) {
    req.flash('mensajes', [{ msg: 'Error al editar la url. ' + error }])
    return res.redirect('/')
  }
}

const redirectShortUrl = async (req, res) => {
  const { shortUrl } = req.params
  try {
    const url = await Url.findOne({ shortURL: shortUrl })
    return res.redirect(url.originURL)
  } catch (error) {
    req.flash('mensajes', [{ msg: 'Error en el redireccionamiento. ' + error }])
    return res.redirect('/')
  }
}

module.exports = {
  leerUrls,
  agregarUrl,
  eliminarUrl,
  editarUrlForm,
  editarUrl,
  redirectShortUrl,
}
