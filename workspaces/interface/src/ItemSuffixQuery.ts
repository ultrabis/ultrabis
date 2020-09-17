import { ItemSuffixType } from '@ultrabis/enum'

export default interface ItemSuffixQuery {
  id?: number
  type?: ItemSuffixType
  bonusValue?: number
}
