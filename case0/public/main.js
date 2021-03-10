'use strict'

/* global fetch, Headers */

main()

// #############################################################################
function main () {
  const state = {
    loading: false,
    loadedSessions: false
  }

  setInterval(() => updateUI(state), 200)

  initForms(state)
}

// #############################################################################
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
    getSessions(state)
    mainSessions.style.display = 'block'
    mainForm.style.display = 'none'
  } else {
    mainForm.style.display = 'block'
    mainSessions.style.display = 'none'
    const data = document.getElementById('dataSessions')
    data.innerHTML = ''
    data.style.display = 'none'
  }
}

// #############################################################################
async function getSessions (state) {
  const logoutForm = document.getElementById('logoutForm')
  const loadingSessions = document.getElementById('loadingSessions')
  const dataSessions = document.getElementById('dataSessions')

  if (state.loadedSessions) {
    logoutForm.style.display = 'flex'
    loadingSessions.style.display = 'none'
    if (!dataSessions.innerHTML) {
      dataSessions.innerHTML = renderSessions(state.sessions)
      dataSessions.style.display = 'block'
    }
    return
  }

  loadingSessions.style.display = 'flex'
  logoutForm.style.display = 'none'
  dataSessions.innerHTML = ''
  dataSessions.style.display = 'none'

  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Authorization', `Bearer ${state.accessToken}`)

  const requestInit = {
    credentials: 'include',
    method: 'get',
    headers
  }
  const response = await fetch('/.netlify/functions/sessions', requestInit)
  const body = await response.text()
  if (body) {
    state.sessions = JSON.parse(body).sessions
    state.loadedSessions = true
    console.log(state)
  }
}

// #############################################################################
function renderSessions (sessions) {
  const renderToken = (token) => `<li>${new Date(token.expiresIn).toLocaleString()}</li>`

  let content = '<h2>Sessions</h2>'
  content += sessions.map(session =>
`
<section>
  <h3>&#187; Last token expires in ${new Date(session.expiresIn).toLocaleString()}</h3>
  <ul>
    ${session.tokens.map(renderToken).join()}
  </ul>
</section><hr>`
  ).join('')

  return content
}

// #############################################################################
function initForms (state) {
  const loginForm = document.getElementById('loginForm')
  const logoutForm = document.getElementById('logoutForm')

  logoutForm.onsubmit = async (event) => {
    event.preventDefault()

    const [logoutButton] = logoutForm
    const logoutButtonText = logoutButton.innerHTML

    logoutButton.disabled = true
    logoutButton.innerHTML = '<img src="/dots.svg">'

    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const requestInit = {
      credentials: 'include',
      method: 'post',
      headers
    }

    try {
      const response = await fetch('/.netlify/functions/logout', requestInit)
      if (!response.ok) throw Error(`${response.status} ${response.statusText}`)

      state.accessToken = undefined
      state.sessions = undefined
      state.loadedSessions = undefined
      const body = await response.text()
      if (body) console.log(JSON.parse(body))
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

  document.getElementById('reloadSession').onclick = (event) => {
    event.preventDefault()
    state.loadedSessions = false
  }
}
