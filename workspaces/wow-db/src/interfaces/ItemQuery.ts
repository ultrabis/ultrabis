import { ItemSlot, Faction, PvPRank } from '@ultrabis/wow-common'
import Query from './Query'

export default interface ItemQuery extends Query {
  // primary identifiers
  id?: number
  suffixId?: number
  name?: string
  partialName?: string

  // additional filters
  slot?: ItemSlot
  phase?: number
  faction?: Faction
  pvpRank?: PvPRank
  includeWorldBosses?: boolean
  includeRaids?: boolean
  includeRandomEnchants?: boolean
}
