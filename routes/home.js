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
const {
  perfilForm,
  editarFotoPerfil,
  editarUsername,
} = require('../Controllers/perfilController')
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

router.get('/profile', checkUser, perfilForm)
router.post('/profile/image', checkUser, editarFotoPerfil)
router.post(
  '/profile/username',
  checkUser,
  [
    body('tUsername', 'Ingrese un nombre de usuario válido')
      .trim()
      .notEmpty()
      .escape(),
  ],
  editarUsername
)

module.exports = router
