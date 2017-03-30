const m65 = require('../index.js')

let address = 'http://boost.com'
let instanceCount = 5
let pageCount = 1 // leave as 1!
let runs = 30

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
