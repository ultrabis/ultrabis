import ItemRecord from './ItemRecord'
import ItemSuffixRecord from './ItemSuffixRecord'
import EnchantRecord from './EnchantRecord'
import CreatureRecord from './CreatureRecord'
import ZoneRecord from './ZoneRecord'

export default interface Database {
  item: ItemRecord[]
  itemSuffix: ItemSuffixRecord[]
  enchant: EnchantRecord[]
  creature: CreatureRecord[]
  zone: ZoneRecord[]
}
