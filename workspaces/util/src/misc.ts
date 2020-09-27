/**
 * Returns cloned object `o`. Ghetto version of lodash `clonedeep`.
 *
 * @param o
 */
export const cloneObject = (o: object): any => {
  return JSON.parse(JSON.stringify(o, null, 1))
}

/**
 *
 *
 * Compare two objects. Ghetto version of lodash `isEqual`
 *
 */
export const isEqual = (o1: any, o2: any): boolean => {
  return JSON.stringify(o1) === JSON.stringify(o2)
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
