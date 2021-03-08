'use strict'

const crypto = require('crypto')

module.exports = async function createRefreshToken(userId) {
  return {
    refreshToken: crypto.randomBytes(40).toString('hex'),
    expiresIn: new Date(Date.now() + 86400000).toISOString()
  }
}
