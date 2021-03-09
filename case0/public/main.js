'use strict'

/* global fetch */

main()
function main () {
  const state = {
    loading: false
  }

  setInterval(() => updateUI(state), 200)

  initForms(state)
}

// ##################################################
function updateUI (state) {
  const mainLoading = document.getElementById('loading')
  const mainSessions = document.getElementById('withUser')
  const mainForm = document.getElementById('withoutUser')

  if (state.loading) {
    mainLoading.style.display = 'block'
    mainForm.style.display = 'none'
    mainSessions.style.display = 'none'
    return
  }

  mainLoading.style.display = 'none'

  if (state.accessToken) {
    mainSessions.style.display = 'block'
    mainForm.style.display = 'none'
  } else {
    mainForm.style.display = 'block'
    mainSessions.style.display = 'none'
  }
}

// ##################################################
function initForms (state) {
  const loginForm = document.getElementById('loginForm')
  const logoutForm = document.getElementById('logoutForm')

  logoutForm.onsubmit = async (event) => {
    event.preventDefault()

    const [logoutButton] = logoutForm
    const logoutButtonText = logoutButton.innerHTML

    logoutButton.disabled = true
    logoutButton.innerHTML = '<img src="/dots.svg">'

    const requestInit = {
      credentials: 'include',
      method: 'post'
    }

    try {
      const response = await fetch('/.netlify/functions/logout', requestInit)
      if (!response.ok) throw Error(`${response.status} ${response.statusText}`)

      state.accessToken = undefined
      console.log(response)
    } catch (error) {
      console.log(error)
    }
    logoutButton.disabled = false
    logoutButton.innerHTML = logoutButtonText
  }

  loginForm.onsubmit = async (event) => {
    event.preventDefault()

    const [usernameInput, passwordInput, loginButton] = loginForm
    const loginButtonText = loginButton.innerHTML

    usernameInput.disabled = true
    passwordInput.disabled = true
    loginButton.disabled = true
    loginButton.innerHTML = '<img src="/dots.svg">'

    const requestInit = {
      credentials: 'include',
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
      state.accessToken = data.access_token
      console.log(data)
    } catch (error) {
      console.log(error)
    }
    usernameInput.disabled = false
    passwordInput.disabled = false
    loginButton.disabled = false
    loginButton.innerHTML = loginButtonText
    loginForm.reset()
    usernameInput.focus()
  }
}
