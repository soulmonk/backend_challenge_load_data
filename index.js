'use strict'

const config = require('./src/config')
const Mongo = require('./src/db')
const Loader = require('./src/loader')
const {init: initRepositories} = require('./src/repository')

async function run () {
  console.log('Start', new Date())

  // options
  // 1 - force - ignore bad input file, save valid data
  //

  const mongo = new Mongo(config.db)
  await mongo.init();

  const repositories = initRepositories(mongo);

  const filePath = process.env.FILE_PATH || path.resolve(__dirname, 'data/input.csv')

  const loader = new Loader(repositories, {
    filePath
  })

  await loader.proceed()

  // close db
  await mongo.close();
  console.log('Done', new Date())
}

run()
  .catch(err => (console.error(err), -1))
  .then(process.exit)
