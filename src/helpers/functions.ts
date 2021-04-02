import { ohlcData } from '../interfaces'

export function CalculateSMA(data_set: Array<ohlcData>, period: number) {
  let sum = 0.0
  let i = 0
  for (i; i < period && i < data_set.length; i++) {
    sum += data_set[i].c
  }
  return sum / i
}

export function CalculateEMA(data_set: Array<ohlcData>, period: number) {
  const sma = CalculateSMA(data_set, period)
  const factor = 2.0 /** Online Recomendation */
  const exponentional = factor / (period + 1)
  return (data_set[0].c * exponentional) + sma * (1 - exponentional)

}

export function CalculateVWMA(data_set: Array<ohlcData>, period: number) {
  let sum = 0.0
  let sumVolume = 0.0
  let i = 0

  for (i; i < period; i++) {
    sum += (data_set[i].c * data_set[i].v)
    sumVolume += data_set[i].v
  }
  return (sum / sumVolume)
}

export function CalculateWMA(data_set: Array<ohlcData>, period: number) {
  let sum = 0.0
  let i = 0
  for (i; i < period; i++) {
    sum += (data_set[i].c * (i + 1))
  }
  return (sum / ((period * (period + 1)) / 2))
}

export function CalculateWMAForHMA(data_set: Array<ohlcData>, period: number): Array<ohlcData> {
  let i = 0, wma1, wma2
  let wma_1_2 = []
  for (i; i < period; i++) {
    wma1 = 2 * CalculateWMA(data_set, Math.round((i + 1) / 2))
    wma2 = CalculateWMA(data_set, (i + 1))
    wma_1_2.push({ o: 0, h: 0, l: 0, c: wma1 - wma2, v: 0, date: '' })
  }
  return wma_1_2
}

export function CalculateHMA(data_set: Array<ohlcData>, period: number) {
  const wma_data_set = CalculateWMAForHMA(data_set, period)
  const hma = CalculateWMA(wma_data_set, Math.round(Math.sqrt(period)))
  return hma
}

export function CalculateMACD(data_set: Array<ohlcData>) {
  const ema_12 = CalculateEMA(data_set, 12)
  const ema_26 = CalculateEMA(data_set, 26)
  return ema_12 - ema_26
}

export function generateFastKDataSet(data_set: Array<ohlcData>, period: number): Array<ohlcData> {
  const lowest_set = []
  const low_set = data_set.map(x => x.l)
  for (let i = 0; i < period; i++) {
    let lowest = low_set[i]
    for (let j = (i + 1); j < period + (i + 1); j++) {
      if (lowest > low_set[j]) {
        lowest = low_set[j]
      }
    }
    lowest_set.push(lowest)
  }
  const highest_set = []
  const high_set = data_set.map(x => x.h)
  for (let i = 0; i < period; i++) {
    let highest = high_set[i]
    for (let j = (i + 1); j < period + (i + 1); j++) {
      if (highest < high_set[j]) {
        highest = high_set[j]
      }
    }
    highest_set.push(highest)
  }
  const new_data_set = []
  for (let i = 0; i < period; i++) {
    new_data_set.push({
      o: 0, h: 0, l: 0,
      c: (data_set[i].c - lowest_set[i]) * 100 / (highest_set[i] - lowest_set[i]), v: 0, date: ''
    })
  }
  return new_data_set
}
export function generateSlowKDataSet(data_set: Array<ohlcData>, period: number): Array<ohlcData> {
  const slowKDataSet = []
  for (let i = 0; i < period; i++) {
    let sum = 0.0
    for (let j = i; j < period + i; j++) {
      sum += data_set[j].c
    }
    slowKDataSet.push({
      o: 0, h: 0, l: 0,
      c: sum / period, v: 0, date: ''
    })
  }
  return slowKDataSet
}

export function CalculateStohastic(data_set: Array<ohlcData>, period1: number, period2: number, period3: number) {
  const fastKDataSet = generateFastKDataSet(data_set, period1)
  const slowKDataSet = generateSlowKDataSet(fastKDataSet, period2)
  const stohastic = CalculateSMA(slowKDataSet, period3)
  return stohastic
}

export function generateChangeDataSet(data_set: Array<ohlcData>, period: number) {
  let tempData = []
  for (let i = 0; i < period; i++) {
    tempData.push(data_set[i].c - data_set[i + 1].c)
  }
  return tempData
}
export function CalculateMean(data_set: Array<number>) {
  let sum = 0.0
  for (let i = 0; i < data_set.length; i++) {
    sum += data_set[i]
  }
  return sum / data_set.length
}

export function CalculateRSI(data_set: Array<ohlcData>, period: number) {
  const changeDataSet = generateChangeDataSet(data_set, period)
  const positiveSet = changeDataSet.filter(x => x > 0)
  const negativeSet = changeDataSet.filter(x => x < 0)
  const positiveMean = CalculateMean(positiveSet)
  const negativeMean = CalculateMean(negativeSet)
  const operands1 = (positiveMean * (period - 1)) + changeDataSet[0]
  const operands2 = -(negativeMean * (period - 1)) + changeDataSet[0]
  const operands3 = 1 + operands1 / operands2
  return 100 - (100 / operands3)
}

export function CalculateEMAofMACD(data_set: Array<ohlcData>, period: number) {
  const tempData: Array<ohlcData> = []
  for (let i = 0; i < period; i++) {
    tempData.push({
      o: 0, h: 0, l: 0,
      c: CalculateMACD(data_set.slice(i)), v: 0, date: ''
    })
  }
  const ema9 = CalculateEMA(tempData, 9)

  return ema9
}

export function CalculateTRA(data_set: Array<ohlcData>, period: number) {
  let sum = 0
  for (let i = 0; i < period; i++) {
    let method1 = data_set[i].h - data_set[i].l
    let method2 = Math.abs(data_set[i].h - data_set[i + 1].c)
    let method3 = Math.abs(data_set[i].l - data_set[i + 1].c)
    sum += Math.max(method1, method2, method3)
  }
  return sum / period
}