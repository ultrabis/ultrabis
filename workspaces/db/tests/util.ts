import * as util from '@ultrabis/util'

const testString = `Master's Hat of Arcane Wrath`

console.log(`fuzzifyString(\`${testString}\`) = '${util.fuzzifyString(testString)}'`)
console.log(`dashifyString(\`${testString}\`) = '${util.dashifyString(testString)}'`)

console.log(
  `fuzzyIncludes(\`${testString}\`, 'masters hat') = ` +
    `${util.fuzzyIncludes(testString, 'masters hat')}`
)
