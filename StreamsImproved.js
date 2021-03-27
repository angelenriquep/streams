'use strict'
const { Readable } = require('stream')

const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

// concatenate :: String -> String -> String
const concatenate = a => b => a.concat(b)

const Box = x =>
({
  map: f => Box(f(x)),
  fold: f => f(x),
  inspect: () => `Box(${x})`
})



const choices = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
const random = n => Math.floor(Math.random() * n)

const randomChar = str =>
  Box(str)
  .map(s => s.trim())
  .map(s => s.charAt(random(s.length)))
  .fold(c => c)

// Como hacer esto mas puro?
const getStream = (s, str) => {
  return str.length === s
    ? str  
    : getStream(s, str.concat( randomChar(choices) ))
}


const createInterval = time => listener => {
  const id = setInterval(listener, time)
  return () => {
    clearInterval(id)
  }
}






// LOGICA
// Generate 1 stream each second
const read = new Readable()
let data = ''

read.on('data', chunk => {
  data += chunk
})

read.on('end', () => {
  console.log(data)
})

const everySecond = createInterval(100)
const cancelInterval = everySecond(() => {
  read.emit('data', getStream(8, ''))
})

const afterTenSeconds = createInterval(1000)
afterTenSeconds(() => {
  cancelInterval()
})
