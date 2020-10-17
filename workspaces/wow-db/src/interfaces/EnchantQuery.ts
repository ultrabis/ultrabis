import { ItemSlot } from '@ultrabis/wow-common'
import Query from './Query'

export default interface EnchantQuery extends Query {
  id?: number
  name?: string
  slot?: ItemSlot
  phase?: number
}
