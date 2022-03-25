module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('mensajes', [
      { msg: 'Debes de iniciar sesión para acceder a esa página.' },
    ])
    return res.redirect('/login')
  }
  return next()
}
