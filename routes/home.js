const express = require('express')
const {
  leerUrls,
  agregarUrl,
  eliminarUrl,
} = require('../Controllers/homeController')

const router = express.Router()

router.get('/', leerUrls)

router.post('/', agregarUrl)

router.get('/eliminar/:idUrl', eliminarUrl)

module.exports = router
