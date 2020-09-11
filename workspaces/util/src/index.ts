// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path="../../tsconfig/types/statsjs/index.d.ts" />
import pako from 'pako'
import { Base64 } from 'js-base64'
import stats from 'statsjs'
import mathjs from 'mathjs'

/**
 * Returns cloned object `o`.
 *
 * This is a ghetto version of underscores `clonedeep`
 *
 * @param o
 */
export const cloneObject = (o: object): any => {
  return JSON.parse(JSON.stringify(o, null, 1))
}

/**
 * Strips special characters from `s`, not including dashes and spaces
 *
 * @param s string to strip
 */
export const stripString = (s: string): string => {
  return s
    .replace(/!/g, '')
    .replace(/'/g, '')
    .replace(/\"/g, '')
    .replace(/:/g, '')
    .replace(/,/g, '')
    .replace(/\./g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/%/g, '')
}

/**
 *
 * Returns `s` in the internal format used for fuzzy string compares
 *
 * @param s string to fuzzify
 */
export const fuzzifyString = (s: string): string => {
  return stripString(s).replace(/-/g, '').replace(/ /g, '').toLowerCase()
}

/**
 *
 * Returns `s` in format wowhead uses on URL's e.g. 'masters-hat'
 *
 * @param s
 */
export const dashifyString = (s: string): string => {
  return stripString(s)
    .replace(/ - /g, '-')
    .replace(/ /g, '-')
    .replace(/^-+|-+$/gm, '')
    .toLowerCase()
}

/**
 *
 * Return `s` with first letter capitalized
 *
 * @param s
 */
export const capitalizeString = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 *
 * Return `true` if `needle` is found in `haystack`, using fuzzy string matching
 *
 * @param haystack
 * @param needle
 */
export const fuzzyIncludes = (haystack: string, needle: string): boolean => {
  return fuzzifyString(haystack).includes(fuzzifyString(needle))
}

/**
 *
 * Is `s` a single letter?
 *
 * @param s
 */
export const isLetter = (s: string): boolean => {
  return s.length === 1 && s.match(/[a-z]/i) ? true : false
}

/**
 *
 * Returns the value of `paramName` found in `url`
 *
 * @param url a url with parameters
 * @param paramName name of parameter
 */
export const paramValueFromURL = (url: string, paramName: string): string | undefined => {
  const params = new URLSearchParams(url)
  if (params === undefined) {
    return undefined
  }
  const value = params.get(paramName.toLowerCase())
  return value !== null ? value : undefined
}

/**
 *
 * Gzips and encodes `value` for use a URL parameter. We're calling this a 'paramin'.
 *
 * @param s
 */
export const valueToParamin = (value: string): string => {
  return Base64.btoa(pako.deflateRaw(value, { to: 'string', level: 9 }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 *
 * Gunzips and decodes `paramin`, returning the value.
 *
 * @param s
 */
export const paraminToValue = (paramin: string): string => {
  return pako.inflateRaw(
    Base64.atob(
      (paramin + '===')
        .slice(0, paramin.length + (paramin.length % 4))
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    ),
    { to: 'string' }
  )
}

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
  const enumKeys = Object.keys(myEnum)
  for (let i = 0; i < enumKeys.length; i++) {
    const fuzzyEnumKey = fuzzifyString(enumKeys[i])
    const fuzzyInputKey = fuzzifyString(myEnumKey)
    if (fuzzyEnumKey === fuzzyInputKey) {
      if (myEnum[enumKeys[i]] !== NaN) {
        return myEnum[enumKeys[i]]
      }
    }
  }
  return undefined
}

export const enumValuesFromKeys = (myEnum: object, myEnumKeys: string[]): number[] => {
  const enumValues = [] as number[]

  const enumKeys = Object.keys(myEnum)
  for (let i = 0; i < enumKeys.length; i++) {
    for (let x = 0; x < myEnumKeys.length; i++) {
      const fuzzyEnumKey = fuzzifyString(enumKeys[i])
      const fuzzyMyEnumKey = fuzzifyString(myEnumKeys[x])
      if (fuzzyEnumKey === fuzzyMyEnumKey) {
        if (myEnum[enumKeys[i]] !== NaN) {
          enumValues.push(myEnum[enumKeys[i]])
        }
      }
    }
  }
  return enumValues
}

/**
 *
 * Return key of `myEnum` matching `enumValue`
 *
 * @param myEnum
 * @param enumValue
 */
export const enumKeyFromValue = (myEnum: object, enumValue: number | string): string => {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue)
  return keys.length > 0 ? keys[0] : ''
}

/**
 *
 * Returns `num` as a rounded string
 *
 * @param num
 * @param decimals
 */
export const numberToRoundedString = (num: number, decimals: number): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 *
 * Returns triangular of `n`
 *
 * @param n
 */
export const triangularNumber = (n: number): number => {
  return (n * (n + 1)) / 2
}

/**
 *
 * Return probability of `chance` occuring at least `x` times out of `trials`.
 *
 * Example: With a crit chance of `chance`, what is the probablity of critting at least
 * `x` times out of `trials` casts.
 *
 *
 * @param trials Number of trials to run
 * @param chance Chance of one occurance e.g. crit chance
 * @param x
 */
export const cumulativeChance = (trials: number, chance: number, x: number): number => {
  return 1 - stats.binomcdf(trials, chance, x)
}

/**
 *
 * Return probability of `chance` occuring at least `x` times *in a row* out of `trials`.
 *
 * Example: With a crit chance of `chance`, what is the probablity of hitting a streak of
 * `x` crits in a row in `trials` casts.
 *
 *
 * @param trials Number of trials to run
 * @param chance Chance of one occurance e.g. crit chance
 * @param x
 */
export const consecutiveChance = (trials: number, chance: number, x: number): number => {
  const sStart = mathjs.zeros([x + 1, x + 1])
  sStart[0][0] = 1

  const T = mathjs.zeros([x + 1, x + 1])
  for (let i = 0; i < x; i++) {
    T[0][i] = 1 - chance
    T[i + 1][i] = chance
  }

  T[x][x] = 1
  const sEnd = mathjs.multiply(mathjs.pow(T, trials), sStart)
  // @ts-ignore
  return sEnd.slice(-1)[0][0]
}

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

/**
 * Are we running in a browser?
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined'
}

/**
 * Are we running in a mobile browser?
 */
export const isMobile = (): boolean => {
  if (!isBrowser) {
    return false
  }

  const mql = window.matchMedia('(max-width: 768px)')
  if (!mql.matches) {
    return true
  }

  return false
}

/**
 * Are we running in node?
 */
export const isNode = (): boolean => {
  return typeof process !== 'undefined' && process.versions != null && process.versions.node != null
}
