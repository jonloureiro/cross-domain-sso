'use strict'

const crypto = require('crypto')

const getMongoClient = require('./getMongoClient')

module.exports = async function createRefreshToken (userId) {
  const mongoClient = await getMongoClient()
  const expiresIn = new Date(Date.now() + 86400000).toISOString()

  const session = await mongoClient
    .db('cross-domain-sso')
    .collection('sessions')
    .insertOne({
      createBy: userId,
      lastExpiresIn: expiresIn
    })
  const token = await mongoClient
    .db('cross-domain-sso')
    .collection('tokens')
    .insertOne({
      sessionId: session._id,
      refreshToken: crypto.randomBytes(40).toString('hex'),
      expiresIn
    })
  return token
}
