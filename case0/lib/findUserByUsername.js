'use strict'

module.exports = async function findUserByUsername (mongoClient, username) {
  return mongoClient
    .db('cross-domain-sso')
    .collection('users')
    .findOne({ username })
}
