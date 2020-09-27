import ItemSlot from '../enums/ItemSlot'
import Faction from '../enums/Faction'
import PvPRank from '../enums/PvPRank'

export default interface ItemQuery {
  id?: number
  suffixId?: number
  name?: string
  partialName?: string
  slot?: ItemSlot

  // additional filters
  phase?: number
  faction?: Faction
  pvpRank?: PvPRank
  includeWorldBosses?: boolean
  includeRaids?: boolean
  includeRandomEnchants?: boolean

}
