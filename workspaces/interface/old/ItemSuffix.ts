import ItemBonus from './ItemBonus'
import ItemSuffixType from '../enum/ItemSuffixType'

export default interface ItemSuffix {
  id: number
  type: ItemSuffixType
  bonus: ItemBonus[]
}
