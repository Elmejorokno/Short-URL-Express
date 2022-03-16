const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const { create } = require('express-handlebars')
const csrf = require('csurf')
const passport = require('passport')
const User = require('./models/User')
require('dotenv').config()
require('./database/db')

const app = express()

const hbs = create({
  extname: '.hbs',
  partialsDir: ['views/components'],
})

//Config del hbs, express templates "handlebars"
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    name: 'name-keyboard-cat',
    cookie: { sameSite: true },
  })
)
app.use(flash())

//inicializar passport
app.use(passport.initialize())
app.use(passport.session())

//passport crea la sesión del usuario
passport.serializeUser((user, done) =>
  done(null, { id: user._id, username: user.username })
)
//passport deserializa la sesion del usuario
passport.deserializeUser(async (user, done) => {
  //buscar si ese usuario de la sesion si existe
  const userDB = await User.findById(user.id).exec()

  if (!userDB) {
    return done(new Error('El usuario no se ha encontrado'), null)
  }

  return done(null, { id: userDB._id, username: userDB.username })
})

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))

app.use(csrf(), (req, res, next) => {
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use('/', require('./routes/home'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('servidor andando'))
