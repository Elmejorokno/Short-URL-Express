const express = require('express')
const { body } = require('express-validator')
const {
  registerForm,
  registerUser,
  confirmarCuenta,
  loginForm,
  loginUser,
  logoutUser,
} = require('../Controllers/authController')
const router = express.Router()

router.get('/register', registerForm)
router.post(
  '/register',
  [
    body('tUsername', 'Ingrese un nombre de usuario válido')
      .trim()
      .notEmpty()
      .escape(),
    body('tEmail', 'Ingrese un email válido')
      .trim()
      .isEmail()
      .normalizeEmail()
      .escape(),
    body('tPassword', 'Ingrese una contraseña válida entre 8 y 12 carácteres.')
      .trim()
      .isLength({ min: 8, max: 12 })
      .escape(),
    body('tRepassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.tPassword) {
          throw new Error('Las contraseñas no coinciden.')
        }
        return value
      }),
  ],
  registerUser
)
router.get('/register/:tokenConfirm', confirmarCuenta)
router.get('/login', loginForm)
router.post(
  '/login',
  [
    body('tEmail', 'Ingrese un email válido')
      .trim()
      .isEmail()
      .normalizeEmail()
      .escape(),
    body('tPassword', 'Ingrese una contraseña válida entre 8 y 12 carácteres.')
      .trim()
      .isLength({ min: 8, max: 12 })
      .escape(),
  ],
  loginUser
)
router.get('/logout', logoutUser)

module.exports = router
