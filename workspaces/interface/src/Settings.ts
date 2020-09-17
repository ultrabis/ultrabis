import GameSettings from './GameSettings'
import PlayerSettings from './PlayerSettings'
import TargetSettings from './TargetSettings'
import GearSettings from './GearSettings'

export default interface Settings {
  game: GameSettings
  player: PlayerSettings
  target: TargetSettings
  gear: GearSettings
  debug: boolean
}
