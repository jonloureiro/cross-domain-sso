'use strict'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const config = require('../lib/config')
const createSession = require('../lib/createSession')
const findUserByUsername = require('../lib/findUserByUsername')
const httpResponse = require('../lib/httpResponse')

exports.handler = async function (event, context) {
  if (context) context.callbackWaitsForEmptyEventLoop = false

  if (event.httpMethod !== 'POST') return httpResponse.METHOD_NOT_ALLOWED

  if (!event.body) return httpResponse.UNAUTHORIZED

  const body = JSON.parse(event.body)

  if (!body.username || !body.password) return httpResponse.UNAUTHORIZED

  try {
    const result = await findUserByUsername(body.username)

    if (!result) return httpResponse.UNAUTHORIZED

    const isEqual = await bcrypt.compare(body.password, result.password)

    if (!isEqual) return httpResponse.UNAUTHORIZED

    const { refreshToken, expiresIn } = await createSession(result._id)
    const accessToken = jwt.sign({ usr: result._id }, config.SECRET, { expiresIn: 300 })

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `token=${refreshToken}; Max-Age=${expiresIn}; Secure; HttpOnly;`
      },
      body: JSON.stringify({ access_token: accessToken })
    }
  } catch (error) {
    console.log(error)
    return httpResponse.SERVICE_UNAVAILABLE
  }
}
