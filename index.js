const phantom = require('phantom')

let pages = []
let instances = []

async function go({address, instanceCount, pageCount, runs}) {
    const totalHitsToMake = (instanceCount * pageCount * runs)
    let hits = 0
    let lastHits = 0

    console.log({address, instanceCount, pageCount, runs})
    console.log(totalHitsToMake)

    await createInstances(instanceCount, pageCount)

    let startTime = Date.now()

    let responseTimes = []
    let responseStatusCodes = []

    console.log('\nBattlestation fully operational')

    pages.forEach(async page => {
        for (let z = 0; z < runs; z += 1) {
            let stats = await run(page, address)
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

function createInstances(instanceCount, pageCount) {
    return new Promise(async (resolve) => {

        for (let i = 0; i < instanceCount; i += 1) {
            instances[i] = await phantom.create()

            for (let i2 = 0; i2 < pageCount; i2 += 1) {
                let page = await instances[i].createPage()
                pages.push(page)
            }

            console.log('Starting instance ' + (i + 1))
        }

        resolve()
    })
}

async function run(page, address) {
    return new Promise(async resolve => {
        let requestStartTime = Date.now()
        let status = await page.open(address)
        let responseTime = (Date.now() - requestStartTime)

        resolve({status, responseTime})
    })
}

function cleanUp() {
    let exits = instances.map((instance, i) => {
        return instance.exit()
    })

    return Promise.all(exits)
}

module.exports.go = go
