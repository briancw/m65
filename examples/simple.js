const m65 = require('../index.js')

let address = 'http://localhost:3000'
let browserCount = 10
let runs = 10
let blockedUrls = ['google-analytics.com']

m65.go({address, browserCount, runs, blockedUrls})
