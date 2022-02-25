'use strict'

const rescue = require('express-rescue')
const { HttpError } = require('@mantris/appify')

const User = require('../services/user')

const factory = (service) => ([
  rescue(async (req, res) => {
    const user = await service.find(req.params.user)

    res.status(200)
      .json(user)
  }),
  (err, req, res, next) => {
    if (err instanceof User.NotFoundError) {
      return next(new HttpError.NotFound({ message: err.message }))
    }

    next(err)
  }
])

module.exports = { factory }
