const parser = require('ua-parser-js')

exports.handler = async function (event) {
  const client = parser(event.headers['user-agent'])
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client,
      event
    })
  }
}
