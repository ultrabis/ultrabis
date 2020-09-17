import { cloneObject } from '@ultrabis/util'
import { ItemRecord, ItemSuffixRecord } from '@ultrabis/interface'
import { ItemBonusType, ItemSuffixType } from '@ultrabis/enum'

/* TODO: some dumb method we're not exporting */
const zsum = (one: number | undefined, two: number | undefined) => {
  const val = (one ? one : 0) + (two ? two : 0)
  return val ? val : undefined
}

/**
 * 
 * Returns a 'random enchant' item record based on the base item and item suffix records. 
 * This is used to support random enchant items in the 'modular' database. 
 * Using this method saves a crapload of space vs storing each individual item.
 *
 * @param baseItemRecord e.g. Master's Hat
 * @param itemSuffixRecord contains the suffix type e.g. 'Arcane Wrath' and bonus values
 */
export const affixItemRecord = (baseItemRecord: ItemRecord, itemSuffixRecord: ItemSuffixRecord) => {
  const itemRecord = cloneObject(baseItemRecord)
  
  // add suffixId and remove validSuffixIds
  itemRecord.validSuffixIds = undefined
  itemRecord.suffixId = itemSuffixRecord.id

  // apply the bonuses
  for (let i = 0; i < itemSuffixRecord.bonus.length; i++) {
    const value = itemSuffixRecord.bonus[i].value
    switch (itemSuffixRecord.bonus[i].type) {
      case ItemBonusType.Agility:
        itemRecord.agility = zsum(itemRecord.agility, value)
        break
      case ItemBonusType.ArcaneResistence:
        itemRecord.arcaneResistance = zsum(itemRecord.arcaneResistance, value)
        break
      case ItemBonusType.ArcaneSpellDamage:
        itemRecord.arcaneDamage = zsum(itemRecord.arcaneDamage, value)
        break
      case ItemBonusType.Armor:
        itemRecord.armor = zsum(itemRecord.armor, value)
        break
      case ItemBonusType.AttackPower:
        itemRecord.attackPower = zsum(itemRecord.attackPower, value)
        break
      case ItemBonusType.BeastSlaying:
        itemRecord.beastSlaying = zsum(itemRecord.beastSlaying, value)
        break
      case ItemBonusType.Block:
        itemRecord.blockChance = zsum(itemRecord.blockChance, value)
        break
      case ItemBonusType.CriticalHit:
        itemRecord.meleeCrit = zsum(itemRecord.meleeCrit, value)
        itemRecord.rangedCrit = zsum(itemRecord.rangedCrit, value)
        break
      case ItemBonusType.Damage:
        // NOT IN GAME
        break
      case ItemBonusType.DamageAndHealingSpells:
        itemRecord.spellDamage = zsum(itemRecord.spellDamage, value)
        itemRecord.spellHealing = zsum(itemRecord.spellHealing, value)
        break
      case ItemBonusType.Defense:
        itemRecord.defense = zsum(itemRecord.defense, value)
        break
      case ItemBonusType.Dodge:
        itemRecord.dodge = zsum(itemRecord.dodge, value)
        break
      case ItemBonusType.FireResistance:
        itemRecord.fireResistance = zsum(itemRecord.fireResistance, value)
        break
      case ItemBonusType.FireSpellDamage:
        itemRecord.fireDamage = zsum(itemRecord.fireDamage, value)
        break
      case ItemBonusType.FrostResistance:
        itemRecord.frostResistance = zsum(itemRecord.frostResistance, value)
        break
      case ItemBonusType.FrostSpellDamage:
        itemRecord.frostDamage = zsum(itemRecord.frostDamage, value)
        break
      case ItemBonusType.HealingSpells:
        itemRecord.spellHealing = zsum(itemRecord.spellHealing, value)
        break
      case ItemBonusType.HealthEvery5:
        itemRecord.hp5 = zsum(itemRecord.hp5, value)
        break
      case ItemBonusType.HolySpellDamage:
        itemRecord.holyDamage = zsum(itemRecord.holyDamage, value)
        break
      case ItemBonusType.Intellect:
        itemRecord.intellect = zsum(itemRecord.intellect, value)
        break
      case ItemBonusType.ManaEvery5:
        itemRecord.mp5 = zsum(itemRecord.mp5, value)
        break
      case ItemBonusType.NatureResistance:
        itemRecord.natureResistance = zsum(itemRecord.natureResistance, value)
        break
      case ItemBonusType.NatureSpellDamage:
        itemRecord.natureDamage = zsum(itemRecord.natureDamage, value)
        break
      case ItemBonusType.RangedAttackPower:
        itemRecord.rangedAttackPower = zsum(itemRecord.rangedAttackPower, value)
        break
      case ItemBonusType.ShadowResistance:
        itemRecord.shadowResistance = zsum(itemRecord.shadowResistance, value)
        break
      case ItemBonusType.ShadowSpellDamage:
        itemRecord.shadowDamage = zsum(itemRecord.shadowDamage, value)
        break
      case ItemBonusType.Spirit:
        itemRecord.spirit = zsum(itemRecord.spirit, value)
        break
      case ItemBonusType.Stamina:
        itemRecord.stamina = zsum(itemRecord.stamina, value)
        break
      case ItemBonusType.Strength:
        itemRecord.strength = zsum(itemRecord.strength, value)
        break
      case ItemBonusType.AxeSkill:
        itemRecord.axeSkill = zsum(itemRecord.axeSkill, value)
        break
      case ItemBonusType.BowSkill:
        itemRecord.bowSkill = zsum(itemRecord.bowSkill, value)
        break
      case ItemBonusType.DaggerSkill:
        itemRecord.daggerSkill = zsum(itemRecord.daggerSkill, value)
        break
      case ItemBonusType.GunSkill:
        itemRecord.gunSkill = zsum(itemRecord.gunSkill, value)
        break
      case ItemBonusType.MaceSkill:
        itemRecord.maceSkill = zsum(itemRecord.maceSkill, value)
        break
      case ItemBonusType.SwordSkill:
        itemRecord.swordSkill = zsum(itemRecord.swordSkill, value)
        break
      case ItemBonusType.TwoHandedAxeSkill:
        itemRecord.twoHandedAxeSkill = zsum(itemRecord.twoHandedAxeSkill, value)
        break
      case ItemBonusType.TwoHandedMaceSkill:
        itemRecord.twoHandedMaceSkill = zsum(itemRecord.twoHandedMaceSkill, value)
        break
      case ItemBonusType.TwoHandedSwordSkill:
        itemRecord.twoHandedSwordSkill = zsum(itemRecord.twoHandedSwordSkill, value)
        break
      case ItemBonusType.OnGetHitShadowBolt:
        // FIXME: dunno
        break
    }
  }

  // apply the item name
  switch (itemSuffixRecord.type) {
    case ItemSuffixType.Agility:
      itemRecord.name = `${itemRecord.name} of Agility`
      break
    case ItemSuffixType.ArcaneResistance:
      itemRecord.name = `${itemRecord.name} of Arcane Resistance`
      break
    case ItemSuffixType.ArcaneWrath:
      itemRecord.name = `${itemRecord.name} of Arcane Wrath`
      break
    case ItemSuffixType.BeastSlaying:
      itemRecord.name = `${itemRecord.name} of Beast Slaying`
      break
    case ItemSuffixType.Blocking:
      itemRecord.name = `${itemRecord.name} of Blocking`
      break
    case ItemSuffixType.Concentration:
      itemRecord.name = `${itemRecord.name} of Concentration`
      break
    case ItemSuffixType.CriticalStrike:
      itemRecord.name = `${itemRecord.name} of Critical Strike`
      break
    case ItemSuffixType.Defense:
      itemRecord.name = `${itemRecord.name} of Defense`
      break
    case ItemSuffixType.Eluding:
      itemRecord.name = `${itemRecord.name} of Eluding`
      break
    case ItemSuffixType.FieryWrath:
      itemRecord.name = `${itemRecord.name} of Fiery Wrath`
      break
    case ItemSuffixType.FireResistance:
      itemRecord.name = `${itemRecord.name} of Fire Resistance`
      break
    case ItemSuffixType.FrostResistance:
      itemRecord.name = `${itemRecord.name} of Frost Resistance`
      break
    case ItemSuffixType.FrozenWrath:
      itemRecord.name = `${itemRecord.name} of Frozen Wrath`
      break
    case ItemSuffixType.Healing:
      itemRecord.name = `${itemRecord.name} of Healing`
      break
    case ItemSuffixType.HolyWrath:
      itemRecord.name = `${itemRecord.name} of Holy Wrath`
      break
    case ItemSuffixType.Intellect:
      itemRecord.name = `${itemRecord.name} of Intellect`
      break
    case ItemSuffixType.Marksmanship:
      itemRecord.name = `${itemRecord.name} of Marksmanship`
      break
    case ItemSuffixType.NatureResistance:
      itemRecord.name = `${itemRecord.name} of Nature Resistance`
      break
    case ItemSuffixType.NaturesWrath:
      itemRecord.name = `${itemRecord.name} of Nature's Wrath`
      break
    case ItemSuffixType.Power:
      itemRecord.name = `${itemRecord.name} of Power`
      break
    case ItemSuffixType.Proficiency:
      itemRecord.name = `${itemRecord.name} of Proficiency`
      break
    case ItemSuffixType.Quality:
      itemRecord.name = `${itemRecord.name} of Quality`
      break
    case ItemSuffixType.Regeneration:
      itemRecord.name = `${itemRecord.name} of Regeneration`
      break
    case ItemSuffixType.Restoration:
      itemRecord.name = `${itemRecord.name} of Restoration`
      break
    case ItemSuffixType.Retaliation:
      itemRecord.name = `${itemRecord.name} of Retaliation`
      break
    case ItemSuffixType.ShadowResistance:
      itemRecord.name = `${itemRecord.name} of Shadow Resistance`
      break
    case ItemSuffixType.ShadowWrath:
      itemRecord.name = `${itemRecord.name} of Shadow Wrath`
      break
    case ItemSuffixType.Sorcery:
      itemRecord.name = `${itemRecord.name} of Sorcery`
      break
    case ItemSuffixType.Spirit:
      itemRecord.name = `${itemRecord.name} of Spirit`
      break
    case ItemSuffixType.Stamina:
      itemRecord.name = `${itemRecord.name} of Stamina`
      break
    case ItemSuffixType.Strength:
      itemRecord.name = `${itemRecord.name} of Strength`
      break
    case ItemSuffixType.Striking:
      itemRecord.name = `${itemRecord.name} of Striking`
      break
    case ItemSuffixType.TheBear:
      itemRecord.name = `${itemRecord.name} of the Bear`
      break
    case ItemSuffixType.TheBoar:
      itemRecord.name = `${itemRecord.name} of the Boar`
      break
    case ItemSuffixType.TheEagle:
      itemRecord.name = `${itemRecord.name} of the Eagle`
      break
    case ItemSuffixType.TheFalcon:
      itemRecord.name = `${itemRecord.name} of the Falcon`
      break
    case ItemSuffixType.TheGorilla:
      itemRecord.name = `${itemRecord.name} of the Gorilla`
      break
    case ItemSuffixType.TheMonkey:
      itemRecord.name = `${itemRecord.name} of the Monkey`
      break
    case ItemSuffixType.TheOwl:
      itemRecord.name = `${itemRecord.name} of the Owl`
      break
    case ItemSuffixType.TheTiger:
      itemRecord.name = `${itemRecord.name} of the Tiger`
      break
    case ItemSuffixType.TheWhale:
      itemRecord.name = `${itemRecord.name} of the Whale`
      break
    case ItemSuffixType.TheWolf:
      itemRecord.name = `${itemRecord.name} of the Wolf`
      break
    case ItemSuffixType.Toughness:
      itemRecord.name = `${itemRecord.name} of Toughness`
      break
    case ItemSuffixType.Twain:
      itemRecord.name = `${itemRecord.name} of Twain`
      break
  }
  return itemRecord
}