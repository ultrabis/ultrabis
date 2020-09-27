import {
  ItemQuery,
  ItemRecord,
  ItemSuffixQuery,
  ItemSuffixRecord,
  ItemSuffixType,
  ItemBonusType,
  itemBaseName,
  itemNameIsRandomEnchant
} from '@ultrabis/wow-common'

import { itemRecordAffix, itemRecordsFromBase, itemRecordIsBase } from './item'

import * as filter from './filter'

import { enumKeys, enumValuesFromKeys, fuzzyIncludes, fuzzyEquals } from '@ultrabis/util'

export const queryItemSuffix = (
  itemSuffixRecords: ItemSuffixRecord[],
  opts: ItemSuffixQuery
): ItemSuffixRecord[] => {
  if (opts.id) {
    return queryItemSuffixById(itemSuffixRecords, opts.id)
  } else if (opts.type) {
    return queryItemSuffixByType(itemSuffixRecords, opts.type)
  } else if (opts.name) {
    return queryItemSuffixByName(itemSuffixRecords, opts.name)
  } else if (opts.partialName) {
    return queryItemSuffixByPartialName(itemSuffixRecords, opts.partialName)
  }

  return []
}

export const queryItemSuffixById = (
  itemSuffixRecords: ItemSuffixRecord[],
  id: number
): ItemSuffixRecord[] => {
  return filter.itemSuffixRecordsById(itemSuffixRecords, id)
}

export const queryItemSuffixByType = (
  itemSuffixRecords: ItemSuffixRecord[],
  type: ItemSuffixType
): ItemSuffixRecord[] => {
  return filter.itemSuffixRecordsByType(itemSuffixRecords, type)
}

export const queryItemSuffixByBonusType = (
  itemSuffixRecords: ItemSuffixRecord[],
  bonusType: ItemBonusType
): ItemSuffixRecord[] => {
  return filter.itemSuffixRecordsByBonusType(itemSuffixRecords, bonusType)
}

export const queryItemSuffixByBonusValue = (
  itemSuffixRecords: ItemSuffixRecord[],
  bonusValue: number
): ItemSuffixRecord[] => {
  return itemSuffixRecords.filter((rec: ItemSuffixRecord) => {
    for (const b of rec.bonus) {
      if (b.value === bonusValue) {
        return true
      }
    }
    return false
  })
}

export const queryItemSuffixByName = (
  itemSuffixRecords: ItemSuffixRecord[],
  partialName: string
): ItemSuffixRecord[] => {
  const suffixTypeValues = enumValuesFromKeys(
    ItemSuffixType,
    enumKeys(ItemSuffixType).filter((k) => {
      return fuzzyEquals(k, partialName)
    })
  )

  return itemSuffixRecords.filter((rec) => {
    return suffixTypeValues.includes(rec.type)
  })
}

export const queryItemSuffixByPartialName = (
  itemSuffixRecords: ItemSuffixRecord[],
  partialName: string
): ItemSuffixRecord[] => {
  const suffixTypeValues = enumValuesFromKeys(
    ItemSuffixType,
    enumKeys(ItemSuffixType).filter((k) => {
      return fuzzyIncludes(k, partialName.replace(/of /g, ''))
    })
  )

  return itemSuffixRecords.filter((rec) => {
    return suffixTypeValues.includes(rec.type)
  })
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
  } else if (opts.name) {
    return queryItemByName(itemRecords, itemSuffixRecords, opts.name)
  } else if (opts.partialName) {
    return queryItemByPartialName(itemRecords, itemSuffixRecords, opts.partialName)
  }

  return []
}

export const queryItemById = (
  itemRecords: ItemRecord[],
  itemSuffixRecords: ItemSuffixRecord[],
  itemId: number
): ItemRecord[] => {
  const items = filter.itemRecordsById(itemRecords, itemId)
  if (!items.length) {
    return items
  }

  if (itemRecordIsBase(items[0])) {
    return itemRecordsFromBase(items[0], itemSuffixRecords)
  }

  return items
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
    ? [itemRecordAffix(item, queryItemSuffix(itemSuffixRecords, { id: suffixId })[0])]
    : []
}

export const queryItemByName = (
  itemRecords: ItemRecord[],
  itemSuffixRecords: ItemSuffixRecord[],
  itemName: string
): ItemRecord[] => {
  if (itemNameIsRandomEnchant(itemName)) {
    const items = filter.itemRecordsByName(itemRecords, itemBaseName(itemName))
    if (!items.length) {
      return items
    }

    return filter.itemRecordsByName(
      queryItem(itemRecords, itemSuffixRecords, { id: items[0].id }),
      itemName
    )
  }

  // standard non-random-echant ite
  return filter.itemRecordsByName(itemRecords, itemName)
}

export const queryItemByPartialName = (
  itemRecords: ItemRecord[],
  itemSuffixRecords: ItemSuffixRecord[],
  partialName: string
): ItemRecord[] => {
  const items = [] as ItemRecord[]

  // handle search of item names
  const basicItems = filter.itemRecordsByPartialName(itemRecords, partialName)
  for (const basicItem of basicItems) {
    items.push(...itemRecordsFromBase(basicItem, itemSuffixRecords))
  }

  // handle search of random enchant item names
  const suffixRecords = queryItemSuffixByPartialName(itemSuffixRecords, partialName)
  for (const itemRecord of itemRecords) {
    for (const suffixId of itemRecord.validSuffixIds ? itemRecord.validSuffixIds : []) {
      for (const suffixRecord of suffixRecords) {
        if (suffixRecord.id === suffixId) {
          items.push(itemRecordAffix(itemRecord, suffixRecord))
        }
      }
    }
  }

  return items
}
