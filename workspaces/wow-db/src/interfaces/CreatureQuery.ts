import { CreatureType } from '@ultrabis/wow-common'
import Query from './Query'

export default interface CreatureQuery extends Query {
  id?: number
  name?: string
  type?: CreatureType
}
