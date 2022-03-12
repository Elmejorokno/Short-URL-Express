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

module.exports = {
  leerUrls,
  agregarUrl,
  eliminarUrl,
}
