'use strict'

const config = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017'
}

Object.freeze(config)

module.exports = config
