import { fuzzyEquals, cloneObject } from '@ultrabis/util'
import { DB } from '@ultrabis/db'
import {
  ItemQuery,
  ItemRecord,
  ItemEntity,
  ItemSuffixQuery,
  ItemSuffixRecord
} from '@ultrabis/common'
import { affixItemRecord } from '../src'

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

const queryItemSuffix = (
  itemSuffixRecords: ItemSuffixRecord[],
  opts: ItemSuffixQuery
): ItemSuffixRecord[] => {
  if (opts.id) {
    return itemSuffixRecords.filter((rec: ItemSuffixRecord) => {
      return rec.id === opts.id
    })
  }

  return []
}

const queryItem = (
  itemRecords: ItemRecord[],
  itemSuffixRecords: ItemSuffixRecord[],
  opts: ItemQuery
): ItemRecord[] => {
  //const result: ItemRecord[] = [] as ItemRecord[]

  if (opts.id && opts.suffixId) {
    // find the base item record. this record will have a matching `id`
    // as well as `suffixId` included in it's `validSuffixIds` array.
    const myItemRecord = itemRecords.find((rec: ItemRecord) => {
      return rec.id === opts.id && rec.validSuffixIds?.includes(opts.suffixId ? opts.suffixId : 0)
    })

    return myItemRecord
      ? [
          affixItemRecord(
            myItemRecord,
            queryItemSuffix(itemSuffixRecords, { id: opts.suffixId })[0]
          )
        ]
      : []
  }

  return []
}

const items = queryItem(DB.item, DB.itemSuffix, { id: 10250, suffixId: 1825 })
console.log(items)
