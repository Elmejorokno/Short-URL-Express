const express = require('express')
const {
  loginForm,
  registerForm,
  registerUser,
} = require('../Controllers/authController')
const router = express.Router()

router.get('/register', registerForm)
router.post('/register', registerUser)
router.get('/login', loginForm)

module.exports = router
