const httpResponse = require('../../lib/httpResponse')

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return httpResponse.METHOD_NOT_ALLOWED;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  }
}