'use strict'

const { MongoClient } = require('mongodb')

let _mongoClient

module.exports = async function getMongoClient () {
  if (_mongoClient !== undefined) {
    return _mongoClient
  }

  _mongoClient = await MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true })
  return _mongoClient
}
