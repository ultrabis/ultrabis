/* FIXME: this is nasty, but spell pen was a bust and I lost interest */

export const targetResistanceFromLevel = (
  playerLevel: number,
  spellIsBinary: boolean,
  targetLevel: number
): number => {
  if (spellIsBinary) {
    return 0
  }

  return (
    (targetLevel > playerLevel ? targetLevel - playerLevel : 0) *
    parseFloat((0.1333 * playerLevel).toFixed(2))
  )
}

export const targetResistanceEffective = (
  playerLevel: number,
  playerSpellPenetration: number,
  spellIsBinary: boolean,
  targetLevel: number,
  targetResistance: number
): number => {
  const fromLevel = targetResistanceFromLevel(playerLevel, spellIsBinary, targetLevel)
  const sr = Math.min(targetResistance, 5 * playerLevel - fromLevel)
  return sr - Math.min(playerSpellPenetration, sr) + fromLevel
}

export const targetResistanceEffectiveFromPartial = (partialResistAverage: number): number => {
  return 4 * partialResistAverage
}

export const targetResistanceFromPartial = (
  partialResistAverage: number,
  playerLevel: number,
  playerSpellPenetration: number,
  spellIsBinary: boolean,
  targetLevel: number
): number => {
  if (spellIsBinary) {
    return targetResistanceEffectiveFromPartial(partialResistAverage)
  }

  const fromLevel = targetResistanceFromLevel(playerLevel, spellIsBinary, targetLevel)
  const eff = targetResistanceEffectiveFromPartial(partialResistAverage)
  return eff + playerSpellPenetration - fromLevel
}

export const partialResistAverage = (
  playerLevel: number,
  playerSpellPenetration: number,
  targetLevel: number,
  targetResistance: number,
  spellIsBinary: boolean
): number => {
  const sr = targetResistanceEffective(
    playerLevel,
    playerSpellPenetration,
    spellIsBinary,
    targetLevel,
    targetResistance
  )
  return ((0.75 * sr) / (5 * playerLevel)) * 100
}

export const spellPenetrationWeight = (
  playerLevel: number,
  playerSpellPenetration: number,
  playerSpellPower: number,
  spellBaseDamage: number,
  spellBaseDamageMultiplier: number,
  spellCoefficient: number,
  spellIsBinary: boolean,
  targetLevel: number,
  targetResistance: number
): number => {
  const tre = targetResistanceEffective(
    playerLevel,
    playerSpellPenetration,
    spellIsBinary,
    targetLevel,
    targetResistance
  )
  const fromLevel = targetResistanceFromLevel(playerLevel, spellIsBinary, targetLevel)

  if (tre <= fromLevel) {
    return 0
  }

  return (
    (spellBaseDamageMultiplier * spellBaseDamage + spellCoefficient * playerSpellPower) /
    (spellCoefficient * (400 - (targetResistance - playerSpellPenetration)))
  )
}
