const User = require('../models/User')
const { nanoid } = require('nanoid')
const { validationResult } = require('express-validator')

//renderizado del formulario de registro de usuario
const registerForm = (req, res) => {
  res.render('register', { mensajes: req.flash('mensajes') })
}

//logica registrar usuario
const registerUser = async (req, res) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    req.flash('mensajes', errores.array())
    return res.redirect('/auth/register')
  }

  const { tUsername, tEmail, tPassword } = req.body
  try {
    const checkUser = await User.findOne({ email: tEmail })
    if (checkUser) throw new Error('Ya existe el usuario')

    const user = await new User({
      username: tUsername,
      email: tEmail,
      password: tPassword,
      tokenConfirm: nanoid(),
    })
    await user.save()

    req.flash('mensajes', [
      {
        msg: 'Cuenta creada exitosamente, revisa tu correo y verifica tu cuenta',
      },
    ])

    res.redirect('/auth/login')

    //TODO: Enviar correo de validacion al usuario
  } catch (error) {
    req.flash('mensajes', [{ msg: error.message }])
    res.redirect('/auth/register')
  }
}

//logica confirmacion de la cuenta con el tokenconfirm
const confirmarCuenta = async (req, res) => {
  const { tokenConfirm } = req.params

  try {
    const user = await User.findOne({ tokenConfirm })

    if (!user) throw new Error('Error. Token inválido')

    user.cuentaConfirmada = true
    user.tokenConfirm = null

    await user.save()

    req.flash('mensajes', [{ msg: 'Activación de la cuenta éxitosa.' }])
    res.redirect('/auth/login')
  } catch (error) {
    req.flash('mensajes', [{ msg: error.message }])
    res.redirect('/auth/login')
  }
}

//renderiza del formulario del login
const loginForm = (req, res) => {
  res.render('login', { mensajes: req.flash('mensajes') })
}

//logica del inicio de sesion del usuario
const loginUser = async (req, res) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    req.flash('mensajes', errores.array())
    return res.redirect('/auth/login')
  }

  const { tEmail, tPassword } = req.body
  try {
    const user = await User.findOne({ email: tEmail })

    if (!user) throw new Error('El usuario no existe')

    if (!user.cuentaConfirmada)
      throw new Error('El usuario aún no ha confirmado su cuenta')

    if (!(await user.comparePassword(tPassword)))
      throw new Error('Contraseña incorrecta')

    //crea la sesion de usuario con passport
    req.login(user, (err) => {
      if (err) throw new Error('Error al crear la sesión. ' + err)

      return res.redirect('/')
    })
  } catch (error) {
    req.flash('mensajes', [{ msg: error.message }])
    res.redirect('/auth/login')
  }
}

const logoutUser = (req, res) => {
  req.logout()

  res.redirect('/auth/login')
}

module.exports = {
  registerForm,
  registerUser,
  confirmarCuenta,
  loginForm,
  loginUser,
  logoutUser,
}
