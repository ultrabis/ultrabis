import { GameType } from '@ultrabis/enum'

export default interface GameSettings {
  type: GameType
  phase: number
  castTimePenalty: number
  encounterLength: number
}
