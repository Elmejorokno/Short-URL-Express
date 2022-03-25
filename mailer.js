const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const { extname } = require('path')
const path = require('path')
require('dotenv').config()

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.UserEmail,
    pass: process.env.PassEmail,
  },
})

transport.use(
  'compile',
  hbs({
    viewEngine: {
      extname: '.hbs',
      partialsDir: path.resolve('./views'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views'),
    extName: '.hbs',
  })
)

const sendEmail = async ({ username, email, tokenConfirm }) => {
  const info = await transport.sendMail({
    from: `"Short url 👻" <shorturl@shorturl.com>`, // sender address
    to: `${email}`, // list of receivers
    subject: 'Verifica ✔ tu cuenta de Short URL', // Subject line
    template: 'templateEmail',
    context: {
      tokenConfirm,
      username,
    },
    //html: `<a href="http://localhost:5000/register/${tokenConfirm}">Verifica tu cuenta aquí.</a>`, // html body
  })
}

module.exports = { sendEmail }
