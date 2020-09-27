import { PvPRank, PlayableClass } from './enums'
import { enumValueFromKey, enumValuesFromKeys, bitmaskFromValues } from '@ultrabis/util'

export const pvpRankFromText = (text: string): PvPRank | undefined => {
  return enumValueFromKey(PvPRank, text)
}

export const classesFromText = (text: string): PlayableClass[] => {
  /* sometimes this is in the format "Classes: class, class, etc".
   * so just be dumb and strip it out if it's there. */
  return enumValuesFromKeys(PlayableClass, text.replace(/Classes: /g, '').split(','))
}

export const classesMaskFromText = (text: string): BigInt => {
  return bitmaskFromValues(classesFromText(text), true)
}
