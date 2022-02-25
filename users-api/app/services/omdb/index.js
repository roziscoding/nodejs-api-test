'use strict'

const axios = require('axios')
const Error = require('./errors/error')
const NotFoundError = require('./errors/not-found-error')
const UnresponsiveServiceError = require('./errors/unresponsive-service-error')

const errorHandler = (err) => {
  if (!err.response) {
    throw new UnresponsiveServiceError(err.message)
  }

  throw new Error(err.message, err.stack)
}

class OmdbService {
  constructor ({ url, timeout, apiKey }) {
    this.__client = axios.create({
      baseURL: url,
      timeout,
      params: {
        apikey: apiKey
      }
    })
  }

  async find (id) {
    const response = await this.__client.get('/', {
      params: {
        i: id
      }
    })
    .catch(errorHandler)

    if (response.data.Response === 'False') {
      throw new NotFoundError(response.data.Error)
    }

    return response.data
  }
}

module.exports = OmdbService
module.exports.Error = Error
module.exports.NotFoundError = NotFoundError
