'use strict'

module.exports = async function findUserByUsername (mongoClient, username) {
  mongoClient
    .db('cross-domain-sso')
    .collection('users')
    .findOne({ username })
}
