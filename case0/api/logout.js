'use strict'

// TODO: tests

const httpResponse = require('../lib/httpResponse')
const invalidateSession = require('../lib/invalidateSession')

const RESPONSE_DEFAULT = {
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
    'Set-Cookie': 'token=; Max-Age=1; Secure; HttpOnly;'
  }
}

exports.handler = async function (event, context) {
  if (context) context.callbackWaitsForEmptyEventLoop = false

  if (event.httpMethod !== 'POST') return httpResponse.METHOD_NOT_ALLOWED

  if (!event.headers.cookie) return RESPONSE_DEFAULT

  const [, refreshToken] = event.headers.cookie.split('=')

  if (!refreshToken) return RESPONSE_DEFAULT

  try {
    await invalidateSession(refreshToken)
    return RESPONSE_DEFAULT
  } catch (error) {
    return {
      ...RESPONSE_DEFAULT,
      body: JSON.stringify({ error: error.message })
    }
  }
}
