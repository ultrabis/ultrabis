import TalentSettings from './TalentSettings'
import { PlayableRace, PlayableClass, PvPRank } from '@ultrabis/enum'

export default interface PlayerSettings {
  rotation: string
  level: number
  race: PlayableRace
  class: PlayableClass
  pvpRank: PvPRank
  buffs: string[]
  talents: TalentSettings
}
