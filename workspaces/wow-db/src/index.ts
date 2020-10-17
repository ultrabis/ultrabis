// interfaces
export { default as ItemQuery } from './interfaces/ItemQuery'
export { default as ItemRecord } from './interfaces/ItemRecord'
export { default as ItemEntity } from './interfaces/ItemEntity'
export { default as ItemSuffixQuery } from './interfaces/ItemSuffixQuery'
export { default as ItemSuffixRecord } from './interfaces/ItemSuffixRecord'
export { default as ItemListRecord } from './interfaces/ItemListRecord'
export { default as EnchantRecord } from './interfaces/EnchantRecord'
export { default as EnchantQuery } from './interfaces/EnchantQuery'
export { default as ZoneRecord } from './interfaces/ZoneRecord'
export { default as ZoneQuery } from './interfaces/ZoneQuery'
export { default as CreatureRecord } from './interfaces/CreatureRecord'
export { default as CreatureQuery } from './interfaces/CreatureQuery'
export { default as Database } from './interfaces/Database'

// databases
import Database from './interfaces/Database'
import * as _DBFull from './custom/full'
export const DBFull: Database = {
  item: _DBFull.item,
  itemSuffix: _DBFull.itemSuffix,
  enchant: _DBFull.enchant,
  creature: _DBFull.creature,
  zone: _DBFull.zone
}
import * as _DBFeral from './custom/feral'
export const DBFeral: Database = {
  item: _DBFeral.item,
  itemSuffix: _DBFeral.itemSuffix,
  enchant: _DBFeral.enchant,
  creature: _DBFeral.creature,
  zone: _DBFeral.zone
}
import * as _DBMage from './custom/mage'
export const DBMage: Database = {
  item: _DBMage.item,
  itemSuffix: _DBMage.itemSuffix,
  enchant: _DBMage.enchant,
  creature: _DBMage.creature,
  zone: _DBMage.zone
}
import * as _DBMoonkin from './custom/moonkin'
export const DBMoonkin: Database = {
  item: _DBMoonkin.item,
  itemSuffix: _DBMoonkin.itemSuffix,
  enchant: _DBMoonkin.enchant,
  creature: _DBMoonkin.creature,
  zone: _DBMoonkin.zone
}
import * as _DBWarlock from './custom/warlock'
export const DBWarlock: Database = {
  item: _DBWarlock.item,
  itemSuffix: _DBWarlock.itemSuffix,
  enchant: _DBWarlock.enchant,
  creature: _DBWarlock.creature,
  zone: _DBWarlock.zone
}

// code
export * as query from './query'
export * from './item'
