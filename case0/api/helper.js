const parser = require('ua-parser-js')

exports.handler = async function (event) {
  const { ua } = parser(event.headers['user-agent'])
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ua,
      event
    })
  }
}
