'use strict'

const path = require('path')
const { test } = require('tap')
const sinon = require('sinon')
const Loader = require('../src/loader')

test('should validate data', async t => {
  const findStub = sinon.stub()
  findStub.withArgs({
    programIdentifier: '50777445',
    dataSource: 'WEB 3RD PARTY',
    cardNumber: '53434323',
    memberID: '12345',
    firstName: 'LOAD',
    lastName: 'TEST 17',
    birth: '04/29/19871',
    address1: '3100 S Ashley Drive',
    address2: '',
    city: 'Chandler',
    state: 'AZ',
    zipCode: '85286',
    telephone: '',
    email: 'test17@humancaresystems.com',
    consent: false,
    mobilePhone: '1234567890'
  }).resolves({ _id: 'none' })
  findStub.resolves(null)

  const loader = new Loader({ patient: { find: findStub } }, {})
  let res = await loader.validateRow({
    programIdentifier: '50777445',
    dataSource: 'WEB 3RD PARTY',
    cardNumber: '53434323',
    memberID: '12345',
    firstName: 'LOAD',
    lastName: 'TEST 17',
    birth: '04/29/19871',
    address1: '3100 S Ashley Drive',
    address2: '',
    city: 'Chandler',
    state: 'AZ',
    zipCode: '85286',
    telephone: '',
    email: 'test17@humancaresystems.com',
    consent: false,
    mobilePhone: '1234567890'
  })
  t.deepEqual(res, ['such record already exists'])

  res = await loader.validateRow({
    programIdentifier: '50777445',
    dataSource: 'WEB 3RD PARTY',
    cardNumber: '53434323',
    memberID: '12345',
    firstName: '',
    lastName: 'TEST 17',
    birth: '04/29/19871',
    address1: '3100 S Ashley Drive',
    address2: '',
    city: 'Chandler',
    state: 'AZ',
    zipCode: '85286',
    telephone: '',
    email: '',
    consent: true,
    mobilePhone: '1234567890'
  })
  t.deepEqual(res, ['"CONSENT" equal "Y" but no email address', '"First Name" is not provided'])

  res = await loader.validateRow({
    programIdentifier: '50777445',
    dataSource: 'WEB 3RD PARTY',
    cardNumber: '53434323',
    memberID: '12345',
    firstName: 'TEST',
    lastName: 'TEST 17',
    birth: '04/29/19871',
    address1: '3100 S Ashley Drive',
    address2: '',
    city: 'Chandler',
    state: 'AZ',
    zipCode: '85286',
    telephone: '',
    email: 'test17@humancaresystems.com',
    consent: true,
    mobilePhone: '1234567890'
  })
  t.ok(res)
})

test('map rows', async t => {
  const loader = new Loader({}, {})
  const res = loader.mapRow({
    'Program Identifier': '50777445',
    'Data Source': 'WEB 3RD PARTY',
    'Card Number': '53434323',
    'Member ID': '12345',
    'First Name': 'LOAD',
    'Last Name': 'TEST 17',
    'Date of Birth': '04/29/19871',
    'Address 1': '3100 S Ashley Drive',
    'Address 2': '',
    City: 'Chandler',
    State: 'AZ',
    'Zip code': '85286',
    'Telephone number': '',
    'Email Address': 'test17@humancaresystems.com',
    CONSENT: 'N',
    'Mobile Phone': '1234567890'
  })

  t.deepEqual(res, {
    programIdentifier: '50777445',
    dataSource: 'WEB 3RD PARTY',
    cardNumber: '53434323',
    memberID: '12345',
    firstName: 'LOAD',
    lastName: 'TEST 17',
    birth: '04/29/19871',
    address1: '3100 S Ashley Drive',
    address2: '',
    city: 'Chandler',
    state: 'AZ',
    zipCode: '85286',
    telephone: '',
    email: 'test17@humancaresystems.com',
    consent: false,
    mobilePhone: '1234567890'
  })
})

test('save row', async t => {
  const createStub = sinon.stub()
  createStub.resolves({ insertedId: 'some' })

  const createRecordsStub = sinon.stub()

  const loader = new Loader({ patient: { create: createStub }, email: { createRecords: createRecordsStub } }, {})

  await loader.saveRow({
    programIdentifier: '50777445',
    dataSource: 'WEB 3RD PARTY',
    cardNumber: '53434323',
    memberID: '12345',
    firstName: 'LOAD',
    lastName: 'TEST 17',
    birth: '04/29/19871',
    address1: '3100 S Ashley Drive',
    address2: '',
    city: 'Chandler',
    state: 'AZ',
    zipCode: '85286',
    telephone: '',
    email: 'test17@humancaresystems.com',
    consent: false,
    mobilePhone: '1234567890'
  })

  t.ok(createRecordsStub.notCalled)
  t.ok(createStub.calledOnce)
})

test('save row with email records', async t => {
  const createStub = sinon.stub()
  createStub.resolves({ insertedId: 'some' })

  const createRecordsStub = sinon.stub()
  createRecordsStub.resolves({ insertedIds: { 0: 'some' } })

  const loader = new Loader({ patient: { create: createStub }, email: { createRecords: createRecordsStub } }, {})

  await loader.saveRow({
    programIdentifier: '50777445',
    dataSource: 'WEB 3RD PARTY',
    cardNumber: '53434323',
    memberID: '12345',
    firstName: 'LOAD',
    lastName: 'TEST 17',
    birth: '04/29/19871',
    address1: '3100 S Ashley Drive',
    address2: '',
    city: 'Chandler',
    state: 'AZ',
    zipCode: '85286',
    telephone: '',
    email: 'test17@humancaresystems.com',
    consent: true,
    mobilePhone: '1234567890'
  })

  t.ok(createRecordsStub.calledOnce)
  const args = createRecordsStub.getCall(0).args[0]
  t.equal(args, 'test17@humancaresystems.com')

  t.ok(createStub.calledOnce)
})

test('proceed', async t => {
  const createStub = sinon.stub()
  createStub.resolves('createStubId')

  const findStub = sinon.stub()
  findStub.resolves(null)

  const createRecordsStub = sinon.stub()
  createRecordsStub.resolves('createRecordsStubId')

  const loader = new Loader({ patient: { create: createStub, find: findStub }, email: { createRecords: createRecordsStub } },
    { filePath: path.resolve(path.join(__dirname, 'data/input.csv')) })

  const result = await loader.proceed()

  // no name 2, no email with CONSENT = y 1
  t.equal(result.length, 3)

  // skipped no name, no email, total CONSENT 8
  t.equal(createRecordsStub.callCount, 6)

  // 18 rows in total - 3 skipped = 15
  t.equal(createStub.callCount, 15)
})
