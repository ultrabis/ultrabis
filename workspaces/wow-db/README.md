# @ultrabis/db

JSON database for World of Warcraft Classic.

The purpose is to provide a database for simulators and/or other tools without
requiring a back-end database server. 

![build](https://github.com/ultrabis/db/workflows/gh/badge.svg)

## how to use

TODO

## static download

JSON files that can be used as-is by third party programs, without requiring
this library. This version is *much* larger in size.

[full (9M)][full-static] 
[moonkin (186K)][moonkin-static]
[feral (223K)][feral-static]
[warlock (172K)][warlock-static]
[mage (99K)][mage-static]

### icons

The icons for all items are included in `cache/icons`

# Developer notes

there's multiple phases to this build, but in most cases we're only running the top
level `build`.

`build:cache` - downloads all required item xml, html, icons, etc into the `cache` directory.
As the name suggests, it will only download things that don't already exist.

`build:db` - builds the databases and writes them into `src`. all the code for this is in `bin`

`build` - generates the library with `tsc` and writes to `lib`. 

--

Master's Hat of Arcane Wrath (+40 Arcane Spell Damage)

Master's Hat = Base Item
Arcane Wrath = ItemSuffixType
Arcane Spell Damage = ItemBonusType

#### Credits and thanks

wowhead, classicwow.live, wowwiki.fandom.com, keftenks balance druid spreadsheet, shedo's cat spreadsheet, zephans warlock simulator, ginners mage spreadsheet

[full-static]: https://ultrabis.github.io/db/full/item-static.json
[moonkin-static]: https://ultrabis.github.io/db/moonkin/item-static.json
[feral-static]: https://ultrabis.github.io/db/feral/item-static.json
[mage-static]: https://ultrabis.github.io/db/mage/item-static.json
[warlock-static]: https://ultrabis.github.io/db/warlock/item-static.json
