import { ItemBonusType } from '@ultrabis/wow-common'
import Query from './Query'

export default interface ItemSuffixQuery extends Query {
  id?: number
  type?: number
  typeName?: string
  bonusType?: ItemBonusType
  bonusTypeName?: string
  bonusValue?: number
}
