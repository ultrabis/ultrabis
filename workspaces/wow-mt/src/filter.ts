import { fuzzyEquals, fuzzyIncludes } from '@ultrabis/util'

import {
  ItemRecord,
  ItemSuffixRecord,
  ItemSlot,
  ItemSuffixType,
  ItemBonusType,
  PvPRank
} from '@ultrabis/wow-common'

export const itemRecordsById = (itemRecords: ItemRecord[], id: number): ItemRecord[] => {
  return itemRecords.filter((itemRecord: ItemRecord) => {
    return itemRecord.id == id
  })
}

export const itemRecordsByName = (itemRecords: ItemRecord[], name: string): ItemRecord[] => {
  return itemRecords.filter((itemRecord: ItemRecord) => {
    return fuzzyEquals(itemRecord.name, name)
  })
}

export const itemRecordsByPartialName = (
  itemRecords: ItemRecord[],
  partialName: string
): ItemRecord[] => {
  return itemRecords.filter((itemRecord: ItemRecord) => {
    return fuzzyIncludes(itemRecord.name, partialName)
  })
}

/**
 *
 * Filter item records by slot. Secondary slots (finger 2, trinket 2) will be
 * rewritten to primary slots (finger, trinket)
 *
 * @param itemRecords
 * @param slot
 */
export const itemRecordsBySlot = (itemRecords: ItemRecord[], slot: ItemSlot): ItemRecord[] => {
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
    return itemRecord.slot === mySlot
  })
}

/**
 *
 * Filter item records by phase; equal to or less than.
 * e.g. filtering by phase 5 includes phase 1, 2, 3, 4 and 5
 *
 * @param itemRecords
 * @param phase
 */
export const itemRecordsByPhase = (itemRecords: ItemRecord[], phase: number): ItemRecord[] => {
  return itemRecords.filter((itemRecord: ItemRecord) => {
    return (itemRecord.phase ? itemRecord.phase : 0) <= phase
  })
}

export const itemRecordsByPvPRank = (itemRecords: ItemRecord[], pvpRank: PvPRank): ItemRecord[] => {
  return itemRecords.filter((itemRecord: ItemRecord) => {
    return (itemRecord.pvpRank ? itemRecord.pvpRank : 0) <= pvpRank
  })
}

/*
export const itemRecordsByWorldBosses = (
  itemRecords: ItemRecord[],
  worldBosses: boolean
): ItemRecord[] => {}
*/

export const itemSuffixRecordsById = (
  itemSuffixRecords: ItemSuffixRecord[],
  id: number
): ItemSuffixRecord[] => {
  return itemSuffixRecords.filter((rec: ItemSuffixRecord) => {
    return rec.id === id
  })
}

export const itemSuffixRecordsByType = (
  itemSuffixRecords: ItemSuffixRecord[],
  type: ItemSuffixType
): ItemSuffixRecord[] => {
  return itemSuffixRecords.filter((rec: ItemSuffixRecord) => {
    return rec.type === type
  })
}

export const itemSuffixRecordsByBonusType = (
  itemSuffixRecords: ItemSuffixRecord[],
  bonusType: ItemBonusType
): ItemSuffixRecord[] => {
  return itemSuffixRecords.filter((rec: ItemSuffixRecord) => {
    for (const b of rec.bonus) {
      if (b.type === bonusType) {
        return true
      }
    }
    return false
  })
}

export const itemSuffixRecordsByBonusValue = (
  itemSuffixRecords: ItemSuffixRecord[],
  bonusType: ItemBonusType
): ItemSuffixRecord[] => {
  return itemSuffixRecords.filter((rec: ItemSuffixRecord) => {
    for (const b of rec.bonus) {
      if (b.type === bonusType) {
        return true
      }
    }
    return false
  })
}
