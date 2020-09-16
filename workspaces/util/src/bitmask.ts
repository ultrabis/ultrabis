import { enumValues, enumValuesFromKeys, enumKeysFromValues } from './enum'

/**
 *
 * Return a bitmask of `values`.
 *
 * @param values array of numeric values
 * @param shiftValues optionally left shift values with 1. e.g. '8' becomes '256'
 */
export const bitmaskFromValues = (values: number[], shiftValues?: boolean): bigint => {
  let bitmask = BigInt(0)
  for (let i = 0; i < values.length; i++) {
    bitmask |= shiftValues ? BigInt(1) << BigInt(values[i]) : BigInt(values[i])
  }
  return bitmask
}

/**
 *
 * Return bitmask of enum values
 *
 * @param myEnum
 * @param myEnumKeys may be fuzzy
 * @param shiftValues
 */
export const bitmaskFromEnumKeys = (
  myEnum: object,
  myEnumKeys: string[],
  shiftValues?: boolean
): bigint => {
  return bitmaskFromValues(enumValuesFromKeys(myEnum, myEnumKeys), shiftValues)
}

/**
 *
 * Return array of values set in `bitmask`
 *
 * @param bitmask
 * @param shiftValues optionally left shift values with 1. e.g. '8' becomes '256'
 */
export const bitmaskToValues = (bitmask: bigint, shiftValues?: boolean): number[] => {
  const values: number[] = []

  for (let i = 0; i <= bitmask; i++) {
    if (bitmaskIncludes(bitmask, i, shiftValues)) {
      values.push(i)
    }
  }

  return values
}
/**
 *
 * Return array of values set in `bitmask`.
 *
 * This is faster than `bitmaskToValues()`.
 *
 * @param bitmask
 * @param myEnum
 * @param shiftValues optionally left shift values with 1. e.g. '8' becomes '256'
 */
export const bitmaskToEnumValues = (
  bitmask: bigint,
  myEnum: object,
  shiftValues?: boolean
): number[] => {
  const values: number[] = []

  const myEnumValues = enumValues(myEnum)
  for (let i = 0; i < myEnumValues.length; i++) {
    if (bitmaskIncludes(bitmask, myEnumValues[i], shiftValues)) {
      values.push(myEnumValues[i])
    }
  }

  return values
}

export const bitmaskToEnumKeys = (
  bitmask: bigint,
  myEnum: object,
  shiftValues?: boolean
): string[] => {
  return enumKeysFromValues(myEnum, bitmaskToEnumValues(bitmask, myEnum, shiftValues))
}
/**
 *
 * Does `value` exist in `bitmask`?
 *
 * @param bitmask bitmask to check
 * @param value value to look for
 * @param shiftValue optionally left shift value with 1. e.g. '8' becomes '256'
 */
export const bitmaskIncludes = (bitmask: bigint, value: number, shiftValue?: boolean): boolean => {
  const val: bigint = shiftValue ? BigInt(1) << BigInt(value) : BigInt(value)
  return (BigInt(bitmask) & BigInt(val)) === BigInt(val)
}
