// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path="../../tsconfig/types/statsjs/index.d.ts" />

import stats from 'statsjs'
const mathjs = require('mathjs/dist/math')

/**
 *
 * Returns `num` as a rounded string
 *
 * @param num
 * @param decimals
 */
export const numberToRoundedString = (num: number, decimals: number): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 *
 * Returns triangular of `n`
 *
 * @param n
 */
export const triangularNumber = (n: number): number => {
  return (n * (n + 1)) / 2
}

/**
 *
 * Return probability of `chance` occuring at least `x` times out of `trials`.
 *
 * Example: With a crit chance of `chance`, what is the probablity of critting at least
 * `x` times out of `trials` casts.
 *
 *
 * @param trials Number of trials to run
 * @param chance chance of one occurance e.g. crit chance
 * @param x
 */
export const cumulativeChance = (trials: number, chance: number, x: number): number => {
  return 1 - stats.binomcdf(trials, chance, x)
}

/**
 *
 * Return probability of `chance` occuring at least `x` times *in a row* out of `trials`.
 *
 * Example: With a crit chance of `chance`, what is the probablity of hitting a streak of
 * `x` crits in a row in `trials` casts.
 *
 *
 * @param trials Number of trials to run
 * @param chance Chance of one occurance e.g. crit chance
 * @param x
 */
export const consecutiveChance = (trials: number, chance: number, x: number): number => {
  const sStart = mathjs.zeros([x + 1, x + 1])
  sStart[0][0] = 1

  const T = mathjs.zeros([x + 1, x + 1])
  for (let i = 0; i < x; i++) {
    T[0][i] = 1 - chance
    T[i + 1][i] = chance
  }

  T[x][x] = 1
  const sEnd = mathjs.multiply(mathjs.pow(T, trials), sStart)
  // @ts-ignore
  return sEnd.slice(-1)[0][0]
}
