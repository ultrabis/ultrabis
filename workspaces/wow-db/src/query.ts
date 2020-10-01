import {
  fuzzyEquals,
  fuzzyIncludes,
  enumKeys,
  enumValuesFromKeys,
  enumValueFromKey
} from '@ultrabis/util'

import {
  ZoneType,
  ItemSuffixType,
  ItemBonusType,
  itemNameIsRandomEnchant
} from '@ultrabis/wow-common'

import {
  CreatureRecord,
  CreatureQuery,
  ZoneRecord,
  ZoneQuery,
  ItemSuffixRecord,
  ItemSuffixQuery,
  ItemRecord,
  ItemQuery,
  EnchantRecord,
  EnchantQuery,
  itemRecordsFromBase,
  itemRecordAffix
} from './'

const nameMatches = (
  haystack: string | undefined,
  needle: string,
  partial: boolean | undefined
): boolean => {
  if (haystack === undefined) {
    return false
  }

  const partialMatches = partial ? partial : false
  if (partialMatches && fuzzyIncludes(haystack, needle)) {
    return true
  } else if (!partialMatches && fuzzyEquals(haystack, needle)) {
    return true
  }

  return false
}

export const queryEnchant = (
  enchantRecords: EnchantRecord[],
  opts: EnchantQuery
): EnchantRecord[] => {
  return enchantRecords.filter((rec: EnchantRecord) => {
    if (opts.id !== undefined && opts.id !== rec.id) {
      return false
    }

    if (opts.name !== undefined && !nameMatches(rec.name, opts.name, opts.partialMatches)) {
      return false
    }

    if (opts.slot !== undefined && rec.slot !== opts.slot) {
      return false
    }

    return true
  })
}

export const queryZone = (zoneRecords: ZoneRecord[], opts: ZoneQuery): ZoneRecord[] => {
  return zoneRecords.filter((rec: ZoneRecord) => {
    if (opts.id !== undefined && opts.id !== rec.id) {
      return false
    }

    if (opts.name !== undefined && !nameMatches(rec.name, opts.name, opts.partialMatches)) {
      return false
    }

    const type = rec.type !== undefined ? rec.type : ZoneType.Other
    if (opts.type !== undefined && opts.type !== type) {
      return false
    }

    return true
  })
}

export const queryCreature = (
  creatureRecords: CreatureRecord[],
  opts: CreatureQuery
): CreatureRecord[] => {
  return creatureRecords.filter((rec: CreatureRecord) => {
    if (opts.id !== undefined && opts.id !== rec.id) {
      return false
    }

    if (opts.type !== undefined && opts.type !== rec.type) {
      return false
    }

    if (opts.name !== undefined && !nameMatches(rec.name, opts.name, opts.partialMatches)) {
      return false
    }

    return true
  })
}

/**
 *
 * Query item database, returning ItemRecord's. There's a bit of additional magic
 * and complexity here; random enchant item records must be generated on the fly.
 * The payoff is a *much* smaller database.
 *
 * @param itemRecords
 * @param opts
 */
export const queryItem = (
  itemRecords: ItemRecord[],
  itemSuffixRecords: ItemSuffixRecord[],
  opts: ItemQuery
): ItemRecord[] => {
  const queryItemById = (
    itemRecords: ItemRecord[],
    itemSuffixRecords: ItemSuffixRecord[],
    id: number
  ): ItemRecord[] => {
    return itemRecordsFromBase(
      itemSuffixRecords,
      itemRecords.find((itemRecord: ItemRecord) => {
        return itemRecord.id === id
      })
    )
  }

  const queryItemByIdAndSuffixId = (
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

  const queryItemByName = (
    itemRecords: ItemRecord[],
    itemSuffixRecords: ItemSuffixRecord[],
    itemName: string
  ): ItemRecord[] => {
    if (itemNameIsRandomEnchant(itemName)) {
      const items = itemRecords.filter((itemRecord: ItemRecord) => {
        return fuzzyEquals(itemRecord.name, name)
      })
      if (!items.length) {
        return items
      }

      return queryItem(itemRecords, itemSuffixRecords, { id: items[0].id }).filter(
        (itemRecord: ItemRecord) => {
          return fuzzyEquals(itemRecord.name, itemName)
        }
      )
    }

    // non-random-enchant item
    return itemRecords.filter((itemRecord: ItemRecord) => {
      return fuzzyEquals(itemRecord.name, itemName)
    })
  }

  const queryItemByPartialName = (
    itemRecords: ItemRecord[],
    itemSuffixRecords: ItemSuffixRecord[],
    partialName: string
  ): ItemRecord[] => {
    const items = [] as ItemRecord[]

    // handle search of item names
    const basicItems = itemRecords.filter((itemRecord: ItemRecord) => {
      return fuzzyIncludes(itemRecord.name, partialName)
    })

    for (const basicItem of basicItems) {
      items.push(...itemRecordsFromBase(itemSuffixRecords, basicItem))
    }

    // handle search of random enchant item names
    const suffixRecords = queryItemSuffix(itemSuffixRecords, {
      typeName: partialName,
      partialMatches: true
    })

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

  let primary = [] as ItemRecord[]
  const partialMatches = opts.partialMatches ? opts.partialMatches : false

  if (opts.id !== undefined && opts.suffixId !== undefined) {
    primary = queryItemByIdAndSuffixId(itemRecords, itemSuffixRecords, opts.id, opts.suffixId)
  } else if (opts.id !== undefined) {
    primary = queryItemById(itemRecords, itemSuffixRecords, opts.id)
  } else if (opts.name !== undefined) {
    if (partialMatches) {
      primary = queryItemByPartialName(itemRecords, itemSuffixRecords, opts.name)
    } else {
      primary = queryItemByName(itemRecords, itemSuffixRecords, opts.name)
    }
  } else {
    primary = itemRecords
  }

  // check additional filters, writing to `secondary`
  const secondary = primary.filter((itemRecord: ItemRecord) => {
    if (opts.slot !== undefined && itemRecord.slot !== opts.slot) {
      return false
    }

    return true
  })

  // build final array; any 'base items' need to be converted to random enchants
  const final = [] as ItemRecord[]
  for (const itemRecord of secondary) {
    final.push(...itemRecordsFromBase(itemSuffixRecords, itemRecord))
  }

  return final
}

export const queryItemSuffix = (
  itemSuffixRecords: ItemSuffixRecord[],
  opts: ItemSuffixQuery
): ItemSuffixRecord[] => {
  const suffixRecHasBonusType = (rec: ItemSuffixRecord, bonusTypes: ItemBonusType[]): boolean => {
    for (const recBonus of rec.bonus) {
      for (const bonusType of bonusTypes) {
        if (recBonus.type === bonusType) {
          return true
        }
      }
    }
    return false
  }

  const suffixRecHasBonusValue = (rec: ItemSuffixRecord, bonusValue: number): boolean => {
    for (const b of rec.bonus) {
      if (b.value === bonusValue) {
        return true
      }
    }
    return false
  }

  return itemSuffixRecords.filter((rec: ItemSuffixRecord) => {
    const partialMatches = opts.partialMatches ? opts.partialMatches : false

    if (opts.id !== undefined && rec.id !== opts.id) {
      return false
    }

    if (opts.type !== undefined && rec.type !== opts.type) {
      return false
    }

    if (opts.bonusType !== undefined && !suffixRecHasBonusType(rec, [opts.bonusType])) {
      return false
    }

    if (opts.bonusValue !== undefined && !suffixRecHasBonusValue(rec, opts.bonusValue)) {
      return false
    }

    if (opts.typeName !== undefined) {
      const typeName = opts.typeName
      const suffixTypeValues = enumValuesFromKeys(
        ItemSuffixType,
        enumKeys(ItemSuffixType).filter((k) => {
          if (partialMatches) {
            return fuzzyIncludes(k, typeName.replace(/of /g, ''))
          } else {
            return fuzzyEquals(k, typeName)
          }
        })
      )

      if (!suffixTypeValues.includes(rec.type)) {
        return false
      }
    }

    if (opts.bonusTypeName !== undefined) {
      const bonusTypeName = opts.bonusTypeName
      const bonusTypeValues = enumValuesFromKeys(
        ItemBonusType,
        enumKeys(ItemBonusType).filter((k) => {
          if (partialMatches) {
            return fuzzyIncludes(k, bonusTypeName)
          } else {
            return fuzzyEquals(k, bonusTypeName)
          }
        })
      )

      if (!suffixRecHasBonusType(rec, bonusTypeValues)) {
        return false
      }
    }

    return true
  })
}
