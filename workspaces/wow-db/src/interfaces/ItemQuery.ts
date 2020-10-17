import { ItemSlot, Faction, PvPRank } from '@ultrabis/wow-common'
import Query from './Query'

export default interface ItemQuery extends Query {
  // primary identifiers
  id?: number
  suffixId?: number
  name?: string

  // additional filters
  slot?: ItemSlot
  phase?: number
  faction?: Faction
  pvpRank?: PvPRank
  /**
   * ignores items dropped by world bosses
   */
  excludeWorldBosses?: boolean
  /**
   * ignore items dropped in raids
   */
  excludeRaids?: boolean
  /**
   * ignores random enchant items
   */
  excludeRandomEnchants?: boolean
}
