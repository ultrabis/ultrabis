import ItemBonusType from '../enums/ItemBonusType'

export default interface ItemSuffixQuery {
  id?: number
  name?: string
  partialName?: string
  type?: number
  bonusType?: ItemBonusType
  bonusValue?: number
}
