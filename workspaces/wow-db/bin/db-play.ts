/* Just a dumb playground for testing changes. Sometimes it's hard due to
 * length of time to build database proper */

import { wowheadParseItem } from './common'
import { DBFull as DB } from '../src'

const main = async (): Promise<void> => {
  const x = await wowheadParseItem(16830, 'Cenarion Bracers', DB.itemSuffix)
  console.log(x)
}

main()
