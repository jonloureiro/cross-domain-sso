'use strict'

module.exports = async function findUserByUsername (mongoClient, username) {
  if (username === 'example') {
    return Promise.resolve({
      _id: '6044e81557c2a280ffb3f0b7',
      username: 'example',
      password: '$2a$10$SSvJdlexJRSYI405YK9cfOVNAgNBYN4Y/VOVGX3fU1s1mvkB3UxrW'
    })
  }
  return Promise.resolve(null)
}
