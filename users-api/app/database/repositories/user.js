'use strict'

class UserReposoitory {
  constructor (model) {
    this.__model = model
  }

  async find (id) {
    return this.__model.findOne({ _id: id })
  }
}

module.exports = UserReposoitory
