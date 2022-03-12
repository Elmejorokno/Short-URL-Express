const express = require('express')
const {
  leerUrls,
  agregarUrl,
  eliminarUrl,
  editarUrlForm,
  editarUrl,
  redirectShortUrl,
} = require('../Controllers/homeController')
const checkUrl = require('../middlewares/checkUrl')

const router = express.Router()

router.get('/', leerUrls)
router.post('/', checkUrl, agregarUrl)
router.get('/eliminar/:idUrl', eliminarUrl)
router.get('/editar/:idUrl', editarUrlForm)
router.post('/editar/:idUrl', checkUrl, editarUrl)
router.get('/:shortUrl', redirectShortUrl)

module.exports = router
