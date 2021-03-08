'use strict'

const { MongoClient } = require('mongodb')

const config = require('./config')

let _mongoClient

module.exports = async function getMongoClient (mongoClientOptions) {
  if (_mongoClient && _mongoClient.isConnected()) return _mongoClient
  _mongoClient = await MongoClient.connect(config.MONGO_URI, { ...mongoClientOptions, useUnifiedTopology: true })
  return _mongoClient
}
