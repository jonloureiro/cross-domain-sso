const httpResponse = require('../../lib/httpResponse')

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return httpResponse.METHOD_NOT_ALLOWED
  }

  if (!event.body) {
    return httpResponse.FORBIDDEN
  }

  const body = JSON.parse(event.body)

  if (!body.username || !body.password) {
    return httpResponse.FORBIDDEN
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  }
}