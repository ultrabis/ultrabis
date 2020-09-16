# enum

typescript enums are used to represent things like zones, item slots, classes,
races, magic schools, etc. that are shared throughout the projects.

- all enums are strictly string keys with numeric values

- when possible enum values match blizzard api, wowhead and/or warcraftlogs

- `util` has a suite of functions for handling enums, which among other things,
  supports finding values with fuzzy key searches and converting to/from
  values, keys and bitmasks
