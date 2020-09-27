
/*
import { ItemRecord, EnchantRecord } from '@ultrabis/wow-common'

const itemRecord: ItemRecord = {} as ItemRecord
const enchantRecord: EnchantRecord = {} as EnchantRecord

console.log(itemRecord)
console.log(enchantRecord)
*/

import { classesMaskFromText } from '../src/index'

const classesMask = classesMaskFromText (`Classes: Warrior, Paladin, Hunter`)
console.log(classesMask)
