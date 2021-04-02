import Axios from 'axios'
import { MessageEmbed } from 'discord.js'
import Moment from 'moment'

import { CalculateHMA, CalculateVWMA, CalculateRSI, CalculateStohastic, CalculateMACD, CalculateEMAofMACD, CalculateSMA, CalculateEMA, CalculateTRA } from '../../helpers'
import { ohlcData } from '../../interfaces'

async function getData(symbol:string, interval:string) {
  return await Axios.get('https://api.binance.cc/api/v1/klines', {
    params: {
      symbol: symbol.toUpperCase().replace('_', ''),
      interval: interval,
      limit: 200
    }
  })
}

export async function calculate(symbol: string, interval: string) {
  const data: Array<ohlcData> = []
  const data_set = (await getData(symbol, interval)).data
  data_set.forEach((x: Array<any>) => {
    let temp = x.slice(1)
    let [o, h, l, c, v, date] = temp
    data.push({
      o: parseFloat(o), h: parseFloat(h), l: parseFloat(l),
      c: parseFloat(c), v: parseFloat(v), date: Moment(date).format('YYYY-MM-DD HH:mm:ss')
    })
  })
  data.reverse()
  const hma9 = CalculateHMA(data, 9)
  const vwma20 = CalculateVWMA(data, 20)
  const rsi = CalculateRSI(data, 14)
  const stohastic = CalculateStohastic(data, 14, 3, 3)
  const macdLevel = CalculateMACD(data)
  const signal = CalculateEMAofMACD(data, 9)
  const sma20 = CalculateSMA(data, 20)
  const ema50 = CalculateEMA(data, 50)
  const sma50 = CalculateSMA(data, 50)
  const sma200 = CalculateSMA(data, 200)
  const tra14 = CalculateTRA(data, 14)
  let score = 0
  let message: string
  let title: string
  if (data[0].c >= data[0].o) {
    message = `Karena nilai close lebih besar dari nilai open maka akan dihitung score untuk buy`
    title = 'Buy Recomendation'
    /** Calculate Buy Score */
    score = data[0].c > data[1].h ? score + 30 : score
    score = data[0].c > hma9 ? score + 10 : score
    score = data[0].c > vwma20 ? score + 10 : score
    score = rsi > 30 && rsi < 70 ? score + 5 : score
    score = rsi <= 30 ? score + 10 : score
    score = stohastic > 20 && stohastic < 80 ? score + 5 : score
    score = stohastic <= 20 ? score + 10 : score
    score = macdLevel === signal ? score + 5 : score
    score = macdLevel > signal ? score + 10 : score
    score = data[0].c > sma20 ? score + 15 : score
    score = hma9 > sma20 ? score + 15 : score
    score = vwma20 > sma20 ? score + 15 : score
    score = data[0].c > ema50 ? score + 15 : score
    score = sma20 > ema50 ? score + 15 : score
    score = data[0].c > sma200 ? score + 15 : score
    score = sma50 > sma200 ? score + 15 : score
  } else {
    message = `Karena nilai close lebih kecil dari nilai open maka akan dihitung score untuk sell`
    title = 'Sell Recomendation'
    /** Calculate Sell Score */
    score = data[0].c < data[1].l ? score - 30 : score
    score = data[0].c < hma9 ? score - 10 : score
    score = data[0].c < vwma20 ? score - 10 : score
    score = rsi >= 70 ? score - 10 : score
    score = stohastic >= 80 ? score - 10 : score
    score = macdLevel < signal ? score - 10 : score
    score = data[0].c < sma20 ? score - 15 : score
    score = hma9 < sma20 ? score - 15 : score
    score = vwma20 < sma20 ? score - 15 : score
    score = data[0].c < ema50 ? score - 15 : score
    score = sma20 < ema50 ? score - 15 : score
    score = data[0].c < sma200 ? score - 15 : score
    score = sma50 < sma200 ? score - 15 : score
  }
  const response = new MessageEmbed()
    .setAuthor('Alif Robby Alcafi')
    .setTitle(title)
    .setDescription(`${message}
    Total Score = ${score}
    Target Profit 1 = ${data[0].c + tra14}
    Target Profit 2 = ${data[0].c + 2 * tra14}
    Stop Loss = ${data[0].c - tra14}`
    )
    .setFooter('Data provided by https://api.binance.cc')
  return response
}