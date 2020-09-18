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
 * Test fuzzy equality of two strings
 *
 * @param string1
 * @param string2
 */
export const fuzzyEquals = (string1: string, string2: string): boolean => {
  return fuzzifyString(string1) === fuzzifyString(string2)
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
 * Is `s` a single letter?
 *
 * @param s
 */
export const isLetter = (s: string): boolean => {
  return s.length === 1 && s.match(/[a-z]/i) ? true : false
}
