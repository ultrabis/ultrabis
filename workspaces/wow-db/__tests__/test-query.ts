import { DBFull as DB, query } from '../src'

import {
  ItemSlot,
  ItemBonusType,
  ItemSuffixType,
  ZoneType,
  CreatureType
} from '@ultrabis/wow-common'

///////////////////////////////////////////////////////
// zone
///////////////////////////////////////////////////////
//console.log(query.zones(DB, { type: ZoneType.Battleground }))
//console.log(query.zones(DB, { name: 'molten', partialMatches: true }))
//console.log(query.zone(DB, { id: 3456 }))

///////////////////////////////////////////////////////
// creature
///////////////////////////////////////////////////////
//console.log(query.creatures(DB, { type: CreatureType.Beast }))
//console.log(query.creatures(DB, { name: 'rag', partialMatches: true }))

///////////////////////////////////////////////////////
// itemSuffix
///////////////////////////////////////////////////////

//console.log(JSON.stringify(query.itemSuffixes(DB, { bonusType: ItemBonusType.Agility })))
//console.log(query.itemSuffixes(DB, { id: 287, typeName: 'sta', partialMatches: true }))
//console.log(query.itemSuffixes(DB, { id: 287, typeName: 'stamina' }))
//console.log(JSON.stringify(query.itemSuffixes(DB, { bonusTypeName: 'agi', partialMatches: true })))
//console.log(
//  JSON.stringify(query.itemSuffixes(DB, { type: ItemSuffixType.ArcaneWrath, bonusValue: 40 }))
//)

///////////////////////////////////////////////////////
// item
///////////////////////////////////////////////////////

//console.log(query.items(DB, { name: 'Desertwalker Cane' }))
//console.log(query.items(DB, { name: 'masters hat', partialMatches: true }))
//console.log(JSON.stringify(query.items(DB, { phase: 2 }), null, 2))
//console.log(query.items(DB, { slot: ItemSlot.Trinket }))
//console.log(query.items(DB, { name: 'arcane', partialMatches: true, excludeRandomEnchants: true }))
//console.log(query.item(DB, { name: 'neltharions tear', excludeRaids: true }))

///////////////////////////////////////////////////////
// enchant
///////////////////////////////////////////////////////
//console.log(query.enchants(DB, { name: 'Presence', partialMatches: true }))
//console.log(query.enchants(DB, { slot: ItemSlot.Head }))
console.log(JSON.stringify(query.enchants(DB, { phase: 4 }), null, 2))
