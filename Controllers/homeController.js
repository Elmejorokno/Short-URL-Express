const Url = require('../models/Url')
const { nanoid } = require('nanoid')

const leerUrls = async (req, res) => {
  try {
    const urls = await Url.find().lean()
    res.render('home', { urls })
  } catch (error) {
    console.log(error)
    res.send('Error al leer las url. ' + error)
  }
}

const agregarUrl = async (req, res) => {
  try {
    const { tOriginUrl } = req.body
    const url = new Url({ originURL: tOriginUrl, shortURL: nanoid(8) })
    await url.save()
    res.redirect('/')
  } catch (error) {
    console.log(error)
    res.send('Error al agregar la url. ' + error)
  }
}

const eliminarUrl = async (req, res) => {
  const { idUrl } = req.params
  try {
    await Url.findByIdAndDelete(idUrl)
    res.redirect('/')
  } catch (error) {
    console.log(error)
    res.send('Error al eliminar la url. ' + error)
  }
}

const editarUrlForm = async (req, res) => {
  const { idUrl } = req.params
  try {
    const elemUrl = await Url.findById(idUrl).lean()
    res.render('home', { elemUrl })
  } catch (error) {
    console.log(error)
    res.send('Error al editar la url en el formulario. ' + error)
  }
}

const editarUrl = async (req, res) => {
  const { idUrl } = req.params
  const { tOriginUrl } = req.body
  try {
    await Url.findByIdAndUpdate(idUrl, { originURL: tOriginUrl })
    res.redirect('/')
  } catch (error) {
    res.send('Error al editar la url. ' + error)
  }
}

const redirectShortUrl = async (req, res) => {
  const { shortUrl } = req.params
  try {
    const url = await Url.findOne({ shortURL: shortUrl })
    res.redirect(url.originURL)
  } catch (error) {
    res.send('Error en el redireccionamiento. ' + error)
  }
}

module.exports = {
  leerUrls,
  agregarUrl,
  eliminarUrl,
  editarUrlForm,
  editarUrl,
  redirectShortUrl,
}
