const fs = require('node:fs');

/**
 * 
 * @param {string} almanacString 
 */
const getClosestSeedLocation = function (almanacString) {
    const almanac = almanacString.trim().split('\r\n\r\n');

    const seeds = getSeedValues(almanac[0]);
    var pipe = getPipe(almanac);

    return seeds.reduce((acc, seed) => {
        var value = pipe(seed);
        if((acc === -1) || (acc > value)) {
            acc = value;
        }
        return acc;
    }, -1);
}

/**
 * 
 * @param {string} seedsString 
 * @returns {number[]}
 */
const getSeedValues = function (seedsString) {
    const seedEntryParts = seedsString.trim().split(':');
    return seedEntryParts[1].trim().split(' ').map(x => Number.parseInt(x));
}

/**
 * 
 * @param {string[]} almanac 
 */
const getPipe = function (almanac) {
    const seedToSoilFunctions = getMappingFunctions(almanac[1]);
    const soilToFertilizerFunctions = getMappingFunctions(almanac[2]);
    const fertilizerToWaterFunctions = getMappingFunctions(almanac[3]);
    const waterToLightFunctions = getMappingFunctions(almanac[4]);
    const lightToTemperatureFunctions = getMappingFunctions(almanac[5]);
    const temperatureToHumidityFunctions = getMappingFunctions(almanac[6]);
    const humidityToLocationFunctions = getMappingFunctions(almanac[7]);

    return function (seed) {
        var soilValue = processMappingFunctions(seed, seedToSoilFunctions);
        var fertilizerValue = processMappingFunctions(soilValue, soilToFertilizerFunctions);
        var waterValue = processMappingFunctions(fertilizerValue, fertilizerToWaterFunctions);
        var lightValue = processMappingFunctions(waterValue, waterToLightFunctions);
        var temperatureValue = processMappingFunctions(lightValue, lightToTemperatureFunctions);
        var humidityValue = processMappingFunctions(temperatureValue, temperatureToHumidityFunctions);
        return processMappingFunctions(humidityValue, humidityToLocationFunctions);
    }
}

/**
 * 
 * @param {number} value
 * @param {((value: number) => number)[]} mappingFunctions 
 */
const processMappingFunctions = function (value, mappingFunctions) {
    for (let i = 0; i < mappingFunctions.length; i++) {
        var result = mappingFunctions[i](value);
        if (result !== value) {
            return result;
        }
    }
    return value;
}

/**
 * 
 * @param {string} almanacMap 
 * @returns {((value: number) => number)[]}
 */
const getMappingFunctions = function (almanacMap) {
    const valuesString = almanacMap.trim().split(':\r\n')[1].trim();
    const values = valuesString.split('\r\n').map(x => {
        const values = x.split(' ');
        return [Number.parseInt(values[0]), Number.parseInt(values[1]), Number.parseInt(values[2])];
    });

    return values.map(x => {
        return function (value) {
            if ((x[1] <= value) && (value <= (x[1] + x[2]))) {
                const transFormValue = value - x[1];
                return x[0] + transFormValue;
            }
            else {
                return value
            }
        }
    })
}

const almanacString = fs.readFileSync('..\\day5.txt', 'utf-8');
console.log(getClosestSeedLocation(almanacString));