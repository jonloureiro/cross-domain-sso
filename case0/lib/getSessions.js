'use strict'

// TODO: tests

const { ObjectID } = require('mongodb')

const getMongoClient = require('./getMongoClient')

module.exports = async function getSessions (userId) {
  const mongoClient = await getMongoClient()

  return mongoClient
    .db('cross-domain-sso')
    .collection('sessions')
    .aggregate([
      { $match: { createBy: new ObjectID(userId) } },
      {
        $lookup: {
          from: 'tokens',
          localField: '_id',
          foreignField: 'sessionId',
          as: 'tokens'
        }
      }
    ]).toArray()
}
