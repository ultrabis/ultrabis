import { GameType } from '../enums'

export default interface GameSettings {
  type: GameType
  phase: number
  castTimePenalty: number
  encounterLength: number
}
