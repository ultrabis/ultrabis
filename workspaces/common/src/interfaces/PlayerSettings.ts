import TalentSettings from './TalentSettings'
import { PlayableRace, PlayableClass, PvPRank } from '../enums'

export default interface PlayerSettings {
  rotation: string
  level: number
  race: PlayableRace
  class: PlayableClass
  pvpRank: PvPRank
  buffs: string[]
  talents: TalentSettings
}
