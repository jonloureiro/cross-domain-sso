'use strict'

// TODO: tests

const jwt = require('jsonwebtoken')

const config = require('../lib/config')
const httpResponse = require('../lib/httpResponse')
const refreshToken = require('../lib/refreshToken')

exports.handler = async function (event, context) {
  if (context) context.callbackWaitsForEmptyEventLoop = false

  if (event.httpMethod !== 'POST') return httpResponse.METHOD_NOT_ALLOWED

  if (!event.headers.cookie) return httpResponse.UNAUTHORIZED

  const [, accessToken] = event.headers.cookie.split('=')

  if (!event.headers.cookie) return httpResponse.UNAUTHORIZED

  try {
    const { userId, newRefreshToken, expiresIn } = await refreshToken(accessToken)
    const newAccessToken = jwt.sign({ usr: userId }, config.SECRET, { expiresIn: 300 })

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `token=${newRefreshToken}; Max-Age=${expiresIn}; Secure; HttpOnly;`
      },
      body: JSON.stringify({ access_token: newAccessToken })
    }
  } catch (error) {
    console.log(error)
    return httpResponse.SERVICE_UNAVAILABLE
  }
}
