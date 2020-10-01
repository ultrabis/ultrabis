/**
 * Convienance functions for testing record properties.
 * Most are straight-forward but there are a handful of
 * gotchas we need to handle.
 */

import { ItemRecord, ItemSlot } from '@ultrabis/wow-common'

/**
 *
 * Test `itemRecord` for `id`
 *
 * @param itemRecord
 * @param id
 */
export const itemRecordId = (itemRecord: ItemRecord, id: number): boolean => {
  return itemRecord.id === id
}

/**
 *
 * Test `itemRecord` for `id` and `suffixId`
 *
 * @param itemRecord
 * @param id
 */
export const itemRecordIdAndSuffixId = (
  itemRecord: ItemRecord,
  id: number,
  suffixId: number
): boolean => {
  return itemRecord.id === id && itemRecord.suffixId == suffixId
}

/**
 *
 * Test `itemRecord` for `slot`.
 *
 * Secondary slots (finger 2, trinket 2) are intepreted as primary (finger, trinket)
 *
 * @param itemRecord
 * @param slot
 */
export const itemRecordSlot = (itemRecord: ItemRecord, slot: ItemSlot): boolean => {
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
}
