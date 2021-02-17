const form = document.getElementById('form')
const [usernameInput, passwordInput, button] = form

usernameInput.addEventListener('keydown', event => {
  if (event.keyCode !== 13) return
  event.preventDefault()
  passwordInput.focus()
})

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  usernameInput.disabled = true
  passwordInput.disabled = true
  button.disabled = true
  button.value = 'Sending'


  const requestInit = {
    method: 'post',
    body: JSON.stringify({
      username: usernameInput.value,
      password: passwordInput.value
    })
  }

  try {
    const response = await fetch('/.netlify/functions/login', requestInit)
    const data = await response.json()

    if (!data.ok) throw Error(`${data.status} ${data.statusText}`)
  } catch (error) {
    console.error(error)
    usernameInput.disabled = false
    passwordInput.disabled = false
    button.disabled = false
  }

  form.reset()
})