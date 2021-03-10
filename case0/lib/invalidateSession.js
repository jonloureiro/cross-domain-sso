'use strict'

const getMongoClient = require('./getMongoClient')

module.exports = async function invalidateSession (refreshToken) {
  const mongoClient = await getMongoClient()

  const { value } = await mongoClient
    .db('cross-domain-sso')
    .collection('tokens')
    .findOneAndUpdate({ refreshToken }, {
      $set: { expiresIn: new Date() }
    })

  await mongoClient
    .db('cross-domain-sso')
    .collection('sessions')
    .findOneAndUpdate({ _id: value.sessionId }, {
      $set: { expiresIn: new Date() }
    })
}
