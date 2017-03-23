const phantom = require('phantom')
// let addr = 'https://www.google.com/'
let addr = 'http://boost.com/no-cache/both'

function get(instance, addr) {
    return new Promise(async (resolve, reject) => {
        const page = await instance.createPage()

        const startTime = Date.now()
        // await page.on('onResourceRequested', function(requestData) {
        //     console.info('Requesting', requestData.url)
        // })

        let rand = '?' + String(Math.random()) + '=' + String(Math.random())
        const status = await page.open(addr + rand)
        const totalTime = Date.now() - startTime
        // console.log(status + ' : ' + totalTime + 'ms')
        // const wasSuccess = status === 'success'

        // const content = await page.property('content')
        // console.log(content)
        resolve({status, totalTime})
    })
}

async function launch(addr, runCount, runContinious) {
    // TODO try making multiple requests with one page to incresase performance
    const instance = await phantom.create()

    let runs = []
    for (let i = 0; i < runCount; i += 1) {
        runs[i] = get(instance, addr)
    }

    Promise.all(runs).then((stats) => {
            // console.log(successes)
        console.log('Round Complete')
        instance.exit()
        // instance.kill()
        reportMemory()

        if (runContinious) {
            launch(addr, runCount, runContinious)
        }
    })
}

function reportMemory() {
    console.log(`Memory: ${Math.round(process.memoryUsage().rss / 1000000)} MB`)
}

// launch(addr, 300)
launch(addr, 500, true)
