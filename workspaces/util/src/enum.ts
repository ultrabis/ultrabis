import { fuzzyEquals } from './string'


/**
 *
 * Returns array of keys from `myEnum`
 *
 * @param myEnum
 */
export const enumKeys = (myEnum: object): string[] =>
  Object.keys(myEnum).filter((key) => isNaN(Number(key)))

/**
 *
 * Return matching key in `myEnum`
 *
 * @param myEnum
 * @param myEnumKey
 */
export const enumKey = (myEnum: object, myEnumKey: string): string | undefined => {
  return enumKeys(myEnum).find((k) => {
    return fuzzyEquals(k, myEnumKey)
  })
}

/**
 *
 * Returns array of values from `myEnum`
 *
 * @param myEnum
 */
export const enumValues = (myEnum: object): number[] => enumKeys(myEnum).map((key) => myEnum[key])

/**
 * Return value of `myEnum` matching `myEnumKey`
 *
 * @param myEnum
 * @param myEnumKey
 */
export const enumValueFromKey = (myEnum: object, myEnumKey: string): number | undefined => {
  const _enumKey = enumKey(myEnum, myEnumKey)
  return _enumKey ? myEnum[_enumKey] : undefined
}

/**
 *
 * Returns array of values matching `myEnumKeys` from `myEnum`
 *
 * @param myEnum
 * @param myEnumKeys can be fuzzy
 *
 */
export const enumValuesFromKeys = (myEnum: object, myEnumKeys: string[]): number[] => {
  const _enumValues = [] as number[]
  myEnumKeys.forEach((fk) => {
    const k = enumKey(myEnum, fk)
    if (k) {
      _enumValues.push(myEnum[k])
    }
  })
  return _enumValues
}

/**
 *
 * Return key of `myEnum` matching `enumValue`
 *
 * @param myEnum
 * @param enumValue
 */
export const enumKeyFromValue = (myEnum: object, enumValue: number): string | undefined => {
  return enumKeys(myEnum).find((k) => {
    return myEnum[k] === enumValue
  })
}

/**
 *
 * Return array of keys matching `myEnumValues`
 *
 * @param myEnum
 * @param myEnumValues
 */
export const enumKeysFromValues = (myEnum: object, myEnumValues: number[]): string[] => {
  return enumKeys(myEnum).filter((k) => {
    return myEnumValues.includes(myEnum[k])
  })
}
