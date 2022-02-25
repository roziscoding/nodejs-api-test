'use strict'

const env = require('sugar-env')

module.exports = {
  mongodb: {
    uri: env.get('MONGODB_URI')
  },
  omdb: {
    url: env.get('OMDB_URL'),
    apiKey: env.get('OMDB_API_KEY'),
    timeout: parseInt(env.get('OMDB_TIMEOUT', 3000))
  }
}
