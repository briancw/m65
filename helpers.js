/**
 * Get average value from array
 * @param  {Array} array    An array of values to be averaged
 * @param  {String} key     If input array contains objects, average the provided key of each object
 * @return {Number}         The average value of all numbers in array
 */
function getArrayAverage(array, key) {
    let i = 0
    let sum = 0
    while (i < array.length) {
        let val = key ? array[i][key] : array[i]
        sum += val
        i += 1
    }

    return sum / array.length
}

module.exports = {
    getArrayAverage,
}
