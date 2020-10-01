/**
 * Represents a record from `itemSuffix.json`. This database stores
 * every possible suffixId and it's associated bonuses.
 *
 */
import { ItemBonusObject } from '@ultrabis/wow-common'

export default interface ItemSuffixRecord {
  id: number
  type: number
  bonus: ItemBonusObject[]
}
