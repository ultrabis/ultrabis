import ItemRecord from './ItemRecord'

export default interface ItemSetRecord {
  name: string
  phase: number
  raid: boolean
  tailoring: boolean
  spellHit?: number
  spellCrit?: number
  spellDamage?: number
  itemNames: string[]
  items?: ItemRecord[]
  score?: number
}
