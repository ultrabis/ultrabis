import {
  ItemQuery,
  ItemRecord,
  ItemSuffixQuery,
  ItemSuffixRecord,
  ItemSuffixType,
  itemBaseName,
  itemNameIsRandomEnchant
} from '@ultrabis/common'

import {
  affixItemRecord,
  itemRecordsFromBase,
  itemRecordsFilterByName,
  itemRecordsFilterByPartialName,
  itemRecordsFindByName,
  itemRecordsFindById,
  itemRecordIsBase
} from './item'

import { enumKeys, enumValuesFromKeys, fuzzyIncludes } from '@ultrabis/util'

export const queryItemSuffix = (
  itemSuffixRecords: ItemSuffixRecord[],
  opts: ItemSuffixQuery
): ItemSuffixRecord[] => {
  if (opts.id) {
    // simple id lookup
    return itemSuffixRecords.filter((rec: ItemSuffixRecord) => {
      return rec.id === opts.id
    })
  }

  return []
}

export const queryItemByName = (
  itemRecords: ItemRecord[],
  itemSuffixRecords: ItemSuffixRecord[],
  itemName: string
): ItemRecord[] => {
  if (itemNameIsRandomEnchant(itemName)) {
    // find the base item, grab all it's random enchants, then filter by name
    const base = itemRecordsFindByName(itemRecords, itemBaseName(itemName))
    if (!base) {
      return []
    }

    const recs = queryItem(itemRecords, itemSuffixRecords, { id: base.id })
    if (!recs.length) {
      return []
    }

    return itemRecordsFilterByName(recs, itemName)
  }

  // standard non-random-echant ite
  return itemRecordsFilterByName(itemRecords, itemName)
}

export const queryItemByPartialName = (
  itemRecords: ItemRecord[],
  itemSuffixRecords: ItemSuffixRecord[],
  partialName: string
): ItemRecord[] => {
  const items = [] as ItemRecord[]

  /////////////////////////////////////////////////////////////////
  // first handle basic search of item names
  /////////////////////////////////////////////////////////////////

  const basicItems = itemRecordsFilterByPartialName(itemRecords, partialName)
  for (const basicItem of basicItems) {
    items.push(...itemRecordsFromBase(basicItem, itemSuffixRecords))
  }

  /////////////////////////////////////////////////////////////////
  // now handle search of random enchant item names
  /////////////////////////////////////////////////////////////////

  // 1. get suffix records where type matches 'partialName' e.g. 'Arcane Wrath'
  const suffixTypeNames = enumKeys(ItemSuffixType).filter((k) => {
    return fuzzyIncludes(k, partialName.replace(/of /g, ''))
  })
  const suffixTypeValues = enumValuesFromKeys(ItemSuffixType, suffixTypeNames)
  const suffixRecords = itemSuffixRecords.filter((rec) => {
    return suffixTypeValues.includes(rec.type)
  })
  console.log(`name: ${suffixTypeValues}`)

  // 2. iterate validSuffixId's for each item, pushing any matching
  // random enchants onto the final array
  for (const itemRecord of itemRecords) {
    for (const sid of itemRecord.validSuffixIds ? itemRecord.validSuffixIds : []) {
      for (const suffixRecord of suffixRecords) {
        if (suffixRecord.id === sid) {
          items.push(affixItemRecord(itemRecord, suffixRecord))
        }
      }
    }
  }

  return items
}

export const queryItemById = (
  itemRecords: ItemRecord[],
  itemSuffixRecords: ItemSuffixRecord[],
  itemId: number
): ItemRecord[] => {
  // look up and return item; if it's a base item return all the enchants
  const item = itemRecordsFindById(itemRecords, itemId)
  if (!item) {
    return []
  }

  if (itemRecordIsBase(item)) {
    return itemRecordsFromBase(item, itemSuffixRecords)
  }

  return [item]
}

export const queryItemByIdAndSuffixId = (
  itemRecords: ItemRecord[],
  itemSuffixRecords: ItemSuffixRecord[],
  id: number,
  suffixId: number
): ItemRecord[] => {
  const item = itemRecords.find((rec: ItemRecord) => {
    return rec.id === id && rec.validSuffixIds?.includes(suffixId ? suffixId : 0)
  })
  return item
    ? [affixItemRecord(item, queryItemSuffix(itemSuffixRecords, { id: suffixId })[0])]
    : []
}

export const queryItem = (
  itemRecords: ItemRecord[],
  itemSuffixRecords: ItemSuffixRecord[],
  opts: ItemQuery
): ItemRecord[] => {
  if (opts.id && opts.suffixId) {
    return queryItemByIdAndSuffixId(itemRecords, itemSuffixRecords, opts.id, opts.suffixId)
  } else if (opts.id) {
    return queryItemById(itemRecords, itemSuffixRecords, opts.id)
  } else if (opts.name && opts.partialMatches) {
    return queryItemByPartialName(itemRecords, itemSuffixRecords, opts.name)
  } else if (opts.name) {
    return queryItemByName(itemRecords, itemSuffixRecords, opts.name)
  }

  return []
}
