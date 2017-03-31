const phantom = require('phantom')

let tabs = []
let browsers = []

async function go({address, browserCount, tabCount, runs}) {
    const totalHitsToMake = (browserCount * tabCount * runs)
    let hits = 0
    let lastHits = 0

    console.log({address, browserCount, tabCount, runs})
    console.log('Total Hits to Attempt: ' + totalHitsToMake)

    await createBrowsers(browserCount, tabCount)

    let startTime = Date.now()

    let responseTimes = []
    let responseStatusCodes = []

    console.log('\nBattlestation fully operational')

    tabs.forEach(async tab => {
        for (let z = 0; z < runs; z += 1) {
            let stats = await run(tab, address)
            responseTimes.push(stats.responseTime)
            responseStatusCodes.push(stats.status)
            hits += 1
        }
    })

    let timer = setInterval(async () => {
        console.log('Total hits: ' + hits + ' Hits per second: ' + (hits - lastHits))
        lastHits = hits

        if (hits === totalHitsToMake) {
            clearInterval(timer)
            console.log('\n---- Complete ----')

            let endTime = Date.now()
            let timeToRun = (endTime - startTime) / 1000
            let avgHits = Math.round(totalHitsToMake / timeToRun)
            let successes = responseStatusCodes.filter(status => {
                return status === 'success'
            })
            let successCount = successes.length

            console.log('Total time to run: ' + timeToRun + ' seconds')
            console.log('Average hits per second: ' + avgHits)
            console.log('Successes: ' + successCount + '/' + totalHitsToMake)
            // console.log({timeToRun, avgHits, successCount})

            await cleanUp()
            console.log('Cleanup done, shutting down')
        }
    }, 1000)
}

function createBrowsers(browserCount, tabCount) {
    return new Promise(async (resolve) => {

        for (let i = 0; i < browserCount; i += 1) {
            browsers[i] = await phantom.create()

            for (let i2 = 0; i2 < tabCount; i2 += 1) {
                let tab = await browsers[i].createPage()
                tabs.push(tab)
            }

            console.log('Starting browser ' + (i + 1))
        }

        resolve()
    })
}

async function run(tab, address) {
    return new Promise(async resolve => {
        let requestStartTime = Date.now()
        let status = await tab.open(address)
        let responseTime = (Date.now() - requestStartTime)

        resolve({status, responseTime})
    })
}

function cleanUp() {
    let exits = browsers.map((browser, i) => {
        return browser.exit()
    })

    return Promise.all(exits)
}

module.exports.go = go
