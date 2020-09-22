import ItemBonus from './ItemBonus'
import { ItemSuffixType } from '../enums'

export default interface ItemSuffix {
  id: number
  type: ItemSuffixType
  bonus: ItemBonus[]
}
