import { DB } from '@ultrabis/wow-db'
import { jsonToFile } from '@ultrabis/util'
import { queryItem } from '../src'

console.log(`test case 1: query item by id (normal item)`)
jsonToFile(`./__tests__/test-case-1.json`,
    queryItem(DB.item, DB.itemSuffix, { id: 19379 }))

console.log(`test case 2: query item by id (base item)`)
jsonToFile(`./__tests__/test-case-2.json`,
    queryItem(DB.item, DB.itemSuffix, { id: 10250 }))

console.log(`test case 3: query item by id and suffixId`)
jsonToFile(`./__tests__/test-case-3.json`,
    queryItem(DB.item, DB.itemSuffix, { id: 10250, suffixId: 1825 }))

console.log(`test case 4: query item by name (normal item)`)
jsonToFile(`./__tests__/test-case-4.json`,
    queryItem(DB.item, DB.itemSuffix, { name: 'neltharions tear' }))

console.log(`test case 5: query item by name (random enchant)`)
jsonToFile(`./__tests__/test-case-5.json`,
    queryItem(DB.item, DB.itemSuffix, { name: 'masters hat of arcane wrath' }))

console.log(`test case 6: query item by name (base item)`)
jsonToFile(`./__tests__/test-case-6.json`,
    queryItem(DB.item, DB.itemSuffix, { name: 'masters hat' }))
