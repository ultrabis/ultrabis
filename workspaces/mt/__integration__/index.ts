import { DBFull } from '@ultrabis/db'
import { fuzzyEquals, cloneObject } from '@ultrabis/util'
import { ItemRecord, ItemObject } from '@ultrabis/common'

const myJSON = DBFull.item

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

console.log(findItemObjectById(myJSON, 10250))
