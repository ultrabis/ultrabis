import fs from 'fs'
import path from 'path'
import request from 'requestretry'
import zlib from 'zlib'

/**
 *
 * download `url` to `dest`. by default we request and write as gzip. if opts.unzip
 * is true and it's indeed gzipped, we'll unzip it first.
 *
 * TODO: replace with https://github.com/node-fetch/node-fetch
 *
 * @param url
 * @param dest
 * @param opts
 */
export const download = async (
  url: string,
  dest: string,
  opts?: { unzip?: boolean }
): Promise<unknown> => {
  if (fs.existsSync(dest)) {
    return
  }

  console.log(`-- downloading ${url} -> ${dest}`)

  const headers = { 'Accept-Encoding': 'gzip' }
  const outputPathResolved = path.resolve(dest)
  const writer = fs.createWriteStream(outputPathResolved)

  request({ url: url, headers: headers }).on('response', function (response) {
    if (opts && opts.unzip && response.headers['content-encoding'] === 'gzip') {
      response.pipe(zlib.createGunzip()).pipe(writer)
    } else {
      response.pipe(writer)
    }
  })

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

/**
 *
 * read file as plain text string
 *
 * @param filePath
 */
export const stringFromFile = (filePath: string): string => {
  try {
    return fs.readFileSync(filePath).toString()
  } catch (err) {
    return ``
  }
}

/**
 *
 * Write string `data` to `filePath`
 *
 * @param filePath
 * @param data
 */
export const stringToFile = (filePath: string, data: string): void => {
  return fs.writeFileSync(filePath, data)
}

/**
 *
 * read gzip file as plain text string
 *
 * @param filePath
 */
export const stringFromGzipFile = (filePath: string): string => {
  return zlib.gunzipSync(fs.readFileSync(filePath)).toString()
}

/**
 *
 * read JSON from a plaintext file
 *
 * @param filePath
 */
export const jsonFromFile = (filePath: string): any => {
  return JSON.parse(stringFromFile(filePath))
}

/**
 *
 * Write `myJSON` to `filePath`, stringifying it first
 *
 * @param filePath
 * @param myJSON
 */
export const jsonToFile = (filePath: string, myJSON: object): void => {
  return stringToFile(filePath, JSON.stringify(myJSON))
}

/**
 *
 * read JSON from a gzipped file
 *
 * @param filePath
 */
export const jsonFromGzipFile = (filePath: string): any => {
  return JSON.parse(stringFromGzipFile(filePath))
}

/**
 * Does `filePath` exist?
 *
 * @param filePath
 */
export const fileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath)
}

/**
 *
 * Remove file at `filePath`, if it exists
 *
 * @param filePath
 */
export const removeFile = (filePath: string): void => {
  if (fileExists(filePath)) {
    fs.unlinkSync(filePath)
  }
}
