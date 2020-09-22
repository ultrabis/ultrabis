import { ItemSuffixType } from '../enums'

export default interface ItemSuffixQuery {
  id?: number
  type?: ItemSuffixType
  bonusValue?: number
}
