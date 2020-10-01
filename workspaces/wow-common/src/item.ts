import { fuzzyEquals, enumValueFromKey } from '@ultrabis/util'
import { ItemSuffixType } from './'

/**
 *
 * Returns the item suffix type (e.g. 'Arcane Wrath')
 *
 * @param itemName
 */
export const itemSuffixTypeFromName = (itemName: string): ItemSuffixType | undefined => {
  /* Skip non-suffix items */
  const of = itemName.toUpperCase().indexOf(' OF ')
  if (of === -1) {
    return undefined
  }

  /* Skip silly item names that contradict the games suffix naming convention */
  const sillyItemNames = [
    `Hands of Power`,
    `Grand Marshal's Tome of Power`,
    `Grand Marshal's Tome of Restoration`
  ]

  if (sillyItemNames.find((silly) => fuzzyEquals(itemName, silly))) {
    return undefined
  }

  return enumValueFromKey(ItemSuffixType, itemName.slice(of + 4))
}

/**
 *
 * Convert names like "Master's Hat of Arcane Wrath" to "Master's Hat"
 * Names without a real suffix will keep their original
 *
 * @param itemName
 */
export const itemBaseName = (itemName: string): string => {
  const _itemSuffixType = itemSuffixTypeFromName(itemName)
  if (_itemSuffixType === undefined) {
    return itemName
  }

  const of = itemName.toUpperCase().indexOf(' OF ')
  return itemName.slice(0, of)
}

/**
 *
 * Does this item name indicate that it's a random enchant?
 *
 * @param itemName
 */
export const itemNameIsRandomEnchant = (itemName: string): boolean => {
  return itemSuffixTypeFromName(itemName) !== undefined
}
