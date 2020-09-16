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
import Stats from './Stats'

export default interface ItemJSONNew {
  id: number
  name: string
  slot: ItemSlot
  suffixId?: number
  validSuffixIds?: number[]
  class?: ItemClass
  subclass?: ArmorSubclass | WeaponSubclass
  level?: number
  reqLevel?: number
  bop?: boolean
  unique?: boolean
  stats?: Stats
  durability?: number
  quality?: ItemQuality
  allowableClasses?: PlayableClass[]
  targetTypes?: TargetType
  phase?: number
  pvpRank?: PvPRank
  icon?: string
  location?: string
  boss?: string
  faction?: Faction
  minDmg?: number
  maxDmg?: number
  speed?: number
  dps?: number
  onUse?: ItemOnUseJSON
}
