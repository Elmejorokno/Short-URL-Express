const nodemailer = require('nodemailer')
require('dotenv').config()

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.UserEmail,
    pass: process.env.PassEmail,
  },
})

const sendEmail = async ({ username, email, tokenConfirm }) => {
  let info = await transport.sendMail({
    from: `"Short url 👻" <shorturl@shorturl.com>`, // sender address
    to: `${email}`, // list of receivers
    subject: 'Verifica ✔ tu cuenta de Short URL', // Subject line
    html: `<a href="http://localhost:5000/auth/register/${tokenConfirm}">Verifica tu cuenta aquí.</a>`, // html body
  })
}

module.exports = { sendEmail }
