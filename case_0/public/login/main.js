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
    if (!response.ok) throw Error(`${response.status} ${response.statusText}`)

    const data = await response.json()
    console.log(data);
  } catch (error) {
    console.log(error)
    showToast()
    usernameInput.disabled = false
    passwordInput.disabled = false
    button.disabled = false
    form.reset()
  }
})

function showToast() {
  const toast = document.querySelector('#toast')
  toast.innerText = "✗ Something wrong is not right!";
  toast.classList.add('active');
  setTimeout(function () {
    toast.classList.remove('active');
  }, 4000);
}