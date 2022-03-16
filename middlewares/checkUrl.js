const { url } = require('inspector')
const { URL } = require('url')

const checkUrl = (req, res, next) => {
  try {
    const { tOriginUrl } = req.body
    const urlFronted = new URL(tOriginUrl)
    if (urlFronted.origin !== 'null') {
      if (urlFronted.protocol === 'http:' || urlFronted.protocol === 'https:') {
        return next()
      }
    } else {
      throw new Error('Error al válidar la url')
    }
  } catch (error) {
    req.flash('mensajes', [{ msg: 'Url no válida.' }])
    return res.redirect('/')
  }
}

module.exports = checkUrl
