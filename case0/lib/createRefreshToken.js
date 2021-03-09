'use strict'

const crypto = require('crypto')

const getMongoClient = require('./getMongoClient')

module.exports = async function createRefreshToken (userId) {
  const mongoClient = await getMongoClient()

  const refreshToken = crypto.randomBytes(40).toString('hex')
  const expiresIn = new Date(Date.now() + 600000) // 10min = 600000; 1d = 86400000

  const { insertedId } = await mongoClient
    .db('cross-domain-sso')
    .collection('sessions')
    .insertOne({
      createBy: userId,
      lastExpiresIn: expiresIn
    })

  await mongoClient
    .db('cross-domain-sso')
    .collection('tokens')
    .insertOne({
      sessionId: insertedId,
      refreshToken,
      expiresIn
    })

  return {
    refreshToken,
    expiresIn
  }
}
