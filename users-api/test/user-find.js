'use strict'

const app = require('../app')
const sinon = require('sinon')
const { expect } = require('chai')
const config = require('../config')
const axiosist = require('axiosist')
const mongoose = require('mongoose')

const userFixture = require('./fixtures/user-find')

const UserRepository = require('../app/database/repositories/user')

describe('GET /users/:user', () => {
  let api

  before(() => {
    sinon.stub(mongoose, 'createConnection')
      .returns(mongoose)

    sinon.stub(UserRepository.prototype, 'find')

    api = axiosist(app(config, 'testing'))
  })

  after(() => {
    mongoose.createConnection.restore()
    UserRepository.prototype.find.restore()
  })

  describe('when user does not exist', () => {
    let response

    before(async () => {
      UserRepository.prototype.find.returns(null)

      response = await api.get('/users/5b35127c706ad4001019923f')
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

  describe('when user exists', () => {
    let response

    before(async () => {
      UserRepository.prototype.find.returns(userFixture)

      response = await api.get('/users/5b35127c706ad4001019923f')
        .catch(err => err.response)
    })

    after(() => {
      UserRepository.prototype.find.reset()
    })

    it('returns 200', async () => {
      expect(response.status).to.be.equals(200)
    })

    it('returns an object', async () => {
      expect(response.data).to.be.an('object')
    })

    describe('the object', () => {
      it('has an `_id` property', async () => {
        expect(response.data).to.have.a.property('_id')
      })

      it('has a `username` property', async () => {
        expect(response.data).to.have.a.property('username')
      })

      it('has a `passowrd` property', async () => {
        expect(response.data).to.have.a.property('password')
      })

      it('has an `email` property', async () => {
        expect(response.data).to.have.a.property('email')
      })
    })
  })
})
