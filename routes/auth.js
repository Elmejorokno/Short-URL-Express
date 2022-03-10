const express = require('express')
const router = express.Router()

// TODO: mejorar la página de login
router.get('/login', (req, res) => {
  res.render('login')
})

module.exports = router
