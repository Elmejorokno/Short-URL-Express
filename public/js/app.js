document.addEventListener('click', (e) => {
  if (e.target.dataset.shorturl) {
    const url = `${window.location.origin}/redirect/${e.target.dataset.shorturl}`

    navigator.clipboard
      .writeText(url)
      .catch((err) => console.log('Error al copiar al portapapeles. ' + err))
  }
})
