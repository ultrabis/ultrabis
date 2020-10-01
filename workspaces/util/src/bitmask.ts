/**
 * Basic bitmask functions, mainly used in combination with enums.
 * For example, if a user selects 5 values from a Raid enum, we can
 * convert those choices to a bitmask, which will smaller in size
 * than an array of 5 values.
 *
 * Each function also includes a 'bigmask' alternative, which uses
 * BigInt's. They're needed for big masks (32 or more options), but
 * are slightly unweildly; they must be converted to strings when
 * stored in JSON.
 */

import { enumValues, enumValuesFromKeys, enumKeysFromValues } from './enum'

/**
 *
 * Return a bitmask of `values`.
 *
 * @param values array of numeric values
 * @param shiftValues optionally left shift values with 1. e.g. '8' becomes '256'
 */
export const bitmaskFromValues = (values: number[], shiftValues?: boolean): number => {
  let bitmask = 0
  for (let i = 0; i < values.length; i++) {
    bitmask |= shiftValues ? 1 << values[i] : values[i]
  }
  return bitmask
}

export const bigmaskFromValues = (values: number[], shiftValues?: boolean): bigint => {
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
): number => {
  return bitmaskFromValues(enumValuesFromKeys(myEnum, myEnumKeys), shiftValues)
}

export const bigmaskFromEnumKeys = (
  myEnum: object,
  myEnumKeys: string[],
  shiftValues?: boolean
): bigint => {
  return bigmaskFromValues(enumValuesFromKeys(myEnum, myEnumKeys), shiftValues)
}

/**
 *
 * Does `value` exist in `bitmask`?
 *
 * @param bitmask bitmask to check
 * @param value value to look for
 * @param shiftValue optionally left shift value with 1. e.g. '8' becomes '256'
 */
export const bitmaskIncludes = (bitmask: number, value: number, shiftValue?: boolean): boolean => {
  const val: number = shiftValue ? 1 << value : value
  return (bitmask & val) === val
}

export const bigmaskIncludes = (bitmask: bigint, value: number, shiftValue?: boolean): boolean => {
  const val: bigint = shiftValue ? BigInt(1) << BigInt(value) : BigInt(value)
  return (BigInt(bitmask) & BigInt(val)) === BigInt(val)
}

/**
 *
 * Return array of values set in `bitmask`
 *
 * @param bitmask
 * @param shiftValues optionally left shift values with 1. e.g. '8' becomes '256'
 */
export const bitmaskToValues = (bitmask: number, shiftValues?: boolean): number[] => {
  const values: number[] = []

  for (let i = 0; i <= bitmask; i++) {
    if (bitmaskIncludes(bitmask, i, shiftValues)) {
      values.push(i)
    }
  }

  return values
}

export const bigmaskToValues = (bitmask: bigint, shiftValues?: boolean): number[] => {
  const values: number[] = []

  for (let i = 0; i <= bitmask; i++) {
    if (bigmaskIncludes(bitmask, i, shiftValues)) {
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
  bitmask: number,
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

export const bigmaskToEnumValues = (
  bitmask: bigint,
  myEnum: object,
  shiftValues?: boolean
): number[] => {
  const values: number[] = []

  const myEnumValues = enumValues(myEnum)
  for (let i = 0; i < myEnumValues.length; i++) {
    if (bigmaskIncludes(bitmask, myEnumValues[i], shiftValues)) {
      values.push(myEnumValues[i])
    }
  }

  return values
}

/**
 *
 *  Converts bitmask into array of enum key strings
 *
 * @param bitmask
 * @param myEnum
 * @param shiftValues
 */
export const bitmaskToEnumKeys = (
  bitmask: number,
  myEnum: object,
  shiftValues?: boolean
): string[] => {
  return enumKeysFromValues(myEnum, bitmaskToEnumValues(bitmask, myEnum, shiftValues))
}

export const bigmaskToEnumKeys = (
  bitmask: bigint,
  myEnum: object,
  shiftValues?: boolean
): string[] => {
  return enumKeysFromValues(myEnum, bigmaskToEnumValues(bitmask, myEnum, shiftValues))
}
