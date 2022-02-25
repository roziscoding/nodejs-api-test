'use strict'

const { Schema } = require('mongoose')

const properties = {
  imdb: {
    id: {
      type: String,
      required: true
    },
    rating: {
      type: String,
      required: false,
      default: () => null
    }
  },
  title: {
    type: String,
    required: true
  },
  releaseYear: {
    type: Number,
    required: true
  },
  poster: {
    type: String,
    required: false,
    default: () => null
  }
}

const options = {
  _id: false,
  id: false,
  strict: true,
  safe: true,
  versionKey: false,
  timestamps: false
}

const schema = new Schema(properties, options)

const factory = (connection) => {
  throw new Error('Cannot instantiate an embedded document')
}

module.exports = schema
module.exports.factory = factory
