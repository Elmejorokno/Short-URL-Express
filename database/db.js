const mongoose = require('mongoose')

mongoose
  .connect(process.env.URI)
  .then(() => console.log('bd conectada'))
  .catch((err) => console.log('error al conectar con la bd. ' + err))
