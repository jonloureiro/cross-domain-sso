'use strict'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const config = require('../../lib/config')
const findUserByUsername = require('../../lib/findUserByUsername')
const httpResponse = require('../../lib/httpResponse')
const getMongoClient = require('../../lib/getMongoClient')

exports.handler = async function (event, context) {
  if (context) context.callbackWaitsForEmptyEventLoop = false

  if (event.httpMethod !== 'POST') return httpResponse.METHOD_NOT_ALLOWED

  if (!event.body) return httpResponse.FORBIDDEN

  const body = JSON.parse(event.body)

  if (!body.username || !body.password) return httpResponse.FORBIDDEN

  try {
    const mongoClient = await getMongoClient()
    const result = await findUserByUsername(mongoClient, body.username)

    if (!result) return httpResponse.FORBIDDEN

    const isEqual = await bcrypt.compare(body.password, result.password)
    if (!isEqual) return httpResponse.FORBIDDEN

    const accessToken = jwt.sign({ usr: result.username }, config.SECRET, { expiresIn: 300 })
    return {
      statusCode: 200,
      body: JSON.stringify({ access_token: accessToken })
    }
  } catch (error) {
    return httpResponse.SERVICE_UNAVAILABLE
  }
}
