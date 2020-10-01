/**
 * Interal: gear items can have three states:
 *
 *  - BIS: let the optimizer determine the best item
 *  - Naked: no equipped item
 *  - Otherwise an item id
 */
enum CustomGearValue {
  BIS,
  Naked
}

export default CustomGearValue
