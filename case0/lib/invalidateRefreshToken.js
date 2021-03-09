'use strict'

const getMongoClient = require('./getMongoClient')

module.exports = async function invalidateRefreshToken (refreshToken) {
  const mongoClient = await getMongoClient()

  await mongoClient
    .db('cross-domain-sso')
    .collection('tokens')
    .findOneAndUpdate({ refreshToken }, {
      $set: { expiresIn: new Date() }
    })
}
