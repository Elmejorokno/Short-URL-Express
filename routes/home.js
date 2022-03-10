const express = require('express')
const { leerUrls } = require('../Controllers/homeController')

const router = express.Router()

router.get('/', leerUrls)

module.exports = router
