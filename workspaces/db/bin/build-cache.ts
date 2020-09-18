import { wowheadDownloadItems, wowheadDownloadAbilities } from './common'
import { exit } from 'process'

const main = async () => {
  await wowheadDownloadItems()
  await wowheadDownloadAbilities()
}

main()
