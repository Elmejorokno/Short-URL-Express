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
      throw new Error('La url debe de tener protocolo "http" o "https".')
    } else {
      throw new Error('Url no válida')
    }
  } catch (error) {
    req.flash('mensajes', [
      {
        msg: error.message === 'Invalid URL' ? 'Url no válida' : error.message,
      },
    ])
    return res.redirect('/')
  }
}

module.exports = checkUrl
