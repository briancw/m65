const m65 = require('../index.js')

let address = 'http://isswizzleaword.info/'
let instanceCount = 20
let pageCount = 1 // leave as 1!
let runs = 100

m65.go({
    address,
    instanceCount,
    pageCount,
    runs,
})
// m65.createInstances({instanceCount, pageCount})

function reportMemory(label) {
    console.log(`${label}: ${Math.round(process.memoryUsage().rss / 10000)} KB`)
}
