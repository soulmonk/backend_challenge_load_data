'use strict'
const Patient = require('./patient')
const Email = require('./email')

function init (mongo) {
  return {
    patient: new Patient(mongo.collections.Patient),
    email: new Email(mongo.collections.Email)
  }
}

module.exports = { init }
