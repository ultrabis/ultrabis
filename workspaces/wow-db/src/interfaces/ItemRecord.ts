/**
 * Represents a record from `item.json`. This record is a bit special due to
 * how we handle random enchants:
 *
 * - if `validSuffixIds` is present, this is a base item record e.g. 'Master's hat'.
 *   each base item has a set number of possible suffixId's, representing random enchants.
 *
 * - the `queryItem()` function will automatically convert these records into their
 *   appropriate random enchant records.
 *
 * - random enchant records will remove `validSuffixIds`, add the appropriate `suffixId`,
 *   and merge the bonus values from it's associate `ItemSuffixRecord`.
 *
 */
export default interface ItemRecord {
  // identification
  id: number
  name: string
  slot: number
  suffixId?: number
  validSuffixIds?: number[]

  // classification
  class?: number
  subclass?: number
  level?: number
  bop?: boolean
  unique?: boolean
  quality?: number
  durability?: number
  icon?: string
  flavor?: string
  dropChance?: number
  droppedBy?: string
  droppedAt?: number

  // requirements
  reqLevel?: number
  phase?: number
  faction?: number
  classes?: string
  pvpRank?: number
  targets?: string

  // base stats
  strength?: number
  agility?: number
  stamina?: number
  intellect?: number
  spirit?: number
  hp5?: number
  mp5?: number

  // defensive stats
  armor?: number
  defense?: number
  dodge?: number
  parry?: number
  blockChance?: number
  blockValue?: number

  // offensive stats
  meleeHit?: number
  rangedHit?: number
  spellHit?: number
  meleeCrit?: number
  rangedCrit?: number
  spellCrit?: number

  spellPenetration?: number
  attackPower?: number
  feralAttackPower?: number
  meleeAttackPower?: number
  rangedAttackPower?: number
  spellHealing?: number
  spellDamage?: number
  arcaneDamage?: number
  fireDamage?: number
  frostDamage?: number
  natureDamage?: number
  shadowDamage?: number
  holyDamage?: number

  // offensive misc
  beastSlaying?: number

  // weapon statistics
  rangedDps?: number
  meleeDps?: number
  rangedSpeed?: number
  meleeSpeed?: number
  rangedMinDmg?: number
  meleeMinDmg?: number
  rangedMaxDmg?: number
  meleeMaxDmg?: number

  // weapon skill
  axeSkill?: number
  bowSkill?: number
  daggerSkill?: number
  gunSkill?: number
  maceSkill?: number
  swordSkill?: number
  twoHandedAxeSkill?: number
  twoHandedMaceSkill?: number
  twoHandedSwordSkill?: number

  // resistances
  arcaneResistance?: number
  fireResistance?: number
  frostResistance?: number
  natureResistance?: number
  shadowResistance?: number
}
