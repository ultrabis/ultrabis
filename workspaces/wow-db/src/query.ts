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
  ItemBonusObject,
  ItemSlot,
  WorldBoss,
  itemNameIsRandomEnchant
} from '@ultrabis/wow-common'

import {
  Database,
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

/**
 *
 * Query enchants and return the first matching record.
 *
 * @param enchantRecords
 * @param opts
 */
export const enchant = (db: Database, opts: EnchantQuery): EnchantRecord | undefined => {
  const recs = enchants(db, opts)
  return recs.length <= 0 ? undefined : recs[0]
}

/**
 *
 * Query enchants and return all matching records.
 *
 * @param enchantRecords
 * @param opts
 */
export const enchants = (db: Database, opts: EnchantQuery): EnchantRecord[] => {
  return db.enchant.filter((rec: EnchantRecord) => {
    if (opts.id !== undefined && opts.id !== rec.id) {
      return false
    }

    if (opts.name !== undefined && !nameMatches(rec.name, opts.name, opts.partialMatches)) {
      return false
    }

    if (opts.slot !== undefined && rec.slot !== opts.slot) {
      return false
    }

    if (opts.phase !== undefined && (rec.phase ? rec.phase : 1) > opts.phase) {
      return false
    }

    return true
  })
}

/**
 *
 * Query zones and return the first matching record.
 *
 * @param zoneRecords
 * @param opts
 */
export const zone = (db: Database, opts: ZoneQuery): ZoneRecord | undefined => {
  const recs = zones(db, opts)
  return recs.length <= 0 ? undefined : recs[0]
}

/**
 *
 * Query zones and return all matching records.
 *
 * @param zoneRecords
 * @param opts
 */
export const zones = (db: Database, opts: ZoneQuery): ZoneRecord[] => {
  return db.zone.filter((rec: ZoneRecord) => {
    if (opts.id !== undefined && opts.id !== rec.id) {
      return false
    }

    if (opts.name !== undefined && !nameMatches(rec.name, opts.name, opts.partialMatches)) {
      return false
    }

    if (
      opts.type !== undefined &&
      opts.type !== (rec.type !== undefined ? rec.type : ZoneType.Other)
    ) {
      return false
    }

    return true
  })
}

/**
 *
 * Query creatures and return first matching record.
 *
 * @param creatureRecords
 * @param opts
 */
export const creature = (db: Database, opts: CreatureQuery): CreatureRecord | undefined => {
  const recs = creatures(db, opts)
  return recs.length <= 0 ? undefined : recs[0]
}

/**
 *
 * Query creatures and return all matching records.
 *
 * @param creatureRecords
 * @param opts
 */
export const creatures = (db: Database, opts: CreatureQuery): CreatureRecord[] => {
  return db.creature.filter((rec: CreatureRecord) => {
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
 * Query items and return first matching record.
 *
 * @param itemRecords
 * @param opts
 */
export const item = (db: Database, opts: ItemQuery): ItemRecord | undefined => {
  const recs = items(db, opts)
  return recs.length <= 0 ? undefined : recs[0]
}

/**
 *
 * Query items and return all matching records.
 *
 * TODO: I think this is ugly and i'm not happy with it. Clean it up.
 * The nastiness is created by needing to generate the random enchants.
 * Maybe generate a list of itemId/suffixId during the filter process and
 * handle the affixing all at once at the end.
 *
 *
 * @param itemRecords
 * @param itemSuffixRecords
 * @param opts
 */
export const items = (db: Database, opts: ItemQuery): ItemRecord[] => {
  let primary = [] as ItemRecord[]
  const partialMatches = opts.partialMatches ? opts.partialMatches : false

  if (opts.id !== undefined && opts.suffixId !== undefined) {
    primary = queryItemsByIdAndSuffixId(db, opts.id, opts.suffixId)
  } else if (opts.id !== undefined) {
    primary = queryItemsById(db, opts.id)
  } else if (opts.name !== undefined) {
    if (partialMatches) {
      primary = queryItemsByPartialName(db, opts.name)
    } else {
      primary = queryItemsByName(db, opts.name)
    }
  } else {
    primary = db.item
  }

  // check additional filters, writing to `secondary`
  const secondary = primary.filter((rec: ItemRecord) => {
    if (opts.slot !== undefined) {
      let slot: ItemSlot
      switch (opts.slot) {
        case ItemSlot.Finger2:
          slot = ItemSlot.Finger
          break
        case ItemSlot.Trinket2:
          slot = ItemSlot.Trinket
          break
        default:
          slot = opts.slot
          break
      }

      if (rec.slot !== slot) {
        return false
      }
    }

    if (opts.phase !== undefined && (rec.phase ? rec.phase : 1) > opts.phase) {
      return false
    }

    if (opts.pvpRank !== undefined && (rec.pvpRank ? rec.pvpRank : 1) > opts.pvpRank) {
      return false
    }

    if (opts.excludeWorldBosses && itemDroppedByWorldBoss(rec)) {
      return false
    }

    if (opts.excludeRaids && itemDroppedInRaid(db, rec)) {
      return false
    }

    return true
  })

  // ignore random enchants if they're set to exclude.
  // TODO: we technically did a lot more work then we needed to
  // if this is the case.
  if (opts.excludeRandomEnchants) {
    return secondary.filter((rec: ItemRecord) => {
      if (rec.validSuffixIds || rec.suffixId) {
        return false
      }
      return true
    })
  }

  // build final array; any 'base items' need to be converted to random enchants
  const final = [] as ItemRecord[]
  for (const itemRecord of secondary) {
    final.push(...itemRecordsFromBase(db.itemSuffix, itemRecord))
  }

  return final
}

/**
 *
 * Query item suffixes and return first matching record.
 *
 * @param itemSuffixRecords
 * @param opts
 */
export const itemSuffix = (db: Database, opts: ItemSuffixQuery): ItemSuffixRecord | undefined => {
  const recs = itemSuffixes(db, opts)
  return recs.length <= 0 ? undefined : recs[0]
}

/**
 *
 * Query item suffixes and return all matching records.
 *
 * @param itemSuffixRecords
 * @param opts
 */
export const itemSuffixes = (db: Database, opts: ItemSuffixQuery): ItemSuffixRecord[] => {
  const suffixRecHasBonusType = (rec: ItemSuffixRecord, bonusTypes: ItemBonusType[]): boolean => {
    const matches = rec.bonus.filter((itemBonusObject: ItemBonusObject) => {
      for (const bonusType of bonusTypes) {
        if (itemBonusObject.type === bonusType) {
          return true
        }
      }
      return false
    })
    return matches.length > 0
  }

  const suffixRecHasBonusValue = (rec: ItemSuffixRecord, bonusValue: number): boolean => {
    for (const b of rec.bonus) {
      if (b.value === bonusValue) {
        return true
      }
    }
    return false
  }

  return db.itemSuffix.filter((rec: ItemSuffixRecord) => {
    const partialMatches = opts.partialMatches ? opts.partialMatches : false

    if (opts.id !== undefined && rec.id === opts.id) {
      return true
    }

    if (opts.type !== undefined && rec.type === opts.type) {
      return true
    }

    if (opts.bonusType !== undefined && suffixRecHasBonusType(rec, [opts.bonusType])) {
      return true
    }

    if (opts.bonusValue !== undefined && suffixRecHasBonusValue(rec, opts.bonusValue)) {
      return true
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

      if (suffixTypeValues.includes(rec.type)) {
        return true
      }
    }

    if (opts.bonusTypeName !== undefined) {
      const bonusTypeName = opts.bonusTypeName
      const bonusTypeValues = enumValuesFromKeys(
        ItemBonusType,
        enumKeys(ItemBonusType).filter((k) => {
          return nameMatches(k, bonusTypeName, partialMatches)
        })
      )

      if (suffixRecHasBonusType(rec, bonusTypeValues)) {
        return true
      }
    }

    return false
  })
}

//////////////////////////////////////////////////////////////////////////////
// non-exported helpers
//////////////////////////////////////////////////////////////////////////////
const queryItemsById = (db: Database, id: number): ItemRecord[] => {
  return itemRecordsFromBase(
    db.itemSuffix,
    db.item.find((rec: ItemRecord) => {
      return rec.id === id
    })
  )
}

const queryItemsByIdAndSuffixId = (db: Database, id: number, suffixId: number): ItemRecord[] => {
  const item = db.item.find((rec: ItemRecord) => {
    return rec.id === id && rec.validSuffixIds?.includes(suffixId ? suffixId : 0)
  })
  return item ? [itemRecordAffix(item, itemSuffixes(db, { id: suffixId })[0])] : []
}

const queryItemsByName = (db: Database, name: string): ItemRecord[] => {
  if (itemNameIsRandomEnchant(name)) {
    const recs = db.item.filter((itemRecord: ItemRecord) => {
      return fuzzyEquals(itemRecord.name, name)
    })
    if (!recs.length) {
      return recs
    }

    return items(db, { id: recs[0].id }).filter((itemRecord: ItemRecord) => {
      return fuzzyEquals(itemRecord.name, name)
    })
  }

  // non-random-enchant item
  return db.item.filter((itemRecord: ItemRecord) => {
    return fuzzyEquals(itemRecord.name, name)
  })
}

const queryItemsByPartialName = (db: Database, name: string): ItemRecord[] => {
  const recs = [] as ItemRecord[]

  // handle search of item names
  const basicItems = db.item.filter((itemRecord: ItemRecord) => {
    return fuzzyIncludes(itemRecord.name, name)
  })

  for (const basicItem of basicItems) {
    recs.push(...itemRecordsFromBase(db.itemSuffix, basicItem))
  }

  // handle search of random enchant item names
  const suffixRecords = itemSuffixes(db, {
    typeName: name,
    partialMatches: true
  })

  for (const itemRecord of db.item) {
    for (const suffixId of itemRecord.validSuffixIds ? itemRecord.validSuffixIds : []) {
      for (const suffixRecord of suffixRecords) {
        if (suffixRecord.id === suffixId) {
          recs.push(itemRecordAffix(itemRecord, suffixRecord))
        }
      }
    }
  }

  return recs
}

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

const itemDroppedByWorldBoss = (rec: ItemRecord | undefined): boolean => {
  if (rec && rec.droppedBy) {
    return enumValueFromKey(WorldBoss, rec.droppedBy) !== undefined
  }
  return false
}

const itemDroppedInRaid = (db: Database, rec: ItemRecord | undefined): boolean => {
  if (rec === undefined || rec.droppedAt === undefined) {
    return false
  }

  const r = zone(db, { id: rec.droppedAt })
  return r !== undefined && r.n !== undefined && r.n >= 20
}
