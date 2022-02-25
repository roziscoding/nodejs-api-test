'use strict'

class UserStorage {
  constructor (model) {
    this.__model = model
  }

  async create (params) {
    const { username, password, email } = params

    const user = {
      username,
      password,
      email
    }

    return this.__model.create(user)
      .lean()
  }

  async addFavorite (id, movie) {
    await this.__model.update({ _id: id }, { $push: { favorites: movie } }, { upsert: false, multi: false })
  }
}

module.exports = UserStorage
