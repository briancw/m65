const cluster = require('cluster')
const phantom = require('phantom')
const addr = 'https://pwa.joecode.site'
// const addr = 'http://clever.ly'

const instanceCount = 10
const pageCount = 5
const runs = 10
const totalHitsToMake = (instanceCount * pageCount * runs)
let instances = []
let pages = []
let hits = 0
let lastHits = 0
let startTime
let responseTimes = []
let responseStatusCodes = []

console.log({addr, totalHitsToMake})

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

    startTime = Date.now()

    pages.forEach(page => {
        run(page)
        // responseTimes.push(stats.responseTime)
        // responseStatusCodes.push(stats.status)
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

async function run(page) {
    for (let z = 0; z < runs; z += 1) {
        let requestStartTime = Date.now()
        let status = await page.open(addr)
        let responseTime = (Date.now() - requestStartTime)

        hits += 1
        // return {responseTime, status}
    }
}

function cleanUp() {
    let endTime = Date.now()

    instances.forEach(instance => {
        instance.exit()
    })

    let timeToRun = (endTime - startTime) / 1000
    let avgHist = Math.round(totalHitsToMake / timeToRun)
    console.log(responseTimes)
    console.log(responseStatusCodes)
    console.log({timeToRun, avgHist})
}

go()

function reportMemory(label) {
    console.log(`${label}: ${Math.round(process.memoryUsage().rss / 10000)} KB`)
}
