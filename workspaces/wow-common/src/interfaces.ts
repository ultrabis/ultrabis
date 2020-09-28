/**
 *
 * Interfaces are affixed with a word describing their usage, primarily to prevent naming conflicts.
 * A name with no affix is reserved for UI components e.g. `Item`
 *
 * -Query    options used to query records in a database.
 * -Record   record in a database.
 * -Entity   higher level object, typically extending a Record.
 * -Object   misc object. TBD.
 *
 *****************************************************************************************************
 *
 * Of particular note is the distinguishment between Record and Entity.
 * Records are read-only and Entities are read-write. Records should be kept
 * low-level and away from the user i.e. never passed to a component.
 *
 * Why? Consider putting the calculated property `score` on ItemRecord.
 * Say we do a query of items and assign a `score` to each record. Then we
 * later do a unrelated query of item records; low and behold the item records
 * still contain the `score` values assigned from the previous query. This is
 * because javascript handles these records as references, not unique values.
 * So for this reason it's good to ensure Record object always reflect what's
 * actually stored in the database.
 *
 */

// Item
export { default as ItemQuery } from './interfaces/ItemQuery'
export { default as ItemRecord } from './interfaces/ItemRecord'
export { default as ItemEntity } from './interfaces/ItemEntity'

// ItemSuffix
export { default as ItemSuffixQuery } from './interfaces/ItemSuffixQuery'
export { default as ItemSuffixRecord } from './interfaces/ItemSuffixRecord'

// Enchant
export { default as EnchantRecord } from './interfaces/EnchantRecord'

// Zone
export { default as ZoneRecord } from './interfaces/ZoneRecord'

// Target
export { default as TargetRecord } from './interfaces/TargetRecord'

// Misc
export { default as ItemListRecord } from './interfaces/ItemListRecord'
export { default as GearSettingsObject } from './interfaces/GearSettingsObject'
