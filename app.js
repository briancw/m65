const phantom = require('phantom')
const addr = 'http://boost.com/both'
const instanceCount = 5
const pageCount = 10
const runs = 20
const totalHitsToMake = (instanceCount * pageCount * runs)
let pages = []
let instances = []
let hits = 0
let lastHits = 0

console.log(totalHitsToMake)

async function go() {
    for (let i = 1; i <= instanceCount; i += 1) {
        instances[i] = await phantom.create()

        for (let i2 = 0; i2 < pageCount; i2 += 1) {
            let page = await instances[i].createPage()
            pages.push(page)
        }

        // process.stdout.write(i + ' ')
        console.log('Starting instance ' + i)
    }

    pages.forEach(page => {
        run(page)
    })

    let timer = setInterval(() => {
        console.log('Total: ' + hits + ' Last: ' + (hits - lastHits))
        lastHits = hits

        if (hits === totalHitsToMake) {
            console.log('All Done')

            cleanUp()

            clearInterval(timer)
        }
    }, 1000)
}

// function runz(page) {
//     page.open(addr)
//     .then(() => {
//         hits += 1
//         run(page)
//     })
//     .catch(err => {
//         console.error(err)
//     })
// }

async function run(page) {
    for (let z = 0; z < runs; z += 1) {
        await page.open(addr)
        hits += 1
    }
}

function cleanUp() {
    instances.forEach(instance => {
        instance.exit()
    })
}

go()

function reportMemory(label) {
    console.log(`${label}: ${Math.round(process.memoryUsage().rss / 10000)} KB`)
}
