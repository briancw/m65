// Prevent EventEmitter warning from displaying
process.setMaxListeners(0)
const puppeteer = require('puppeteer')
const {getArrayAverage} = require('./helpers.js')

const browsers = []
const pages = []
const defaultBlockedUrls = ['google-analytics.com']

/**
 * Main function which starts M65
 * @param  {Object} parameters   M65's parameters
 * @param  {String} browserCount How many chome browsers to use
 * @param  {Number} runs         How many times each browser should fire
 * @param  {Array}  blockedUrls  A list of urls which will not be loaded durring testing
 */
async function go({address, browserCount, runs, blockedUrls}) {
    await inititalizeBrowsers(browserCount, blockedUrls)

    const hitsToMake = browserCount * runs
    let hitsMade = 0
    const responses = []

    console.log(`Battlestation fully operational. Attempting ${hitsToMake} total hits. Now firing`)

    pages.forEach(async (page) => {
        for (let runCount = 0; runCount < runs; runCount += 1) {
            const response = await fire(address, page)
            responses.push(response)
            hitsMade += 1

            if (hitsMade === hitsToMake) {
                reportAndCleanup(responses)
            }
        }
    })
}

/**
 * Breakdown run responses and shutdown browsers
 * @param {Array}   responses       An array of objects containing response statusCode, time, and success
 */
function reportAndCleanup(responses) {
    const averageResponseTime = getArrayAverage(responses, 'elapsedTime')
    console.log(`Average Response: ${averageResponseTime}ms`)
    console.log(responses)
    const successes = responses.filter(({status}) => status === 200)
    console.log(successes.length)

    cleanup()
}

/**
 * Initialize headless chrome browsers and put them into an array
 * @param  {Number} browserCount How many browsers should be spun up
 * @param  {Array}  blockedUrls  An array of arrays which will not be loaded durring testing
 * @return {Promise}             A Promise which resolves after all browsers and pages have been initalized
 */
function inititalizeBrowsers(browserCount, blockedUrls = defaultBlockedUrls) {
    return new Promise(async (resolve) => {
        if (browserCount > 30) {
            process.stdout.write('Browsers Instances Ready: ')
        }

        for (let i = 0; i < browserCount; i += 1) {
            const browser = await puppeteer.launch()
            browsers.push(browser)

            const page = await browser.newPage()
            page.setViewport({width: 1440, height: 900})
            pages.push(page)

            await page.setRequestInterception(true)

            page.on('request', interceptedRequest => {
                let includesBlocked = blockedUrls.some(v => {
                    return interceptedRequest.url.includes(v)
                })

                if (includesBlocked) {
                    interceptedRequest.abort()
                } else {
                    interceptedRequest.continue()
                }
            })

            if (browserCount > 30) {
                process.stdout.write(`${i + 1},`)
            }
        }

        resolve()
    })
}

/**
 * Fire a chrome instance at the target url
 * @param  {String}     address        A url to hit
 * @param  {Object}     page           A puppeteer page object
 * @param  {Boolean}    takeScreenshot Whether or not to take a screenshot
 * @return {Promise}                   A promise which resolves after the page has been loaded
 */
function fire(address, page) {
    return new Promise(async (resolve) => {
        const startTime = Date.now()
        let status
        let success

        try {
            ({status} = await page.goto(address))
            success = true
            // const perf = await page.metrics()
        } catch (err) {
            success = false
        }
        const elapsedTime = Date.now() - startTime

        resolve({status, elapsedTime, success})
    })
}

/**
 * Close up any open browsers
 * @return {Promise} A promise resolving when all browsers have been cleanup up
 */
function cleanup() {
    let exits = browsers.map(browser => {
        return browser.close()
    })

    return Promise.all(exits)
}

module.exports = {go}
