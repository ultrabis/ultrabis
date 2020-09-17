import ItemOnUseRecord from './ItemOnUseRecord'

import {
  ItemSlot,
  GearSlot,
  ItemQuality,
  ItemClass,
  ArmorSubclass,
  WeaponSubclass,
  PlayableClass,
  Faction,
  PvPRank,
  TargetType
} from '@ultrabis/enum'

export default interface Item {
  id: number
  suffixId: number
  name: string
  class: ItemClass
  subclass: ArmorSubclass | WeaponSubclass
  slot: ItemSlot
  gearSlot: GearSlot
  quality: ItemQuality
  level: number
  reqLevel: number
  bop: boolean
  unique: boolean
  allowableClasses: PlayableClass[]
  targetTypes: TargetType
  phase: number
  pvpRank: PvPRank
  icon: string
  location: string
  boss: string
  raid: boolean
  worldBoss: boolean
  faction: Faction
  spellDamage: number
  arcaneDamage: number
  natureDamage: number
  spellHealing: number
  spellHit: number
  spellCrit: number
  spellPenetration: number
  stamina: number
  intellect: number
  spirit: number
  mp5: number
  armor: number
  durability: number
  minDmg: number
  maxDmg: number
  speed: number
  dps: number
  onUse: ItemOnUseRecord
  score?: number
}
