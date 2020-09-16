import pako from 'pako'
import { Base64 } from 'js-base64'

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
export const paraminFromValue = (value: string): string => {
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
