'use strict'

const crypto = require('crypto')

const getMongoClient = require('./getMongoClient')

module.exports = async function refreshToken (refreshToken) {
  const mongoClient = await getMongoClient()

  const newRefreshToken = crypto.randomBytes(40).toString('hex')
  const expiresIn = new Date(Date.now() + 600000) // 10min = 600000; 1d = 86400000

  const { value } = await mongoClient
    .db('cross-domain-sso')
    .collection('tokens')
    .findOneAndUpdate({ refreshToken }, {
      $set: { expiresIn: new Date() }
    })

  const promiseInsertNewRefreshToken = mongoClient
    .db('cross-domain-sso')
    .collection('tokens')
    .insertOne({
      sessionId: value.sessionId,
      refreshToken: newRefreshToken,
      expiresIn
    })

  const promiseUpdateSession = mongoClient
    .db('cross-domain-sso')
    .collection('sessions')
    .findOneAndUpdate({ _id: value.sessionId }, {
      $set: { expiresIn }
    })

  await Promise.all([
    promiseInsertNewRefreshToken,
    promiseUpdateSession
  ])

  return {
    refreshToken: newRefreshToken,
    expiresIn
  }
}
