import { CreatureType } from '@ultrabis/wow-common'

export default interface CreatureRecord {
  id: number
  name: string
  type?: CreatureType
  level: number
}
