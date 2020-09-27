//index.test.ts
/// <reference types="jest" />

import * as mt from '../src/index'
import { jsonFromFile } from '@ultrabis/util'
import { DB } from '@ultrabis/db'

test('test case 1: query item by id (normal item)', () => {
  expect(jsonFromFile(`./__tests__/test-case-1.json`)).toStrictEqual(
    mt.queryItem(DB.item, DB.itemSuffix, { id: 19379 })
  )
})

test('test case 2: query item by id (base item)', () => {
  expect(jsonFromFile(`./__tests__/test-case-2.json`)).toStrictEqual(
    mt.queryItem(DB.item, DB.itemSuffix, { id: 10250 })
  )
})

test('test case 3: query item by id and suffixId', () => {
  expect(jsonFromFile(`./__tests__/test-case-3.json`)).toStrictEqual(
    mt.queryItem(DB.item, DB.itemSuffix, { id: 10250, suffixId: 1825 })
  )
})

test('test case 4: query item by name (normal item)', () => {
  expect(jsonFromFile(`./__tests__/test-case-4.json`)).toStrictEqual(
    mt.queryItem(DB.item, DB.itemSuffix, { name: 'neltharions tear' })
  )
})

test('test case 5: query item by name (random enchant item)', () => {
  expect(jsonFromFile(`./__tests__/test-case-5.json`)).toStrictEqual(
    mt.queryItem(DB.item, DB.itemSuffix, { name: 'masters hat of arcane wrath' })
  )
})

test('test case 6: query item by name (base item)', () => {
  expect(jsonFromFile(`./__tests__/test-case-6.json`)).toStrictEqual(
    mt.queryItem(DB.item, DB.itemSuffix, { name: 'masters hat' })
  )
})
