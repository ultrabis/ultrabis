import { DB, queryCreature, queryZone, queryItem, queryItemSuffix } from '../src'
import { CreatureType, ZoneType } from '@ultrabis/wow-common'
import { ItemSuffixType, ItemBonusType } from '@ultrabis/wow-common'

console.log(queryItem(DB.item, DB.itemSuffix, { name: 'arcane wrath', partialMatches: true }))
//console.log(queryItem(DB.item, DB.itemSuffix, { name: 'masters hat', partialMatches: true }))
//console.log(queryItem(DB.item, DB.itemSuffix, { name: 'Desertwalker Cane' }))

//console.log(queryItemSuffix(DB.itemSuffix, { id: 287, typeName: 'stamina' }))
//console.log(queryItemSuffix(DB.itemSuffix, { id: 287, typeName: 'sta', partialMatches: true }))
//console.log(queryItemSuffix(DB.itemSuffix, { bonusType: ItemBonusType.Agility }))
//console.log(
//  JSON.stringify(queryItemSuffix(DB.itemSuffix, { bonusTypeName: 'agi', partialMatches: true }))
//)
//console.log(
//  JSON.stringify(
//    queryItemSuffix(DB.itemSuffix, { type: ItemSuffixType.ArcaneWrath, bonusValue: 40 })
//  )
//)
//console.log(queryZone(DB.zone, { type: ZoneType.Battleground }))
//console.log(queryZone(DB.zone, { name: 'molten', partialMatches: true }))
//console.log(queryCreature(DB.creature, { type: CreatureType.Beast }))
//console.log(queryCreature(DB.creature, { name: 'rag', partialMatches: true }))

/*
import { enumKeyFromValue, prettyInterCap } from '@ultrabis/util'
import { DB } from '@ultrabis/wow-db'
import { ItemRecord, ItemSuffixRecord, ItemQuery, ItemSlot, Zone } from '@ultrabis/wow-common'
import * as match from '../src/match'
import { itemRecordsFromBase, droppedByWorldBoss } from '../src/item'

import {
  queryItemByIdAndSuffixId,
  queryItemById,
  queryItemByName,
  queryItemByPartialName
} from '../src/query'

const queryItem = (
  itemRecords: ItemRecord[],
  itemSuffixRecords: ItemSuffixRecord[],
  opts: ItemQuery
): ItemRecord[] => {
  let primary = [] as ItemRecord[]

  // first handle primary identifiers. only one set of primary identifiers is used e.g.
  // if both `id` and `name` are passed, we'll ignore `name` in favor of `id`.
  if (opts.id && opts.suffixId) {
    primary = queryItemByIdAndSuffixId(itemRecords, itemSuffixRecords, opts.id, opts.suffixId)
  } else if (opts.id) {
    primary = queryItemById(itemRecords, itemSuffixRecords, opts.id)
  } else if (opts.name) {
    primary = queryItemByName(itemRecords, itemSuffixRecords, opts.name)
  } else if (opts.partialName) {
    primary = queryItemByPartialName(itemRecords, itemSuffixRecords, opts.partialName)
  } else {
    primary = itemRecords
  }

  // check additional filters, writing to `secondary`
  const secondary = primary.filter((itemRecord: ItemRecord) => {
    // slot
    if (opts.slot && !match.itemRecordSlot(itemRecord, opts.slot)) {
      return false
    }

    return true
  })

  // build final array; any 'base items' need to be converted to random enchants
  const final = [] as ItemRecord[]
  for (const itemRecord of secondary) {
    final.push(...itemRecordsFromBase(itemRecord, itemSuffixRecords))
  }

  return final
}

const results = queryItem(DB.item, DB.itemSuffix, { id: 10250, suffixId: 802, slot: ItemSlot.Head })
console.log(results)

// Desertwalker Cane is a phase 5 item
const results = queryItem(DB.item, DB.itemSuffix, { name: 'Desertwalker Cane' })
console.log(results)
if (results[0].droppedAt) {
  const droppedAt = enumKeyFromValue(Zone, results[0].droppedAt)
  if (droppedAt) {
    console.log(prettyInterCap(droppedAt))
  }
}

console.log(DB.zone)

//const droppedBy
//console.log(`Dropped At: `)

/*
const result = queryItem(DB.item, DB.itemSuffix, { name: 'Blacklight Bracer' })
if (droppedByWorldBoss(result[0])) {
  console.log(`yes, dropped by world boss`)
} else {
  console.log(`no, not dropped by world boss`)
}
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
const results = DB.item.filter((itemRecord: ItemRecord) => {
  if (match.itemRecordId(itemRecord, 10250, Match.Includes)) {
    return true
  }

  return false
})

console.log(results)
*/

/*
const results = DB.item.filter((itemRecord: ItemRecord) =>
  itemRecordsById(itemRecord, 10250, Filter.IncludeOnly)
)
console.log(results)
*/

//filter.itemRecordsById

// Print all items *not* dropped by a world boss
//console.log(filter.itemRecordsByWorldBosses(DB.item, Filter.Exclude))

// Print all items dropped by a world boss
//console.log(filter.itemRecordsByWorldBosses(DB.item, Filter.Only))

/*
const result = queryItem(DB.item, DB.itemSuffix, { name: 'Blacklight Bracer' })
if (droppedByWorldBoss(result[0])) {
  console.log('Yes, dropped by world boss')
} else {
  console.log('No, not dropped by world boss')
}
*/

/*
const result = queryItem(DB.item, DB.itemSuffix, { name: 'masters hat of arcane wrath' })
console.log(result)
*/

/*
const result = queryItem(DB.item, DB.itemSuffix, { partialName: 'arcane' })
for (const x of result) {
  console.log(x.name)
}
*/

/*
const findItemRecordsByName = (itemRecords: ItemRecord[], itemName: string): ItemRecord[] => {
  return itemRecords.filter((itemRecord: ItemRecord) => {
    return fuzzyEquals(itemRecord.name, itemName)
  })
}

const findItemRecordById = (
  itemRecords: ItemRecord[],
  itemId: number,
  itemSuffixId?: number
): ItemRecord | undefined => {
  return itemRecords.find((itemRecord: ItemRecord) => {
    if (itemSuffixId) {
      return itemRecord.id === itemId && itemRecord.suffixId === itemSuffixId
    } else {
      return itemRecord.id === itemId
    }
  })
}

const findItemObjectById = (
  itemRecords: ItemRecord[],
  itemId: number,
  itemSuffixId?: number
): ItemObject | undefined => {
  const myItemRecord = findItemRecordById(itemRecords, itemId, itemSuffixId)
  const myItemObject = myItemRecord ? cloneObject(myItemRecord) : undefined
  return myItemObject
}

//console.log(findItemRecordsByName(myJSON, `masters hat`))
//console.log(findItemRecordById(myJSON, 10250))
//console.log(findItemObjectById(myJSON, 10250))

*/
