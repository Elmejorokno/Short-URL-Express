document.addEventListener('click', (e) => {
  if (e.target.dataset.shorturl) {
    const url = `http://localhost:5000/redirect/${e.target.dataset.shorturl}`

    navigator.clipboard
      .writeText(url)
      .catch((err) => console.log('Error al copiar al portapapeles. ' + err))
  }
})
