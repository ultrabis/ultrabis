import { MagicSchool, TargetType } from '../enums'

export default interface TargetSettings {
  level: number
  shimmer: MagicSchool
  thunderfury: number
  type: TargetType
  spellResistance: number
  debuffs: string[]
}
