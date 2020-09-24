/**
 *
 * There's a dumb little naming scheme. Using the `Item` concept for example:
 *
 * ItemRecord = interface describing the row in the database table. we call it
 *              a database record, but it's really a single array member from
 *              the .json files in '@ultrabis/db'
 *
 * ItemObject = interface describing a higher level object. this object extends
 *              ItemRecord and includes additional values derived at run-time.
 *              e.g. 'score'
 *
 * Item       = the UI component, which takes ItemObject as input
 *
 */

// database record objects
export { default as ItemRecord } from './interfaces/ItemRecord'
export { default as EnchantRecord } from './interfaces/EnchantRecord'
export { default as ItemSuffixRecord } from './interfaces/ItemSuffixRecord'
export { default as ItemListRecord } from './interfaces/ItemListRecord'

// higher level objects
export { default as ItemObject } from './interfaces/ItemObject'
export { default as GearSettingsObject } from './interfaces/GearSettingsObject'
