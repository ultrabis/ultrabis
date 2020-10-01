import { ZoneType } from '@ultrabis/wow-common'
import Query from './Query'

export default interface ZoneQuery extends Query {
  id?: number
  name?: string
  partialName?: string
  type?: ZoneType
}
