import { MagicSchool } from '@ultrabis/enum'
import { TargetType } from '@ultrabis/enum'

export default interface TargetSettings {
  level: number
  shimmer: MagicSchool
  thunderfury: number
  type: TargetType
  spellResistance: number
  debuffs: string[]
}
