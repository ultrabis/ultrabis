import { fuzzyEquals, cloneObject, Filter } from '@ultrabis/util'
import { DB } from '@ultrabis/wow-db'
import { queryItem, droppedByWorldBoss } from '../src'
import * as filter from '../src/filter'

// Print all items *not* dropped by a world boss
//console.log(filter.itemRecordsByWorldBosses(DB.item, Filter.Exclude))

// Print all items dropped by a world boss
console.log(filter.itemRecordsByWorldBosses(DB.item, Filter.Only))

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
