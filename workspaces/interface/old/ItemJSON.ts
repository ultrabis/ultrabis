import ItemSlot from '../enum/ItemSlot'
import ItemQuality from '../enum/ItemQuality'
import ItemClass from '../enum/ItemClass'
import ArmorSubclass from '../enum/ArmorSubclass'
import WeaponSubclass from '../enum/WeaponSubclass'
import PlayableClass from '../enum/PlayableClass'
import Faction from '../enum/Faction'
import PvPRank from '../enum/PvPRank'
import TargetType from '../enum/TargetType'
import ItemOnUseJSON from './ItemOnUseJSON'

export default interface ItemJSON {
  id: number
  suffixId?: number
  slot: ItemSlot
  name?: string
  class?: ItemClass
  subclass?: ArmorSubclass | WeaponSubclass
  quality?: ItemQuality
  level?: number
  reqLevel?: number
  bop?: boolean
  unique?: boolean
  allowableClasses?: PlayableClass[]
  targetTypes?: TargetType
  phase?: number
  pvpRank?: PvPRank
  icon?: string
  location?: string
  boss?: string
  raid?: boolean
  worldBoss?: boolean
  faction?: Faction
  score?: number
  spellDamage?: number
  arcaneDamage?: number
  natureDamage?: number
  spellHealing?: number
  spellHit?: number
  spellCrit?: number
  spellPenetration?: number
  stamina?: number
  intellect?: number
  spirit?: number
  mp5?: number
  armor?: number
  durability?: number
  minDmg?: number
  maxDmg?: number
  speed?: number
  dps?: number
  onUse?: ItemOnUseJSON
}
