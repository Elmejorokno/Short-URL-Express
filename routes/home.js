const express = require('express')
const { body } = require('express-validator')
const {
  leerUrls,
  agregarUrl,
  eliminarUrl,
  editarUrlForm,
  editarUrl,
  redirectShortUrl,
} = require('../Controllers/homeController')
const checkUrl = require('../middlewares/checkUrl')
const checkUser = require('../middlewares/checkUser')

const router = express.Router()

router.get('/', checkUser, leerUrls)
router.post(
  '/',
  checkUser,
  [body('tOriginUrl', 'Ingrese una Url válida.').trim().isURL()],
  checkUrl,
  agregarUrl
)
router.get('/eliminar/:idUrl', checkUser, eliminarUrl)
router.get('/editar/:idUrl', checkUser, editarUrlForm)
router.post(
  '/editar/:idUrl',
  checkUser,
  [body('tOriginUrl', 'Ingrese una Url válida.').trim().isURL()],
  checkUrl,
  editarUrl
)
router.get('/redirect/:shortUrl', redirectShortUrl)

module.exports = router
