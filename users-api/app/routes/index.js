'use strict'

module.exports = {
  users: {
    find: require('./users-find')
  },
  favorites: {
    add: require('./favorites-add')
  }
}
