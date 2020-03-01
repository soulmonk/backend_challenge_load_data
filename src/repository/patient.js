'use strict'
/**
 * @typedef {Object} PatientRecord
 * @property {String} programIdentifier
 * @property {String} dataSource
 * @property {String} cardNumber
 * @property {String} memberID
 * @property {String} firstName
 * @property {String} lastName
 * @property {String} birth
 * @property {String} address1
 * @property {String} address2
 * @property {String} city
 * @property {String} state
 * @property {String} zipCode
 * @property {String} telephone
 * @property {String} email
 * @property {boolean} consent
 * @property {String} mobilePhone
 */

/**
 *
 */
class Patient {
  constructor (collection) {
    this.collection = collection
  }

  async find (search) {
    return this.collection.findOne(search)
  }

  async create (data) {
    const { insertedId } = await this.collection.insertOne(data)
    return insertedId
  }
}

module.exports = Patient
