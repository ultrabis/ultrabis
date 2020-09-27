import { wowheadDownloadItems, wowheadDownloadAbilities } from './common'

const main = async (): Promise<void> => {
  await wowheadDownloadItems()
  await wowheadDownloadAbilities()
}

main()
