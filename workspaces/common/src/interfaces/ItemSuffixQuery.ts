import ItemBonusType from '../enums/ItemBonusType'

export default interface ItemSuffixQueryObject {
  id?: number
  type?: number
  bonusType?: ItemBonusType
  bonusValue?: number
}
