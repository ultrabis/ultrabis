import { ItemSlot } from '@ultrabis/enum'

export default interface Enchant {
  id: number
  name: string
  slot: ItemSlot
  phase: number
  icon: string
  text: string
  exploit: boolean
  spellHealing: number
  armor: number
  spellDamage: number
  arcaneDamage: number
  natureDamage: number
  spellHit: number
  spellCrit: number
  spellPenetration: number
  stamina: number
  intellect: number
  spirit: number
  mp5: number
  score: number
}
