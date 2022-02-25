'use strict'

const routes = require('./routes')
const database = require('./database')
const appify = require('@mantris/appify')

// Services
const UserService = require('./services/user')
const OmdbService = require('./services/omdb')

module.exports = appify((app, config) => {
  const { repositories, storages } = database.factory(config.mongodb)

  const omdbService = new OmdbService(config.omdb)
  const userService = new UserService(repositories.user, storages.user, omdbService)

  app.get('/users/:user', routes.users.find.factory(userService))
  app.put('/users/:user/favorites/:movie', routes.favorites.add.factory(userService))
})
