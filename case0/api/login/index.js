'use strict'

const findUserByUsername = require('../../lib/findUserByUsername')
const httpResponse = require('../../lib/httpResponse')
const getMongoClient = require('../../lib/mongoClient')

exports.handler = async function (event, context) {
  context.callbackWaitsForEmptyEventLoop = false

  if (event.httpMethod !== 'POST') return httpResponse.METHOD_NOT_ALLOWED

  if (!event.body) return httpResponse.FORBIDDEN

  const body = JSON.parse(event.body)

  if (!body.username || !body.password) return httpResponse.FORBIDDEN

  try {
    const mongoClient = await getMongoClient()
    const result = await findUserByUsername(mongoClient, body.username)

    if (!result) return httpResponse.FORBIDDEN

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' })
    }
  } catch (error) {
    return httpResponse.SERVICE_UNAVAILABLE
  }
}
