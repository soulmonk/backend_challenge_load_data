'use strict'

const config = require('./config/config')
const Mongo = require('./src/db')
const Loader = require('./src/loader')
const { init: initRepositories } = require('./src/repository')

async function run () {
  console.log('Start', new Date())

  if (!process.env.FILE_PATH) {
    throw new Error('FILE_PATH is required')
  }

  // options
  // 1 - force - ignore bad input file, save valid data
  //

  const mongo = new Mongo(config.db)
  await mongo.init()

  const repositories = initRepositories(mongo)

  const filePath = process.env.FILE_PATH

  const loader = new Loader(repositories, {
    filePath
  })

  const result = await loader.proceed()

  console.log('result of uploaded data: ', result)

  // close db
  await mongo.close()
  console.log('Done', new Date())
}

run()
  .catch(err => {
    console.error(err)
    return -1
  })
  .then(process.exit)
