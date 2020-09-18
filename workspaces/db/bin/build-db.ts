import * as common from './common'
import rimraf from 'rimraf'

const argv = require('minimist')(process.argv.slice(2))
const dbName = argv._[0]

const build = async (): Promise<void> => {
  if (dbName && dbName === 'moonkin') {
    return await common.createDBMoonkin()
  } else if (dbName && dbName === 'warlock') {
    return await common.createDBWarlock()
  } else if (dbName && dbName === 'feral') {
    return await common.createDBFeral()
  } else if (dbName && dbName === 'mage') {
    return await common.createDBMage()
  }

  // clean destination
  console.log(`cleaning dist...`)
  rimraf.sync(`dist`)

  console.log(`creating 'full' database`)
  await common.createDBFull()

  console.log(`creating 'moonkin' database`)
  await common.createDBMoonkin()

  console.log(`creating 'warlock' database`)
  await common.createDBWarlock()

  console.log(`creating 'feral' database`)
  await common.createDBFeral()

  console.log(`creating 'mage' database`)
  await common.createDBMage()

  console.log(`complete`)
}

void build()
