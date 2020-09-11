//index.test.ts
/// <reference types="jest" />

import * as util from './index'

test('strings', () => {
  const testString = `'--..(!A:r%CanE W:rAth!)..--'`

  expect(util.fuzzifyString(testString)).toBe('arcanewrath')
  expect(util.dashifyString(testString)).toBe('arcane-wrath')
  expect(util.fuzzyIncludes(testString, 'arcane wrath')).toBe(true)
})

test('enums', () => {
  enum testEnum {
    Foo,
    Bar
  }

  expect(util.enumKeys(testEnum)).toStrictEqual(['Foo', 'Bar'])
  expect(util.enumValues(testEnum)).toStrictEqual([0, 1])
  expect(util.enumValueFromKey(testEnum, 'Bar')).toBe(1)
  expect(util.enumKeyFromValue(testEnum, 1)).toBe('Bar')
  expect(util.enumValuesFromKeys(testEnum, ['Foo', 'Bar'])).toStrictEqual([0, 1])
})

test('paramins', () => {
  const paraminValue = `howdy this is a paramater value on a url that we're going to gzip and encode`
  const paramin = `DcpBCsAgDETRq8yu5xqaoIJNJI2V9vQV_urxqy95kbXd2BGDwYupgYd9Ktw2zuh7YWLpEYrizQrSUb42QBOonS76Aw`

  expect(util.valueToParamin(paraminValue)).toBe(paramin)
  expect(util.paraminToValue(paramin)).toBe(paraminValue)
})
