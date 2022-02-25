'use strict'

const Error = require('./error')
const { format } = require('util')

const MESSAGE = 'user "%s" could not be found'

class NotFoundError extends Error {
  constructor (id) {
    super(format(MESSAGE, id))
  }
}

module.exports = NotFoundError
