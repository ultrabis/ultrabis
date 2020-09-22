/* Handles the custom gear array, which defines a set of equipment. This would
 * be simpler with an object, but this data is very space sensitive; it may
 * be included on a URL to facilitate an apps ability to share a link to a
 * custom gear set (see paramin functions in `util`).
 *
 * The array is in the following format:
 *
 * [GearSlot][ItemID, SuffixID, EnchantID]
 *
 * GearSlot = Internal value for item slot (not to be confused with ItemSlot). Defined in `enum`
 * ItemID = Either 0 (BIS), 1 (Naked), or the item id of an item.
 * SuffixID = Always 0 unless item is a random enchantment, then it's the suffix ID.
 * EnchantID = Either 0 (BIS), 1 (Naked), or the item id of an enchant.
 *
 */

import { GearSettings, GearSlot, CustomGearIndex, CustomGearValue } from '@ultrabis/common'

/**
 *
 * Set a value in gearSettings 'equipped' array
 *
 * @param gearSettings will be modified
 * @param index (0 = itemId, 1 = itemSuffixId, 2 = enchantId)
 * @param value itemId, suffixId, enchantId, GearState.BIS (0) or GearState.BIS (1)
 * @param gearSlot apply to one slot, or if undefined, all slots
 */
const setValue = (
  gearSettings: GearSettings,
  index: CustomGearIndex,
  value: CustomGearValue | number,
  gearSlot?: GearSlot
): void => {
  if (!gearSlot) {
    const keys = Object.keys(GearSlot)
    for (let i = 0; i < keys.length; i++) {
      gearSettings.custom[i][index] = value
    }
    return
  }

  gearSettings.custom[gearSlot][index] = value
}

export const setItemId = (
  gearSettings: GearSettings,
  itemId: number,
  gearSlot?: GearSlot
): void => {
  return setValue(gearSettings, 0, itemId, gearSlot)
}

export const setSuffixId = (
  gearSettings: GearSettings,
  itemSuffixId: number,
  gearSlot?: GearSlot
): void => {
  return setValue(gearSettings, 1, itemSuffixId, gearSlot)
}

export const setEnchantId = (
  gearSettings: GearSettings,
  enchantId: number,
  gearSlot?: GearSlot
): void => {
  return setValue(gearSettings, 2, enchantId, gearSlot)
}

/**
 * Get a value in GearSettings `equipped` array
 *
 * @param settings
 * @param index
 * @param gearSlot
 */
const getValue = (gearSettings: GearSettings, index: number, gearSlot: GearSlot): number => {
  return gearSettings.custom[gearSlot][index]
}

export const getItemId = (gearSettings: GearSettings, gearSlot: GearSlot): number => {
  return getValue(gearSettings, 0, gearSlot)
}

export const getSuffixId = (gearSettings: GearSettings, gearSlot: GearSlot): number => {
  return getValue(gearSettings, 1, gearSlot)
}

export const getEnchantId = (gearSettings: GearSettings, gearSlot: GearSlot): number => {
  return getValue(gearSettings, 2, gearSlot)
}
