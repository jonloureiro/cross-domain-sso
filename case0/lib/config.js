'use strict'

const config = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017',
  SECRET: process.env.SECRET || 's3cr3t'
}

Object.freeze(config)

module.exports = config
