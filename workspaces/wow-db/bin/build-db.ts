import { createDB } from './common'
import { ItemSuffixType } from '@ultrabis/wow-common'

const argv = require('minimist')(process.argv.slice(2))
const dbName = argv._[0]

const createDBFull = async (): Promise<void> => {
  return createDB('full')
}

const createDBMoonkin = async (): Promise<void> => {
  return createDB('moonkin', [
    ItemSuffixType.ArcaneWrath,
    ItemSuffixType.NaturesWrath,
    ItemSuffixType.Sorcery,
    ItemSuffixType.Restoration
  ])
}

const createDBWarlock = async (): Promise<void> => {
  return createDB('warlock', [
    ItemSuffixType.ShadowWrath,
    ItemSuffixType.FieryWrath,
    ItemSuffixType.Sorcery
  ])
}

const createDBMage = async (): Promise<void> => {
  return createDB('mage', [
    ItemSuffixType.FieryWrath,
    ItemSuffixType.FrozenWrath,
    ItemSuffixType.Sorcery
  ])
}

const createDBFeral = async (): Promise<void> => {
  return createDB('feral', [
    ItemSuffixType.Agility,
    ItemSuffixType.Striking,
    ItemSuffixType.TheTiger,
    ItemSuffixType.TheBear,
    ItemSuffixType.TheMonkey,
    ItemSuffixType.TheWolf,
    ItemSuffixType.TheFalcon,
    ItemSuffixType.Stamina,
    ItemSuffixType.Eluding,
    ItemSuffixType.Power
  ])
}

const build = async (): Promise<void> => {
  // handle one-off passed as script argument
  if (dbName && dbName === 'moonkin') {
    return await createDBMoonkin()
  } else if (dbName && dbName === 'warlock') {
    return await createDBWarlock()
  } else if (dbName && dbName === 'feral') {
    return await createDBFeral()
  } else if (dbName && dbName === 'mage') {
    return await createDBMage()
  }

  // make databases
  console.log(`creating 'full' database`)
  await createDBFull()

  console.log(`creating 'moonkin' database`)
  await createDBMoonkin()

  console.log(`creating 'warlock' database`)
  await createDBWarlock()

  console.log(`creating 'feral' database`)
  await createDBFeral()

  console.log(`creating 'mage' database`)
  await createDBMage()

  // console.log(`copying abilities (TODO)`)
  // fs.copyFileSync(`cache/abilityList-master.json`, `src/db/full/ability.json`)

  console.log(`complete`)
}

void build()
