const m65 = require('../index.js')

let address = 'http://isswizzleaword.info/'
let browserCount = 5
let tabCount = 1 // Tabs per window, leave this as 1
let runs = 100

m65.go({address, browserCount, tabCount, runs})

function reportMemory(label) {
    console.log(`${label}: ${Math.round(process.memoryUsage().rss / 10000)} KB`)
}
