//index.test.ts
/// <reference types="jest" />

import * as common from '../src/index'
import { ItemSuffixType } from '@ultrabis/enum'

test('itemSuffixTypeFromName', () => {
  expect(common.itemSuffixTypeFromName(`Master's Hat of Arcane Wrath`)).toBe(
    ItemSuffixType.ArcaneWrath
  )
  expect(common.itemSuffixTypeFromName(`Hands of Power`)).toBe(undefined)
  expect(common.itemSuffixTypeFromName(`Tome of Power`)).toBe(undefined)
  expect(common.itemSuffixTypeFromName(`Tome of Restoration`)).toBe(undefined)
})

test('resistance', () => {
  const playerLevel = 60
  const playerSpellPenetration = 0
  const playerSpellPower = 684
  const spellBaseDamage = 540
  const spellBaseDamageMultiplier = 1
  const spellCoefficient = 1
  const spellIsBinary = false
  const targetLevel = 63
  const targetResistance = 69

  const partialResistAverage = common.partialResistAverage(
    playerLevel,
    playerSpellPenetration,
    targetLevel,
    targetResistance,
    spellIsBinary
  )

  const targetResistanceEffective = common.targetResistanceEffective(
    playerLevel,
    playerSpellPenetration,
    spellIsBinary,
    targetLevel,
    targetResistance
  )

  const spellPenWeight = common.spellPenetrationWeight(
    playerLevel,
    playerSpellPenetration,
    playerSpellPower,
    spellBaseDamage,
    spellBaseDamageMultiplier,
    spellCoefficient,
    spellIsBinary,
    targetLevel,
    targetResistance
  )

  expect(partialResistAverage).toBe(23.25)
  expect(targetResistanceEffective).toBe(93)
  expect(spellPenWeight).toBe(3.697885196374622)

  expect(common.targetResistanceEffectiveFromPartial(partialResistAverage)).toBe(93)
  expect(
    common.targetResistanceFromPartial(
      partialResistAverage,
      playerLevel,
      playerSpellPenetration,
      spellIsBinary,
      targetLevel
    )
  ).toBe(69)
  expect(common.targetResistanceFromLevel(playerLevel, spellIsBinary, targetLevel)).toBe(24)
})
