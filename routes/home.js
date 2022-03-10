const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  const urls = [
    {
      originURL: 'https://www.npmjs.com/package/package',
      shortURL: 'https://www.short.fefea4512',
    },
    {
      originURL: 'https://expressjs.com/es/',
      shortURL: 'https://www.short.fghrsr456',
    },
    {
      originURL: 'https://bluuweb.github.io/desarrollo-web-bluuweb/',
      shortURL: 'https://www.short.afeaff65d',
    },
  ]
  res.render('home', { urls })
})

module.exports = router
