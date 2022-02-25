'use strict'

const Omdb = require('../omdb')
const Error = require('./errors/error')
const NotFoundError = require('./errors/not-found-error')
const MovieNotFoundError = require('./errors/movie-not-found-error')

const errorHandler = (err) => {
  if (err instanceof Omdb.NotFoundError) {
    throw new MovieNotFoundError(err.message)
  }

  throw new Error(err.message, err.stack)
}

class UserService {
  constructor (repository, storage, omdbService) {
    this.__repository = repository
    this.__storage = storage
    this.__omdbService = omdbService
  }

  async find (id) {
    const user = await this.__repository.find(id)

    if (!user) {
      throw new NotFoundError(id)
    }

    return user
  }

  async addFavorite (id, movieId) {
    await this.find(id)
    const movieData = await this.__omdbService.find(movieId)
      .catch(errorHandler)

    const movie = {
      imdb: {
        id: movieData.imdbID,
        rating: movieData.imdbRating
      },
      title: movieData.Title,
      releaseYear: parseInt(movieData.Year),
      poster: movieData.Poster
    }

    await this.__storage.addFavorite(id, movie)
  }
}

module.exports = UserService
module.exports.Error = Error
module.exports.NotFoundError = NotFoundError
module.exports.MovieNotFoundError = MovieNotFoundError
