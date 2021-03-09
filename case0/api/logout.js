'use strict'

// TODO: tests

const httpResponse = require('../lib/httpResponse')
const invalidateRefreshToken = require('../lib/invalidateRefreshToken')

exports.handler = async function (event, context) {
  if (context) context.callbackWaitsForEmptyEventLoop = false

  if (event.httpMethod !== 'POST') return httpResponse.METHOD_NOT_ALLOWED

  if (event.cookie) {
    try {
      await invalidateRefreshToken()
    } catch (error) {
      return {
        statusCode: 200,
        headers: { 'Set-Cookie': 'token=; Max-Age=1; Secure; HttpOnly;' },
        body: JSON.stringify({ error }) // TODO: debug
      }
    }
  }

  return {
    statusCode: 200,
    headers: { 'Set-Cookie': 'token=; Max-Age=1; Secure; HttpOnly;' }
  }
}
