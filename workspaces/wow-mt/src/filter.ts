import { fuzzyEquals, fuzzyIncludes, Filter } from '@ultrabis/util'

import {
  ItemRecord,
  ItemSuffixRecord,
  ItemSlot,
  ItemSuffixType,
  ItemBonusType,
  PvPRank
} from '@ultrabis/wow-common'

import { droppedByWorldBoss } from './item'

/**
 *
 * Filter item records by `id`
 *
 * @param itemRecords
 * @param id
 * @param filter (Default: `Filter.IncludeOnly`)
 */
export const itemRecordsById = (
  itemRecords: ItemRecord[],
  id: number,
  filter = Filter.IncludeOnly
): ItemRecord[] => {
  return itemRecords.filter((itemRecord: ItemRecord) => {
    return filter === Filter.Exclude ? itemRecord.id !== id : itemRecord.id === id
  })
}

/**
 *
 * Filter item records by `name`. This is a fuzzy match of the complete name.
 * e.g. 'neltharions tear' matches, but 'nelth' does not.
 *
 * @param itemRecords
 * @param name
 * @param filter (Default: Filter.IncludeOnly)
 */
export const itemRecordsByName = (
  itemRecords: ItemRecord[],
  name: string,
  filter = Filter.IncludeOnly
): ItemRecord[] => {
  return itemRecords.filter((itemRecord: ItemRecord) => {
    return filter === Filter.Exclude
      ? !fuzzyEquals(itemRecord.name, name)
      : fuzzyEquals(itemRecord.name, name)
  })
}

/**
 *
 * Filter item records by `name`. This is a fuzzy partial match e.g.
 * 'nelth' will match 'Neltharion's Tear'.
 *
 * @param itemRecords
 * @param partialName
 * @param filter (Default: Filter.IncludeOnly)
 */
export const itemRecordsByPartialName = (
  itemRecords: ItemRecord[],
  partialName: string,
  filter = Filter.IncludeOnly
): ItemRecord[] => {
  return itemRecords.filter((itemRecord: ItemRecord) => {
    return filter === Filter.Exclude
      ? !fuzzyIncludes(itemRecord.name, partialName)
      : fuzzyIncludes(itemRecord.name, partialName)
  })
}

/**
 *
 * Filter item records by `slot`. Secondary slots (finger 2, trinket 2) will be
 * rewritten as primary slots (finger, trinket)
 *
 * @param itemRecords
 * @param slot
 * @param filter (Default: Filter.IncludeOnly)
 */
export const itemRecordsBySlot = (
  itemRecords: ItemRecord[],
  slot: ItemSlot,
  filter = Filter.IncludeOnly
): ItemRecord[] => {
  return itemRecords.filter((itemRecord: ItemRecord) => {
    let mySlot: ItemSlot
    switch (slot) {
      case ItemSlot.Finger2:
        mySlot = ItemSlot.Finger
        break
      case ItemSlot.Trinket2:
        mySlot = ItemSlot.Trinket
        break
      default:
        mySlot = slot
        break
    }
    return filter === Filter.Exclude ? itemRecord.slot !== mySlot : itemRecord.slot === mySlot
  })
}

/**
 *
 * Filter item records by `phase`.
 *
 * `phase` is inclusive of previous phases i.e. phase 3 means phase 1, 2 and 3.
 * Item records without a `phase` property are presumed to be '1'.
 *
 * @param itemRecords
 * @param phase (Default: Filter.IncludeOnly)
 */
export const itemRecordsByPhase = (
  itemRecords: ItemRecord[],
  phase: number,
  filter = Filter.IncludeOnly
): ItemRecord[] => {
  return itemRecords.filter((itemRecord: ItemRecord) => {
    const p = itemRecord.phase ? itemRecord.phase : 1
    return filter === Filter.Exclude ? p >= phase : p <= phase
  })
}

/**
 *
 * Filter item records by `pvpRank`.
 *
 * `pvpRank` is inclusive of previous ranks i.e. rank 3 means ranks 1, 2 and 3.
 * Item records without `pvpRank` are presumed to be '1'.
 *
 * @param itemRecords
 * @param pvpRank
 * @param filter (Default: Filter.IncludeOnly)
 */
export const itemRecordsByPvPRank = (
  itemRecords: ItemRecord[],
  pvpRank: PvPRank,
  filter = Filter.IncludeOnly
): ItemRecord[] => {
  return itemRecords.filter((itemRecord: ItemRecord) => {
    const r = itemRecord.pvpRank ? itemRecord.pvpRank : 1
    return filter === Filter.Exclude ? r >= pvpRank : r <= pvpRank
  })
}

/**
 *
 * Filter item records by whether or not they're dropped by a world boss.
 * This is determined by the `droppedByWorldBoss` function, which works
 * by cross referencing the items `droppedBy` property with the `WorldBoss`
 * enum
 *
 * @param itemRecords
 * @param filter (Default: Filter.Exclude)
 */
export const itemRecordsByWorldBosses = (
  itemRecords: ItemRecord[],
  filter = Filter.Exclude
): ItemRecord[] => {
  return itemRecords.filter((rec: ItemRecord) => {
    return filter === Filter.IncludeOnly ? droppedByWorldBoss(rec) : !droppedByWorldBoss(rec)
  })
}

/**
 *
 * Filter item suffix records by `id`
 *
 * @param itemSuffixRecords
 * @param id
 * @param filter (Default: Filter.IncludeOnly)
 */
export const itemSuffixRecordsById = (
  itemSuffixRecords: ItemSuffixRecord[],
  id: number,
  filter = Filter.IncludeOnly
): ItemSuffixRecord[] => {
  return itemSuffixRecords.filter((rec: ItemSuffixRecord) => {
    return filter === Filter.Exclude ? rec.id !== id : rec.id === id
  })
}

/**
 *
 * Filter item suffix records by `type`
 *
 * @param itemSuffixRecords
 * @param type
 * @param filter (Default: Filter.IncludeOnly)
 */
export const itemSuffixRecordsByType = (
  itemSuffixRecords: ItemSuffixRecord[],
  type: ItemSuffixType,
  filter = Filter.IncludeOnly
): ItemSuffixRecord[] => {
  return itemSuffixRecords.filter((rec: ItemSuffixRecord) => {
    return filter == Filter.Exclude ? rec.type !== type : rec.type === type
  })
}

/**
 *
 * Filter item suffix records by `ItemBonusType`. These are the random enchant bonuses e.g.
 * 'of the Eagle' will has two bonus types: `ItemBonusType.Intellect` and `ItemBonusType.Stamina`
 *
 * @param itemSuffixRecords
 * @param bonusType `ItemBonusType`
 * @param filter (Default: Filter.IncludeOnly)
 */
export const itemSuffixRecordsByBonusType = (
  itemSuffixRecords: ItemSuffixRecord[],
  bonusType: ItemBonusType,
  filter = Filter.IncludeOnly
): ItemSuffixRecord[] => {
  return itemSuffixRecords.filter((rec: ItemSuffixRecord) => {
    for (const b of rec.bonus) {
      if (filter === Filter.IncludeOnly && b.type === bonusType) {
        return true
      }
    }
    return filter === Filter.Exclude ? true : false
  })
}

/**
 *
 * Filter item suffix records by bonus value.
 *
 * @param itemSuffixRecords
 * @param bonusType
 * @param filter (Default: Filter.IncludeOnly)
 */
export const itemSuffixRecordsByBonusValue = (
  itemSuffixRecords: ItemSuffixRecord[],
  bonusValue: number,
  filter = Filter.IncludeOnly
): ItemSuffixRecord[] => {
  return itemSuffixRecords.filter((rec: ItemSuffixRecord) => {
    for (const b of rec.bonus) {
      if (filter === Filter.IncludeOnly && b.value === bonusValue) {
        return true
      }
    }
    return filter === Filter.Exclude ? true : false
  })
}
