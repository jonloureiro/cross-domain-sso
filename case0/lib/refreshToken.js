'use strict'

const crypto = require('crypto')

const getMongoClient = require('./getMongoClient')

module.exports = async function refreshToken (refreshToken, ip, userAgent) {
  if (!refreshToken) throw Error('Without refresh token')

  const mongoClient = await getMongoClient()

  const newRefreshToken = crypto.randomBytes(40).toString('hex')
  const expiresIn = new Date(Date.now() + 600000) // 10min = 600000; 1d = 86400000

  const oldToken = await mongoClient
    .db('cross-domain-sso')
    .collection('tokens')
    .findOne({ refreshToken })

  if (!oldToken.valid) {
    // TODO: DANGER! INVALIDAR TUDO
  }

  const promiseUpdaOldToken = mongoClient
    .db('cross-domain-sso')
    .collection('tokens')
    .findOneAndUpdate({ refreshToken }, {
      $set: { valid: false }
    })

  const promiseInsertNewRefreshToken = mongoClient
    .db('cross-domain-sso')
    .collection('tokens')
    .insertOne({
      sessionId: oldToken.sessionId,
      createByIp: ip,
      refreshToken: newRefreshToken,
      expiresIn,
      valid: true
    })

  const promiseUpdateSession = mongoClient
    .db('cross-domain-sso')
    .collection('sessions')
    .findOneAndUpdate({ _id: oldToken.sessionId }, {
      $set: { expiresIn }
    })

  const [, , updateSession] = await Promise.all([
    promiseUpdaOldToken,
    promiseInsertNewRefreshToken,
    promiseUpdateSession
  ])

  const userId = updateSession.value.createBy

  return {
    userId,
    newRefreshToken,
    expiresIn
  }
}
