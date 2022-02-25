'use strict'

const mongoose = require('mongoose')

// Models
const userModel = require('./models/user')

// Repositories
const UserRepository = require('./repositories/user')

// Storages
const UserStorage = require('./storages/user')

const factory = ({ uri }) => {
  const connection = mongoose.createConnection(uri)

  const models = {
    User: userModel.factory(connection)
  }

  const repositories = {
    user: new UserRepository(models.User)
  }

  const storages = {
    user: new UserStorage(models.User)
  }

  return { repositories, storages }
}

module.exports = { factory }
