import { ZoneType } from '@ultrabis/wow-common'

export default interface ZoneRecord {
  id: number
  name: string
  type: ZoneType
  min?: number // min level
  max?: number // max level
  req?: number // required level
  n?: number // number of players
}
