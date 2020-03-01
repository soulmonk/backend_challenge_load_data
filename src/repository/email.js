'use strict'

const DAY_IN_MS = 86400000

class Email {
  constructor (collection) {
    this.collection = collection
  }

  async createRecords (email, days = 4) {
    const rows = []
    let now = new Date()
    now.setHours(0, 0, 0, 0)
    now = now.getTime()

    for (let i = 0; i < days; i++) {
      rows.push({
        email,
        date: new Date((i + 1) * DAY_IN_MS + now)
      })
    }

    const { insertedIds } = await this.collection.insertMany(rows)
    return insertedIds
  }
}

module.exports = Email
