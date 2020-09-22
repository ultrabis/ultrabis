import { ItemSlot, Faction, PvPRank } from '../enums'

export default interface ItemQuery {
  id?: number
  suffixId?: number
  name?: string
  slot?: ItemSlot
  phase?: number
  faction?: Faction
  pvpRank?: PvPRank
  worldBosses?: boolean
  raids?: boolean
  randomEnchants?: boolean
  enchantExploit?: boolean
  cloneResults?: boolean
}
