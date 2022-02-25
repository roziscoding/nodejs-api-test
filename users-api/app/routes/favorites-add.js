'use strict'

const rescue = require('express-rescue')
const { HttpError } = require('@mantris/appify')

const User = require('../services/user')

const factory = (service) => ([
  rescue(async (req, res) => {
    await service.addFavorite(req.params.user, req.params.movie)

    res.status(204)
      .end()
  }),
  (err, req, res, next) => {
    if (err instanceof User.NotFoundError) {
      return next(new HttpError.NotFound({ message: err.message }))
    }

    if (err instanceof User.MovieNotFoundError) {
      return next(new HttpError.UnprocessableEntity({ message: err.message, code: 'invalid_movie' }))
    }

    next(err)
  }
])

module.exports = { factory }
