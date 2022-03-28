const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoSanitize = require('express-mongo-sanitize')
const flash = require('connect-flash')
const cors = require('cors')
const { create } = require('express-handlebars')
const csrf = require('csurf')
const passport = require('passport')

const clientDB = require('./database/db')
const User = require('./models/User')
require('dotenv').config()

const app = express()

app.use(
  cors({
    credentials: true,
    methods: ['GET', 'POST'],
    origin: process.env.PathHeroku || '*',
  })
)

const hbs = create({
  extname: '.hbs',
  partialsDir: ['views/components'],
})

//Config del hbs, express templates "handlebars"
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')
app.set('views', './views')

app.set('trust proxy', 1)

app.use(
  session({
    secret: process.env.SecretSession,
    resave: false,
    saveUninitialized: false,
    name: 'session-user',
    cookie: {
      sameSite: true,
      secure: process.env.PathHeroku ? true : false,
      maxAge: 5 * 24 * 60 * 1000, //5 dias
    },
    store: MongoStore.create({
      clientPromise: clientDB,
      dbName: process.env.DatabaseName,
    }),
  })
)
app.use(flash())

//inicializar passport
app.use(passport.initialize())
app.use(passport.session())

//passport crea la sesión del usuario
passport.serializeUser((user, done) => {
  done(null, {
    id: user._id,
    username: user.username,
    imagePath: user.imagePath,
  })
})

//passport deserializa la sesion del usuario
passport.deserializeUser(async (user, done) => {
  //buscar si ese usuario de la sesion si existe
  const userDB = await User.findById(user.id).exec()

  if (!userDB) {
    return done(new Error('El usuario no se ha encontrado'), null)
  }

  return done(null, {
    id: userDB._id,
    username: userDB.username,
    imagePath: userDB.imagePath,
  })
})

app.use((err, req, res, next) => {
  //manejo de error del deserialize user
  if (err) {
    req.logout()
    req.flash('mensajes', [{ msg: err.message }])
    return res.redirect('/login')
  }
  next()
})

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))

app.use(csrf(), (req, res, next) => {
  res.locals.csrfToken = req.csrfToken()
  //para que el main.hbs pueda acceder a la sesión del usuario
  res.locals.user = req.user
  next()
})

app.use(mongoSanitize())

app.use('/', require('./routes/home'))
app.use('/', require('./routes/auth'))
//app.use('/auth', require('./routes/auth')) lo mismo que arriba, solo que tiene un 'apellido' auth

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('servidor andando'))
