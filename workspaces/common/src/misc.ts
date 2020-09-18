import { PvPRank, PlayableClass } from '@ultrabis/enum'
import { enumValueFromKey, enumValuesFromKeys } from '@ultrabis/util'

export const pvpRankFromText = (text: string): PvPRank | undefined => {
  return enumValueFromKey(PvPRank, text)
}

export const playableClassesFromText = (text: string): PlayableClass[] => {
  /* sometimes this is in the format "Classes: class, class, etc".
   * so just be dumb and strip it out if it's there. */
  return enumValuesFromKeys(PlayableClass, text.replace(/Classes: /g, '').split(','))
}
