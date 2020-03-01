'use strict'

const MongoDb = require('mongodb')

const MongoClient = MongoDb.MongoClient

class Mongo {
  constructor (opts) {
    this.opts = opts
    this.db = null
    this.client = null
  }

  async init () {
    this.client = await MongoClient.connect(this.opts.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.db = this.client.db(this.opts.databaseName)

    this.collections = {
      Patient: await this.db.collection('patient'),
      Email: await this.db.collection('email'),
    }
  }

  async close () {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
    }
  }
}

module.exports = Mongo
