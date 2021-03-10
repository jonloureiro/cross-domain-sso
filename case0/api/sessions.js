'use strict'

// TODO: tests

const jwt = require('jsonwebtoken')

const config = require('../lib/config')
const getSessions = require('../lib/getSessions')
const httpResponse = require('../lib/httpResponse')

exports.handler = async function (event, context) {
  if (context) context.callbackWaitsForEmptyEventLoop = false

  if (event.httpMethod !== 'GET') return httpResponse.METHOD_NOT_ALLOWED

  if (!event.headers.authorization) return httpResponse.UNAUTHORIZED

  const [, accessToken] = event.headers.authorization.split(' ')

  if (!accessToken) return httpResponse.UNAUTHORIZED

  try {
    const { usr } = jwt.verify(accessToken, config.SECRET)
    const sessions = await getSessions(usr)
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sessions })
    }
  } catch (error) {
    return httpResponse.UNAUTHORIZED
  }
}
