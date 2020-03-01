'use strict'

const csv = require('csv-parse')
const fs = require('fs')

class Loader {
  constructor (repositories, opts) {
    this.repositories = repositories
    this.opts = opts
  }

  async proceed () {
    const data = await this.readFile()

    let valid
    /** @type {PatientRecord} */
    let row
    let rowIdx = 0
    const result = []

    for (row of data) {
      rowIdx++ // in csv first row is header
      valid = await this.validateRow(row)
      if (valid !== true) {
        result.push({ error: true, message: valid, rowIdx: rowIdx })
        continue
      }

      await this.saveRow(row)
    }

    return result
  }

  async readFile () {
    return new Promise((resolve, reject) => {
      const data = []
      fs.createReadStream(this.opts.filePath)
        .pipe(csv({
          columns: true,
          delimiter: this.opts.delimiter || '|'
        }))
        .on('data', row => {
          data.push(this.mapRow(row))
        })
        .on('end', () => {
          resolve(data)
        })
        .on('error', reject)
    })
  }

  /**
   *
   * @param {Object} row
   * @returns {PatientRecord}
   */
  mapRow (row) {
    // better to adapt type of fields (normalize)
    return {
      programIdentifier: row['Program Identifier'],
      dataSource: row['Data Source'],
      cardNumber: row['Card Number'],
      memberID: row['Member ID'],
      firstName: row['First Name'].trim(),
      lastName: row['Last Name'].trim(),
      birth: row['Date of Birth'],
      address1: row['Address 1'],
      address2: row['Address 2'],
      city: row.City,
      state: row.State,
      zipCode: row['Zip code'],
      telephone: row['Telephone number'],
      email: row['Email Address'],
      consent: row.CONSENT.toLowerCase() === 'y',
      mobilePhone: row['Mobile Phone']
    }
  }

  /**
   *
   * @param {PatientRecord} row
   * @returns {Promise<boolean>}
   */
  async validateRow (row) {
    const result = []
    const record = await this.repositories.patient.find(row)
    if (record) {
      result.push('such record already exists')
    }

    if (row.consent && !row.email) {
      result.push('"CONSENT" equal "Y" but no email address')
    }

    if (!row.firstName) {
      result.push('"First Name" is not provided')
    }

    return result.length === 0 ? true : result
  }

  /**
   * @param {PatientRecord} row
   * @returns {Promise<void>}
   */
  async saveRow (row) {
    await this.repositories.patient.create(row)
    if (row.consent) {
      await this.repositories.email.createRecords(row.email)
    }
  }
}

module.exports = Loader
