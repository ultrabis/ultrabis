//index.test.ts
/// <reference types="jest" />

import * as util from '../src/index'

test('strings', () => {
  const testString = `'--..(!A:r%CanE W:rAth!)..--'`

  expect(util.fuzzifyString(testString)).toBe('arcanewrath')
  expect(util.dashifyString(testString)).toBe('arcane-wrath')
  expect(util.fuzzyIncludes(testString, 'arcane wrath')).toBe(true)
  expect(util.fuzzyEquals(testString, 'arcane wrath')).toBe(true)
})

enum testEnum {
  Foo,
  Bar
}

test('enums', () => {
  expect(util.enumKeys(testEnum)).toStrictEqual(['Foo', 'Bar'])
  expect(util.enumKeyFromValue(testEnum, 1)).toBe('Bar')
  expect(util.enumKeysFromValues(testEnum, [0, 1])).toStrictEqual(['Foo', 'Bar'])

  expect(util.enumValues(testEnum)).toStrictEqual([0, 1])
  expect(util.enumValueFromKey(testEnum, '!b:AR')).toBe(1)
  expect(util.enumValuesFromKeys(testEnum, ['f  OO', 'bA!!!!R'])).toStrictEqual([0, 1])
})

test('bitmasks', () => {
  const myBitmask = BigInt(3)

  /* check bitmask values...*/
  expect(util.bitmaskIncludes(myBitmask, testEnum.Foo, true)).toBe(true)
  expect(util.bitmaskIncludes(myBitmask, 6)).toBe(false)

  /* convert bitmask to... */
  expect(util.bitmaskToValues(myBitmask, true)).toStrictEqual([0, 1])
  expect(util.bitmaskToEnumValues(myBitmask, testEnum, true)).toStrictEqual([0, 1])
  expect(util.bitmaskToEnumKeys(myBitmask, testEnum, true)).toStrictEqual(['Foo', 'Bar'])

  /* create bitmask from... */
  expect(util.bitmaskFromValues([0, 1], true)).toStrictEqual(myBitmask)
  expect(util.bitmaskFromEnumKeys(testEnum, ['fOo', 'bAr'], true)).toStrictEqual(myBitmask)
})

test('math', () => {
  expect(util.triangularNumber(15)).toBe(120)
  expect(util.cumulativeChance(20, 32.87 / 100, 10)).toBe(0.034007510723832346)
  expect(util.consecutiveChance(20, 32.87 / 100, 10)).toBe(0.00011355868954693432)
})

test('paramins', () => {
  const paraminValue = `howdy this is a paramater value on a url that we're going to gzip and encode`
  const paramin = `DcpBCsAgDETRq8yu5xqaoIJNJI2V9vQV_urxqy95kbXd2BGDwYupgYd9Ktw2zuh7YWLpEYrizQrSUb42QBOonS76Aw`

  expect(util.paraminFromValue(paraminValue)).toBe(paramin)
  expect(util.paraminToValue(paramin)).toBe(paraminValue)
})

test('isEqual', () => {
  const obj1 = [ { foo: 1, bar: 'howdy' }, { foo: 2, bar: 'there' } ]
  const obj2 = [ { foo: 1, bar: 'howdy' }, { foo: 2, bar: 'there' } ]
  const obj3 = [ { foo: 2, bar: 'howdy' }, { foo: 3, bar: 'there' } ]

  expect(util.isEqual(obj1, obj2)).toBe(true)
  expect(util.isEqual(obj1, obj3)).toBe(false)
})
