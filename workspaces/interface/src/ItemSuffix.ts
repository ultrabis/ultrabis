import ItemBonus from './ItemBonus'
import { ItemSuffixType } from '@ultrabis/enum'

export default interface ItemSuffix {
  id: number
  type: ItemSuffixType
  bonus: ItemBonus[]
}
