'use strict'

/* global fetch, Headers */

main()

// #############################################################################
function main () {
  const state = {
    initialLoading: true,
    loadedSessions: false,
    updatingUi: false
  }
  setInterval(() => updateUI(state), 200)

  initState(state)
  initForms(state)
}

// #############################################################################
async function initState (state) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  const requestInit = {
    credentials: 'include',
    method: 'post',
    headers
  }

  try {
    const response = await fetch('/.netlify/functions/refresh', requestInit)
    const body = await response.text()

    if (!body) throw Error('Without access_token')

    const data = JSON.parse(body)
    if (!data.access_token) throw Error('Without access_token')

    state.accessToken = data.access_token
    await getSessions(state)
  } catch (error) {
    console.log(error)
  }

  state.initialLoading = false
}

// #############################################################################
async function updateUI (state) {
  if (state.initialLoading || state.updatingUi) return
  state.updatingUi = true

  const mainLoading = document.getElementById('loading')
  const mainSessions = document.getElementById('withUser')
  const mainForm = document.getElementById('withoutUser')
  const logoutForm = document.getElementById('logoutForm')
  const loadingSessions = document.getElementById('loadingSessions')
  const dataSessions = document.getElementById('dataSessions')

  mainLoading.style.display = 'none'

  if (state.accessToken) {
    mainSessions.style.display = 'block'
    mainForm.style.display = 'none'
    logoutForm.style.display = 'flex'
    loadingSessions.style.display = 'none'
    if (!dataSessions.innerHTML && state.sessions) {
      dataSessions.innerHTML = renderSessions(state.sessions)
      dataSessions.style.display = 'block'
    }
  } else {
    mainForm.style.display = 'block'
    mainSessions.style.display = 'none'
    const data = document.getElementById('dataSessions')
    data.innerHTML = ''
    data.style.display = 'none'
  }

  state.updatingUi = false
}

// #############################################################################
async function getSessions (state) {
  const logoutForm = document.getElementById('logoutForm')
  const loadingSessions = document.getElementById('loadingSessions')
  const dataSessions = document.getElementById('dataSessions')

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
  }
}

// #############################################################################
function renderSessions (sessions) {
  if (sessions && !sessions.length) return ''

  console.log(sessions)

  const renderToken = (token) => {
    const tokenDiff = getTimeDiff(token.expiresIn)
    return `
<li ${token.valid && 'class="valid"'}>
  Accessed by ${token.createByIp}
  <br>
  ${tokenDiff ? 'Expires in ' + tokenDiff : 'Expired token'}
</li>`
  }

  let content = '<h2>Sessions</h2>'
  content += sessions.map(session =>
`<section>
  <h3>
    ${session.userAgent.browser} &#8226; ${session.userAgent.os} ${session.userAgent.cpu}
    <small>(Valid until ${new Date(session.expiresIn).toLocaleString()})</small>
  </h3>
  <ul>
    ${session.tokens.map(renderToken).join('')}
  </ul>
</section><hr>`
  ).join('')

  return content
}

// #############################################################################
function getTimeDiff (tokenTime) {
  const msTokenTime = new Date(tokenTime).getTime()
  const now = Date.now()

  if (now > msTokenTime) return

  const msDiff = msTokenTime - now

  const h = Math.floor(msDiff / 1000 / 60 / 60)
  const min = Math.floor((msDiff / 1000 / 60) % 60)
  const s = Math.floor((msDiff / 1000) % 60)

  let result = ''
  result += h > 0 ? h + 'h ' : ''
  result += min > 0 ? min + 'min ' : ''
  result += s > 0 ? s + 's' : ''

  return result.trim()
}

// #############################################################################
function initForms (state) {
  const loginForm = document.getElementById('loginForm')
  const logoutForm = document.getElementById('logoutForm')

  const params = new URLSearchParams(window.location.search)
  const usr = params.get('usr')
  if (usr) loginForm[0].value = usr

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

      const body = await response.text()
      if (!body) throw Error('Without access_token')

      const data = JSON.parse(body)
      if (!data.access_token) throw Error('Without access_token')

      state.accessToken = data.access_token
      await getSessions(state)
    } catch (error) {
      console.log(error)
    }
    usernameInput.disabled = false
    passwordInput.disabled = false
    loginButton.disabled = false
    loginButton.innerHTML = loginButtonText
    usernameInput.focus()
  }

  document.getElementById('reloadSession').onclick = (event) => {
    event.preventDefault()
    state.loadedSessions = false
    getSessions(state)
  }
}
