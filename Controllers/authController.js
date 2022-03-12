const User = require('../models/User')
const { nanoid } = require('nanoid')

const registerForm = (req, res) => {
  res.render('register')
}

const registerUser = async (req, res) => {
  const { tUsername, tEmail, tPassword } = req.body
  try {
    const checkUser = await User.findOne({ email: tEmail })
    if (checkUser) throw new Error('Ya existe el usuario')

    const user = await new User({
      username: tUsername,
      email: tEmail,
      password: tPassword,
      tokenConfirm: nanoid(),
    })
    console.log(user)
    await user.save()
  } catch (error) {
    res.send('Error al registrar el usuario. ' + error)
  }
}

const loginForm = (req, res) => {
  res.render('login')
}

module.exports = {
  registerForm,
  registerUser,
  loginForm,
}
