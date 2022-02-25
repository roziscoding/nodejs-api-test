'use strict'

const { Schema } = require('mongoose')

const Movie = require('./movie')

const properties = {
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  favorites: {
    type: [Movie],
    required: true,
    default: () => []
  }
}

const options = {
  collection: 'users',
  id: false,
  safe: true,
  strict: true,
  versionKey: false,
  timestamps: false
}

const schema = new Schema(properties, options)

const factory = (connection) => {
  return connection.model('User', schema)
}

module.exports = schema
module.exports.factory = factory
