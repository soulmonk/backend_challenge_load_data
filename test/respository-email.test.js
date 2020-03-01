'use strict'

const { test } = require('tap')
const EmailRepository = require('../src/repository/email')
const sinon = require('sinon')

test('should create multiple records (default arguments)', async t => {
  const stubCollection = {
    insertMany: sinon.stub().resolves({ insertedIds: {} })
  }
  const repository = new EmailRepository(stubCollection)
  await repository.createRecords('example@example.com')

  t.ok(stubCollection.insertMany.calledOnce)
  const args = stubCollection.insertMany.getCall(0).args[0]
  t.equal(args.length, 4)
  t.equal(args[0].email, 'example@example.com')
})

test('should create multiple records', async t => {
  const stubCollection = {
    insertMany: sinon.stub().resolves({ insertedIds: {} })
  }
  const repository = new EmailRepository(stubCollection)
  await repository.createRecords('example2@example.com', 5)

  t.ok(stubCollection.insertMany.calledOnce)
  const args = stubCollection.insertMany.getCall(0).args[0]
  t.equal(args.length, 5)
  t.equal(args[0].email, 'example2@example.com')
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 1)
  t.equal(args[0].date.toString(), date.toString())
})
