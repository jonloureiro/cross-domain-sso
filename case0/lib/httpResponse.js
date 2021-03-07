const http = require('http')

exports.FORBIDDEN = {
  statusCode: 403,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: http.STATUS_CODES[403] })
}

exports.METHOD_NOT_ALLOWED = {
  statusCode: 405,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: http.STATUS_CODES[405] })
}
