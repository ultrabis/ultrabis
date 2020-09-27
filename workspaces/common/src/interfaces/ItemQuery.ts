import ItemSlot from '../enums/ItemSlot'
import Faction from '../enums/Faction'
import PvPRank from '../enums/PvPRank'

export default interface ItemQueryObject {
  // primary identifiers
  id?: number
  suffixId?: number
  name?: string
  slot?: ItemSlot

  // additional filters
  phase?: number
  faction?: Faction
  pvpRank?: PvPRank
  includeWorldBosses?: boolean
  includeRaids?: boolean
  includeRandomEnchants?: boolean

  // query options
  partialMatches?: boolean // allow partial matches on query by name
}
