import ItemBonusObject from './ItemBonusObject'

export default interface ItemSuffixRecord {
  id: number
  type: number
  bonus: ItemBonusObject[]
}
