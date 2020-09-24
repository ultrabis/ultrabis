export default interface ItemSetRecord {
  name: string
  items: number[] // id's of each item in set
  tailoring: boolean // bonus active with 300 tailoring
  spellHit?: number
  spellCrit?: number
  spellDamage?: number
}
