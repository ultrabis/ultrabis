/**
 * common db creation stuff on the node side
 */

import cheerio from 'cheerio'
import request from 'requestretry'
import plimit from 'p-limit'
import csv from 'csvtojson'

import {
  dashifyString,
  enumValueFromKey,
  bitmaskFromValues,
  stringFromFile,
  stringToFile,
  stringFromGzipFile,
  jsonFromFile,
  jsonToFile,
  removeFile,
  fileExists,
  download
} from '@ultrabis/util'

import {
  ItemSuffixType,
  CreatureType,
  itemBaseName,
  itemSuffixTypeFromName,
  pvpRankFromText,
  classesMaskFromText
} from '@ultrabis/wow-common'

import { ItemRecord, ItemSuffixRecord, ItemListRecord, itemRecordAffix } from '../src'

interface WowheadItemParserResult {
  item: ItemRecord
  randomEnchants: ItemRecord[]
  suffixes: ItemSuffixRecord[]
}

const xmlOutputDir = 'cache/items'
const iconOutputDir = 'cache/icons'
const masterItemListFile = `src/master/itemList.json`
const masterAbilityFile = `src/master/ability.json`
const masterItemSuffixFile = `src/master/itemSuffix.json`
const zoneFile = `src/master/zone.json`

export const hrTimeToSeconds = (hrtime: any): any => {
  return (hrtime[0] + hrtime[1] / 1e9).toFixed(3)
}

export const secondsToPretty = (seconds: number): string => {
  seconds = Number(seconds)
  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)

  const dDisplay = d > 0 ? d + (d == 1 ? ' day, ' : ' days, ') : ''
  const hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : ''
  const mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : ''
  const sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : ''
  return dDisplay + hDisplay + mDisplay + sDisplay
}

export const zsum = (one: number | undefined, two: number | undefined): number | undefined => {
  const val = (one ? one : 0) + (two ? two : 0)
  return val ? val : undefined
}

// number to number. if value is undefined, null, or NaN return undefined
// optionally return undefined for 0 value
export const itoi = (value: number | null | undefined, noZeros?: boolean): number | undefined => {
  if (value === undefined || value === null || value === NaN || (noZeros && value === 0)) {
    return undefined
  }

  return value
}

// string to number. if value is undefined, null, or NaN return undefined
// optionally return undefined for 0 value
export const atoi = (value: string | undefined, noZeros?: boolean): number | undefined => {
  if (value === undefined || value === null) {
    return undefined
  }

  return itoi(Number(value), noZeros)
}

// string to string. if value is undefined, null, or empty return undefined
export const atoa = (value: string | undefined): string | undefined => {
  if (value === undefined || value === null || value.length === 0) {
    return undefined
  }
  return value
}

// bool to bool. false is undefined
export const btob = (value: boolean): boolean | undefined => {
  return value ? value : undefined
}

export const stringFromComment = (haystack: string, commentName: string): string => {
  const comment = `<!--${commentName}-->`
  const n = haystack.search(comment) + comment.length
  const x = haystack.substr(n)
  const n2 = x.search('<')
  return x.substr(0, n2)
}

/**
 *
 * convert itemName to the format wowhead uses on url
 *
 * @param itemName
 */
export const wowheadItemName = (itemName: string): string => {
  return dashifyString(itemBaseName(itemName))
}

/*
export const zoneRecordFromId = (id: number): ZoneRecord | undefined => {
  const zoneRecord = jsonFromFile(zoneFile).find((zoneRecord: ZoneRecord) => {
    return zoneRecord.id === id
  })
  return zoneRecord
}
*/

/**
 *
 * read itemList file and return the itemName based on itemId
 *
 * @param itemId
 */
export const itemNameFromId = (itemId: number): string => {
  const masterList = jsonFromFile(masterItemListFile)
  const itemCount = masterList.length
  for (let i = 0; i < itemCount; i++) {
    const item = masterList[i]
    if (item.id === itemId) {
      return item.name
    }
  }

  return ``
}

/**
 *
 * read XML file and return the icon name.
 * we need the icon name during downloading and don't want to parse the entire thing
 *
 * @param itemId
 * @param _itemName
 */
export const itemIconFromXML = (itemId: number, _itemName?: string): string => {
  const itemName = _itemName ? _itemName : itemNameFromId(itemId)
  const filePath = `${xmlOutputDir}/${itemId}-${wowheadItemName(itemName)}.xml.gz`
  const xmlString = stringFromGzipFile(filePath)

  const $ = cheerio.load(xmlString, { xmlMode: true })
  return $('icon').text()
}

// download icon. must have xml downloaded.
export const wowheadDownloadIcon = async (itemId: number, _itemName?: string): Promise<unknown> => {
  const iconName = itemIconFromXML(itemId, _itemName)
  const filePath = `${iconOutputDir}/${iconName.toLowerCase()}.jpg`
  const url = `https://wow.zamimg.com/images/wow/icons/large/${iconName.toLowerCase()}.jpg`
  return download(url, filePath, { unzip: true })
}

export const wowheadDownloadHTML = async (itemId: number, _itemName?: string): Promise<unknown> => {
  const itemName = _itemName ? _itemName : itemNameFromId(itemId)
  const filePath = `${xmlOutputDir}/${itemId}-${wowheadItemName(itemName)}.html.gz`
  const url = `https://classic.wowhead.com/item=${itemId}`
  return download(url, filePath, { unzip: false })
}

export const wowheadDownloadXML = async (itemId: number, _itemName?: string): Promise<unknown> => {
  const itemName = _itemName ? _itemName : itemNameFromId(itemId)
  const filePath = `${xmlOutputDir}/${itemId}-${wowheadItemName(itemName)}.xml.gz`
  const url = `https://classic.wowhead.com/item=${itemId}&xml`
  return download(url, filePath, { unzip: false })
}

/**
 * download all item id's / names from wowhead
 *
 * @param outputPath write to file
 */
export const wowheadDownloadMasterItemList = async (outputPath: string): Promise<void> => {
  if (!fileExists(outputPath)) {
    jsonToFile(outputPath, await wowheadScrapeItemList())
  }
}

/**
 * download all ability names/ids from wowhead
 *
 * @param outputPath write to file
 */
export const wowheadDownloadMasterAbility = async (outputPath: string): Promise<void> => {
  /* if file already exists, no work to do */
  if (fileExists(outputPath)) {
    return
  }

  const abilities = [] as object[]
  const stepSize = 1000
  const maxSize = 31100

  for (let i = 0; i < maxSize; i += stepSize) {
    const url = `https://classic.wowhead.com/abilities?filter=14:14;2:5;${i}:${i + stepSize}`
    console.log(`doing ${i} of ${maxSize}: ${url}`)
    const req = await request({
      url: url,
      json: true
    })

    const $ = cheerio.load(req.body)
    const scriptDatas = $('script[type="text/javascript"]')[1]?.children[0].data?.split('\n')
    if (scriptDatas === undefined) {
      continue
    }

    const scriptData = scriptDatas.filter((text) => text.includes('listviewspells'))[0]
    const rawListData = scriptData
      .substring(scriptData.indexOf('['), scriptData.indexOf(';'))
      .replace(/popularity/g, '"popularity"')
    const listData = JSON.parse(rawListData)

    for (let x = 0; x < listData.length; x++) {
      abilities.push({
        id: listData[x].id,
        name: listData[x].name,
        rank: listData[x].rank ? Number(listData[x].rank.replace('Rank ', '')) : 0,
        level: listData[x].level,
        class: listData[x].chrclass,
        school: listData[x].schools
      })
    }
  }

  jsonToFile(outputPath, abilities)
}

/**
 * returns object of all wowhead item id's.
 *
 * borrowed from: https://github.com/nexus-devs/wow-classic-items
 */
export const wowheadScrapeItemList = async (): Promise<object[]> => {
  const items = [] as object[]

  // Filter the items by ID (total ID range about 24000).
  const stepSize = 500 // Wowhead can only show about 500 items per page.
  const maxSize = 24500
  for (let i = 0; i < maxSize; i += stepSize) {
    // const url = `https://classic.wowhead.com/items?filter=162:151:151:195;2:2:5:1;0:${i}:${i + stepSize}`
    const url = `https://classic.wowhead.com/items?filter=162:151:151;2:2:5;0:${i}:${i + stepSize}`
    console.log(`doing ${i} of ${maxSize}: ${url}`)
    const req = await request({
      url: url,
      json: true
    })

    // Wowhead uses JavaScript to load in their table content, so we'd need something like Selenium to get the HTML.
    // However, that is really painful and slow. Fortunately, with some parsing the table content is available in the source code.
    const $ = cheerio.load(req.body)
    const tableContentRaw = $('script[type="text/javascript"]')
      .get()[0]
      .children[0].data.split('\n')[1]
      .slice(26, -2)
    const tableContent = JSON.parse(tableContentRaw)

    for (const key of Object.keys(tableContent)) {
      const item = tableContent[key]
      if (!item.jsonequip.slotbak) {
        console.log(`skipping ${item.name_enus}...not equippable`)
        continue
      }
      items.push({
        id: parseInt(key),
        name: item.name_enus
      })
    }
  }

  return items
}

/**
 *
 * Downloads / caches everything we need from wowhead for `abilities`
 *
 */
export const wowheadDownloadAbilities = async (): Promise<void> => {
  await wowheadDownloadMasterAbility(masterAbilityFile)

  // read in abilityList
  const masterAbilities = jsonFromFile(masterAbilityFile)
  const abilityCount = masterAbilities.length

  // iterate itemList and download XML, HTML, and icon for each item
  console.log(`Processing ${abilityCount} abilities...`)
}

/**
 *
 * Downloads / caches everything we need from wowhead for `items`
 *
 */
export const wowheadDownloadItems = async (): Promise<void> => {
  // download list of items if necessary
  await wowheadDownloadMasterItemList(masterItemListFile)

  // read in itemList
  const masterList = jsonFromFile(masterItemListFile)
  const itemCount = masterList.length

  // iterate itemList and download XML, HTML, and icon for each item
  console.log(`Processing ${itemCount} items...`)
  for (let i = 0; i < itemCount; i++) {
    const item = masterList[i]
    //console.log(`- ${item.name} (${item.id})`)
    await wowheadDownloadXML(item.id, item.name)
    await wowheadDownloadHTML(item.id, item.name)
    await wowheadDownloadIcon(item.id, item.name)
  }
}
/*
  dropChance?: number
  faction?: number
}
*/

export const getItemSuffixesFromItemName = (
  ItemSuffixRecordArray: ItemSuffixRecord[],
  itemName: string
): ItemSuffixRecord[] => {
  const suffixType = itemSuffixTypeFromName(itemName)
  const itemSuffixes: ItemSuffixRecord[] = []

  for (let i = 0; i < ItemSuffixRecordArray.length; i++) {
    if (ItemSuffixRecordArray[i].type === suffixType) {
      itemSuffixes.push(ItemSuffixRecordArray[i])
    }
  }

  return itemSuffixes
}

export const getItemSuffixFromItemNameAndValues = (
  ItemSuffixRecordArray: ItemSuffixRecord[],
  itemName: string,
  values: [number, number]
): ItemSuffixRecord | undefined => {
  const itemSuffixes = getItemSuffixesFromItemName(ItemSuffixRecordArray, itemName)

  for (let i = 0; i < itemSuffixes.length; i++) {
    const itemSuffix = itemSuffixes[i]
    const suffixValues = [
      itemSuffix.bonus[0] ? itemSuffix.bonus[0].value : 0,
      itemSuffix.bonus[1] ? itemSuffix.bonus[1].value : 0
    ]

    // special handle for looking up suffix with only one value
    // we might need this on spreadsheets
    if (values[1] == -1) {
      // console.log(`hello ${values[0]} vs ${suffixValues[0]}`)
      if (values[0] === suffixValues[0]) {
        return itemSuffix
      }
    }

    //console.log(`values: ${values}`)
    //console.log(`suffixValues: ${suffixValues}`)
    if (values[0] === suffixValues[0] && values[1] === suffixValues[1]) {
      return itemSuffix
    }
  }

  return undefined
}

export const getItemSuffix = (
  ItemSuffixRecordArray: ItemSuffixRecord[],
  suffixId: number
): ItemSuffixRecord | undefined => {
  const suffixCount = ItemSuffixRecordArray.length

  for (let i = 0; i < suffixCount; i++) {
    if (ItemSuffixRecordArray[i].id === suffixId) {
      return ItemSuffixRecordArray[i]
    }
  }

  return undefined
}

export const wowheadParseBonusValues = (bonusText: string): [number, number] => {
  let bonusValue1 = 0
  let bonusValue2 = 0

  if (bonusText.includes('(')) {
    const bonuses = bonusText
      .replace(/.*\(|\).*/g, '')
      .replace(/ /g, '')
      .replace(/%/g, '')
      .split('-')
    bonusValue1 = Number(bonuses[0])
    bonusValue2 = Number(bonuses[1])
  } else {
    bonusValue1 = Number(bonusText.split(' ')[0].replace(/\+/g, '').replace(/%/g, ''))
  }

  return [bonusValue1, bonusValue2]
}

export const wowheadParseItem = async (
  itemId: number,
  itemName: string,
  suffixes: ItemSuffixRecord[],
  opts?: { validSuffixTypes?: number[] }
): Promise<WowheadItemParserResult> => {
  const output: WowheadItemParserResult = {} as WowheadItemParserResult

  const baseFilePath = `${xmlOutputDir}/${itemId}-${wowheadItemName(itemName)}`
  const dataStrings = await Promise.all([
    stringFromGzipFile(`${baseFilePath}.xml.gz`),
    stringFromGzipFile(`${baseFilePath}.html.gz`),
    stringFromFile(`src/custom/overrides/${itemId}.json`)
  ])

  const xml = dataStrings[0]
  const html = dataStrings[1]
  const override: ItemRecord | undefined =
    dataStrings[2] !== `` ? JSON.parse(dataStrings[2]) : undefined

  const itemRecord = {} as ItemRecord
  itemRecord.id = itemId

  // parse xml
  const xml$ = cheerio.load(xml, { xmlMode: true })
  const jsonEquipText = xml$('jsonEquip').text()
  const jsonEquip = JSON.parse(`{ ${jsonEquipText} }`)
  itemRecord.name = xml$('name').text()
  itemRecord.slot = Number(xml$('inventorySlot').attr('id'))
  if (itemRecord.slot === NaN) {
    console.warn('WARNING: Invalid slot')
  }
  itemRecord.icon = xml$('icon').text()
  itemRecord.class = atoi(xml$('class').attr('id'))
  itemRecord.subclass = atoi(xml$('subclass').attr('id'))
  itemRecord.level = atoi(xml$('level').attr('id'))
  itemRecord.quality = atoi(xml$('quality').attr('id'))

  // parse xml jsonEquip object
  itemRecord.reqLevel = itoi(jsonEquip.reqlevel, true)
  itemRecord.durability = itoi(jsonEquip.dura, true)

  itemRecord.strength = itoi(jsonEquip.str, true)
  itemRecord.agility = itoi(jsonEquip.agi, true)
  itemRecord.stamina = itoi(jsonEquip.sta, true)
  itemRecord.intellect = itoi(jsonEquip.int, true)
  itemRecord.spirit = itoi(jsonEquip.spi, true)
  itemRecord.hp5 = itoi(jsonEquip.healthrgn, true)
  itemRecord.mp5 = itoi(jsonEquip.manargn, true)

  itemRecord.armor = itoi(jsonEquip.armor, true)
  itemRecord.defense = itoi(jsonEquip.def, true)
  itemRecord.dodge = itoi(jsonEquip.dodgepct, true)
  itemRecord.parry = itoi(jsonEquip.parrypct, true)
  itemRecord.blockChance = itoi(jsonEquip.blockpct, true)
  itemRecord.blockValue = itoi(jsonEquip.blockamount, true)

  itemRecord.meleeHit = itoi(jsonEquip.mlehitpct, true)
  itemRecord.rangedHit = itoi(jsonEquip.rgdhitpct, true)
  itemRecord.spellHit = itoi(jsonEquip.splhitpct, true)
  itemRecord.meleeCrit = itoi(jsonEquip.mlecritstrkpct, true)
  itemRecord.rangedCrit = itoi(jsonEquip.rgdcritstrkpct, true)
  itemRecord.spellCrit = itoi(jsonEquip.splcritstrkpct, true)
  itemRecord.attackPower = itoi(jsonEquip.atkpwr, true)
  itemRecord.feralAttackPower = itoi(jsonEquip.feratkpwr, true)
  itemRecord.meleeAttackPower = itoi(jsonEquip.mleatkpwr, true)
  itemRecord.rangedAttackPower = itoi(jsonEquip.rgdatkpwr)
  itemRecord.spellPenetration = itoi(jsonEquip.splpen, true)
  itemRecord.spellHealing = itoi(jsonEquip.splheal, true)
  itemRecord.spellDamage = itoi(jsonEquip.splpwr, true)
  itemRecord.arcaneDamage = itoi(jsonEquip.arcsplpwr, true)
  itemRecord.fireDamage = itoi(jsonEquip.firsplpwr, true)
  itemRecord.frostDamage = itoi(jsonEquip.frosplpwr, true)
  itemRecord.natureDamage = itoi(jsonEquip.natsplpwr, true)
  itemRecord.shadowDamage = itoi(jsonEquip.shasplpwr, true)
  itemRecord.holyDamage = itoi(jsonEquip.holsplpwr, true)

  itemRecord.rangedDps = itoi(jsonEquip.rgddps, true)
  itemRecord.meleeDps = itoi(jsonEquip.mledps, true)
  itemRecord.rangedSpeed = itoi(jsonEquip.rgdspeed, true)
  itemRecord.meleeSpeed = itoi(jsonEquip.mlespeed, true)
  itemRecord.rangedMinDmg = itoi(jsonEquip.rgddmgmin, true)
  itemRecord.meleeMinDmg = itoi(jsonEquip.mledmgmin, true)
  itemRecord.rangedMaxDmg = itoi(jsonEquip.rgddmgmax, true)
  itemRecord.meleeMaxDmg = itoi(jsonEquip.mledmgmax, true)

  itemRecord.arcaneResistance = itoi(jsonEquip.arcres, true)
  itemRecord.fireResistance = itoi(jsonEquip.firres, true)
  itemRecord.frostResistance = itoi(jsonEquip.frores, true)
  itemRecord.natureResistance = itoi(jsonEquip.natres, true)
  itemRecord.shadowResistance = itoi(jsonEquip.shares, true)

  // parse xml tooltip
  const ttText = xml$('htmlTooltip').text()
  const isRandomEnchant = ttText.includes('Random enchant')
  itemRecord.unique = btob(ttText.includes(`>Unique<`))
  itemRecord.bop = btob(stringFromComment(ttText, 'bo') === `Binds when picked up`)
  if (ttText.includes('Undead and Demons')) {
    itemRecord.targets = bitmaskFromValues(
      [CreatureType.Undead, CreatureType.Demon],
      true
    ).toString()
  } else if (ttText.includes('Increases damage done to Undead')) {
    itemRecord.targets = bitmaskFromValues([CreatureType.Undead], true).toString()
  }
  const tt = cheerio.load(ttText, { xmlMode: true })
  const droppedBy = tt('.whtt-droppedby').text()
  if (droppedBy && droppedBy.length > 0) {
    const n = droppedBy.search(':')
    itemRecord.droppedBy = droppedBy.substr(n + 2)
  }
  const classes = tt('.wowhead-tooltip-item-classes').text()
  if (classes && classes.length > 0) {
    itemRecord.classes = classesMaskFromText(classes).toString()
  }
  tt('span').each(function (i: number, elem: any) {
    const text = tt(elem).text()
    if (text[0] === `"` && text[text.length - 1] === `"`) {
      itemRecord.flavor = text
    }
  })
  const iconHorde = atoa(tt('.icon-horde').text())
  const iconAlliance = atoa(tt('.icon-alliance').text())
  if (iconHorde) {
    itemRecord.pvpRank = pvpRankFromText(iconHorde)
  } else if (iconAlliance) {
    itemRecord.pvpRank = pvpRankFromText(iconAlliance)
  }

  // parse xml json object
  const jsonText = xml$('json').text()
  const json = JSON.parse(`{ ${jsonText} }`)
  if (json.sourcemore && json.sourcemore[0] && json.sourcemore[0].z) {
    itemRecord.droppedAt = json.sourcemore[0].z
  }

  // parse html
  const html$ = cheerio.load(html)
  const n = html.search('WH.markup.printHtml')
  const x = html.substr(n)
  const n2 = x.search('Added in content phase')

  // just ignore phase if it's 1, null, etc.
  // we'll save space by assuming undefined is phase 1 on read
  const phase = Number(x.substr(n2 + 23, 1))
  if (phase && phase !== null && phase !== NaN && phase > 1) {
    itemRecord.phase = phase
  }

  // faction requirement...grr
  //const listView = $('script[type="text/javascript"]').get()[0].children[0].data.split('\n')[1].slice(26, -2)
  //const listView = html$('script[type="text/javascript"]').get()[5].children[0].data
  // console.log(listView)
  //const react = listView.substr(listView.search(`"react":`))
  //const reactArray = JSON.parse(react.substr(0, react.search(`,"`)).split(`:`)[1])
  // console.log(reactArray)
  //.children[0].data.split('\n')[1].slice(26, -2)

  // for random enchants we need to generate a 'validSuffixIds' array
  if (isRandomEnchant) {
    const div = html$('div[class=random-enchantments]')
    const ul = html$('ul')
    const root = html$(div).text() !== `` ? div : ul
    const validSuffixIds: number[] = []

    html$(root)
      .find('li')
      .find('div')
      .each(function (i: number, elem: any) {
        let bonusText
        const span = html$(elem).find('span')
        const small = html$(elem).find('small')

        // the suffix type e.g. "of the Bear"
        const suffixTypeText = html$(span).text().replace(/\./g, '')

        // drop chance of each individual suffix. just ignore it.
        //const dropChance = html$(small).text()
        //console.log(`dropChance: ${dropChance}`)
        //ItemRecord.dropChance = atoi(html$(small).text(), true)

        // rip out junk so we can grab bonus text
        html$(span).remove()
        html$(small).remove()
        html$(elem).find('br').remove()

        // e.g. +1% Dodge , +(5 - 7) Agility
        //
        // - some enchants have up to two bonuses (seperated by ,)
        // - some enchants have multiple suffixId's (denoted in parens)
        //
        // we want to get the text with parens, if it exists
        const bonusTextBase = html$(elem).text().trim().split(',')
        const bonusTextOne = bonusTextBase[0].trim()
        const bonusTextTwo = bonusTextBase[1] ? bonusTextBase[1].trim() : ''
        const bonusValuesOne = wowheadParseBonusValues(bonusTextOne)
        const bonusValuesTwo = wowheadParseBonusValues(bonusTextTwo)
        const bonusValuesX: [number, number] = [bonusValuesOne[0], bonusValuesTwo[0]]
        const bonusValuesY: [number, number] = [
          !bonusValuesOne[1] && bonusValuesTwo[1] ? bonusValuesOne[0] : bonusValuesOne[1],
          bonusValuesTwo[1]
        ]

        /*
        console.log(`bonusTextBase: ${bonusTextBase}`)
        console.log(`bonusValuesOne: ${bonusValuesOne}`)
        console.log(`bonusValuesTwo: ${bonusValuesTwo}`)
        console.log(`bonusValuesX: ${bonusValuesX}`)
        console.log(`bonusValuesY: ${bonusValuesY}`)
        */

        let itemSuffix

        itemSuffix = getItemSuffixFromItemNameAndValues(
          suffixes,
          `x ${suffixTypeText}`,
          bonusValuesX
        )
        if (itemSuffix) {
          if (!opts || !opts.validSuffixTypes || opts.validSuffixTypes.includes(itemSuffix.type)) {
            validSuffixIds.push(itemSuffix.id)
          }
        }

        itemSuffix = getItemSuffixFromItemNameAndValues(
          suffixes,
          `x ${suffixTypeText}`,
          bonusValuesY
        )
        if (itemSuffix) {
          if (!opts || !opts.validSuffixTypes || opts.validSuffixTypes.includes(itemSuffix.type)) {
            validSuffixIds.push(itemSuffix.id)
          }
        }
      })
    if (validSuffixIds.length > 0) {
      itemRecord.validSuffixIds = validSuffixIds
    }
  }

  // copy item as is to output
  output.item = itemRecord

  // now generate each random enchant
  if (itemRecord.validSuffixIds && itemRecord.validSuffixIds.length > 0) {
    output.randomEnchants = []
    output.suffixes = []
    for (let i = 0; i < itemRecord.validSuffixIds.length; i++) {
      const suffixId = itemRecord.validSuffixIds[i]
      const ItemSuffixRecord = getItemSuffix(suffixes, suffixId)
      if (ItemSuffixRecord) {
        output.randomEnchants.push(itemRecordAffix(itemRecord, ItemSuffixRecord))
        output.suffixes.push(ItemSuffixRecord)
      }
    }
  }

  if (override) {
    Object.assign(itemRecord, override)
  }

  return output
}

export const wowheadParseItems = async (
  itemListFile: string,
  opts?: { validSuffixTypes?: number[] }
): Promise<WowheadItemParserResult[]> => {
  const limit = plimit(10)
  const parsePromises: Promise<WowheadItemParserResult>[] = []

  const itemList = jsonFromFile(itemListFile)
  const itemSuffixes: ItemSuffixRecord[] = jsonFromFile(masterItemSuffixFile)
  for (let i = 0; i < itemList.length; i++) {
    parsePromises.push(
      limit(() => wowheadParseItem(itemList[i].id, itemList[i].name, itemSuffixes, opts))
    )
  }

  return Promise.all(parsePromises)
}

export const wowheadWriteItems = async (
  parseResults: WowheadItemParserResult[],
  itemFile: string,
  itemStaticFile: string,
  itemSuffixFile: string
): Promise<void> => {
  const itemsStatic: ItemRecord[] = []
  const items: ItemRecord[] = []
  const itemsRandom: ItemRecord[] = []
  const itemSuffixSet: Set<ItemSuffixRecord> = new Set()

  for (let i = 0; i < parseResults.length; i++) {
    const parsedItem = parseResults[i]

    // add suffixes to set to remove duplicates
    if (parsedItem.suffixes && parsedItem.suffixes.length > 0) {
      for (let x = 0; x < parsedItem.suffixes.length; x++) {
        itemSuffixSet.add(parsedItem.suffixes[x])
      }
    }

    // the item db (a.k.a dynamic item db) only stores the 'base item' for
    // random enchants (e.g. Master's Hat).
    items.push(parsedItem.item)

    // the static version stores all random enchant items, excluding the
    // base items
    if (!parsedItem.item.validSuffixIds) {
      itemsStatic.push(parsedItem.item)
    }
    itemsStatic.push(...parsedItem.randomEnchants)

    // also write an item db with *only* the random enchants.
    // just for fun.
    itemsRandom.push(...parsedItem.randomEnchants)
  }

  console.log(`writing item db: ${items.length}`)
  jsonToFile(itemFile, items)

  console.log(`writing static item db: ${itemsStatic.length}`)
  jsonToFile(itemStaticFile, itemsStatic)

  //console.log(`writing random enchant item db: ${itemsRandom.length}`)
  //jsonToFile(itemRandomFile, itemsRandom)

  console.log(`writing itemSuffix db: ${itemSuffixSet.size}`)
  jsonToFile(itemSuffixFile, Array.from(itemSuffixSet))
}

export const createDB = async (dbName: string, validSuffixTypes?: number[]): Promise<void> => {
  // full can just read the master item list, which is already in JSON
  if (dbName === 'full') {
    return await _createDB('full', masterItemListFile, { validSuffixTypes: validSuffixTypes })
  }

  // all other DB's need to convert a text file to JSON
  const itemListTXTFile = `src/custom/${dbName}/itemList.txt`
  const itemListJSONFile = `src/custom/${dbName}/itemList.json`
  jsonToFile(itemListJSONFile, await parseTXT(itemListTXTFile))
  return await _createDB(dbName, itemListJSONFile, { validSuffixTypes: validSuffixTypes })
}

const _createDB = async (
  dbName: string,
  itemListFile: string,
  opts?: { validSuffixTypes?: number[] }
): Promise<void> => {
  // parse items
  console.log(`parsing items from ${itemListFile}`)
  const startTime = process.hrtime()
  const items = await wowheadParseItems(itemListFile, opts)

  // write db
  console.log(`writing files to src/custom/${dbName}`)
  await wowheadWriteItems(
    items,
    `src/custom/${dbName}/item.json`,
    `src/custom/${dbName}/item-static.json`,
    `src/custom/${dbName}/itemSuffix.json`
  )

  const elapsedTime = hrTimeToSeconds(process.hrtime(startTime))
  console.log(`spent ${secondsToPretty(elapsedTime)} creating databases`)
}

export const parseTXT = async (txtFilePath: string): Promise<ItemListRecord[]> => {
  const results: ItemListRecord[] = []
  const itemNameSet: Set<string> = new Set()

  const txtArray = stringFromFile(txtFilePath).toString().split('\n')
  for (let i = 0; i < txtArray.length; i++) {
    const itemName = itemBaseName(txtArray[i])
    if (itemName !== '') {
      itemNameSet.add(itemName)
    }
  }

  // loop the unique set of item names, grab id and stuff in result array
  // there are duplicate items...this will include ALL that match
  const itemList = jsonFromFile(masterItemListFile)
  const itemNameArray = Array.from(itemNameSet)
  for (let i = 0; i < itemNameArray.length; i++) {
    const itemName = itemNameArray[i]
    let itemFound = false
    for (let i = 0; i < itemList.length; i++) {
      const item = itemList[i]
      if (item.name.toLowerCase() === itemName.toLowerCase()) {
        results.push({ id: item.id, name: itemName })
        itemFound = true
      }
    }
    if (!itemFound) {
      console.log(`WARNING: Couldn't find item name "${itemName}"`)
    }
  }

  return results
}

export const parseCSV = async (
  csvFilePath: string,
  itemNameKey: string
): Promise<ItemListRecord[]> => {
  const results: ItemListRecord[] = []
  const itemNameSet: Set<string> = new Set()

  const itemList = jsonFromFile(masterItemListFile)
  const csvArray = await csv().fromFile(csvFilePath)

  for (const csvRecord of csvArray) {
    const itemName = itemBaseName(csvRecord[itemNameKey])
    if (itemName !== '') {
      itemNameSet.add(itemName)
    }
  }

  // loop the unique set of item names, grab id and stuff in result array
  // there are duplicate items...this will include ALL that match
  const itemNameArray = Array.from(itemNameSet)
  for (let i = 0; i < itemNameArray.length; i++) {
    const itemName = itemNameArray[i]
    for (let i = 0; i < itemList.length; i++) {
      const item = itemList[i]
      if (item.name === itemName) {
        results.push({ id: item.id, name: itemName })
      }
    }
  }

  return results
}
