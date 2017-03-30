const m65 = require('../index.js')

let address = 'http://isswizzleaword.info/'
let instanceCount = 20 // Equates to chrome windows
let pageCount = 1 // Equates to tabs per window, leave this as 1
let runs = 100

m65.go({address, instanceCount, pageCount, runs})

function reportMemory(label) {
    console.log(`${label}: ${Math.round(process.memoryUsage().rss / 10000)} KB`)
}
