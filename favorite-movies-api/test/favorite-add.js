'use strict'

const nock = require('nock')
const app = require('../app')
const sinon = require('sinon')
const { expect } = require('chai')
const axiosist = require('axiosist')
const mongoose = require('mongoose')

const config = {
  ...require('../config'),
  omdb: {
    url: 'http://omdb.service.mock',
    apiKey: 'abcd1234'
  }
}

const movieFixture = require('./fixtures/movie')
const userFixture = require('./fixtures/user-find')

const UserStorage = require('../app/database/storages/user')
const UserRepository = require('../app/database/repositories/user')

describe('PUT /users/:user/favorites/:movie', () => {
  let api

  before(() => {
    sinon.stub(mongoose, 'createConnection')
      .returns(mongoose)

    sinon.stub(UserRepository.prototype, 'find')
    sinon.stub(UserStorage.prototype, 'addFavorite')

    api = axiosist(app(config, 'testing'))
  })

  after(() => {
    nock.cleanAll()
    mongoose.createConnection.restore()
    UserRepository.prototype.find.restore()
    UserStorage.prototype.addFavorite.restore()
  })

  describe('when user does not exist', () => {
    let response

    before(async () => {
      UserRepository.prototype.find.returns(null)

      response = await api.put('/users/5b35127c706ad4001019923f')
        .catch(err => err.response)
    })

    after(() => {
      UserRepository.prototype.find.reset()
    })

    it('returns 404', async () => {
      expect(response.status).to.be.equals(404)
    })

    it('has a `not_found` error code', async () => {
      expect(response.data.error.code).to.be.equals('not_found')
    })
  })

  describe('when movie does no exist', () => {
    let response

    before(async () => {
      UserRepository.prototype.find.returns(userFixture)

      nock(config.omdb.url)
        .get(`/?apikey=${config.omdb.apiKey}&i=tt1659337`)
        .once()
        .reply(200, {
          Response: 'False',
          Error: 'Incorrect IMDb ID.'
        })

      response = await api.put('/users/5b35127c706ad4001019923f/favorites/tt1659337')
        .catch(err => err.response)
    })

    it('returns 422', async () => {
      expect(response.status).to.be.equals(422)
    })

    it('has an `invalid_movie` error code', async () => {
      expect(response.data.error.code).to.be.equals('invalid_movie')
    })
  })

  describe('when movie exists', () => {
    let response

    before(async () => {
      UserStorage.prototype.addFavorite.returns(undefined)
      UserRepository.prototype.find.returns(userFixture)

      nock(config.omdb.url)
        .get(`/?apikey=${config.omdb.apiKey}&i=tt1659337`)
        .once()
        .reply(200, movieFixture)

      response = await api.put('/users/5b35127c706ad4001019923f/favorites/tt1659337')
        .catch(err => err.response)
    })

    after(() => {
      UserRepository.prototype.find.reset()
    })

    it('returns 204', async () => {
      expect(response.status).to.be.equals(204)
    })

    it('has an empty body', async () => {
      expect(response.data).to.be.equals('')
    })
  })
})
