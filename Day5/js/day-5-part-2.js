const fs = require('node:fs');

const brl = '\r\n';

class Range {
    /**
     * @param {number} min 
     * @param {number} max 
     */
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }

    /**
     * 
     * @param {number} value 
     * @returns {Range}
     */
    transform(value) {
        return new Range(this.min + value, this.max + value);
    }

    /**
     * 
     * @param {Range} range 
     * @returns {Boolean}
     */
    equal(range) {
        return (this.min === range.min) && (this.max === range.max);
    }
}

class MappingRange {
    /**
     * 
     * @param {number} min 
     * @param {number} max 
     * @param {number} transformation 
     */
    constructor(min, max, transformation) {
        this.min = min;
        this.max = max;
        this.transformation = transformation;
    }
}

/**
 * 
 * @param {string} almanacString 
 */
const getClosestSoil = function (almanacString) {
    const almanacParts = almanacString.trim().split(`${brl}${brl}`);
    const seeds = getSeedRanges(almanacParts[0]);
    
    const pipe = getTransformationPipe(almanacParts);

    const foundRanges = pipe(seeds);
    const minBound = foundRanges.map(x => x.min);

    return Math.min(...minBound.filter(x => x > 0)); // This is required 
}

/**
 * 
 * @param {string} seedsString 
 * @returns {Range[]}
 */
const getSeedRanges = function (seedsString) {
    const seedsParts = seedsString.trim().split(':');
    const seeds = seedsParts[1].trim().split(' ');

    const seedRanges = [];
    for (let i = 0; i < seeds.length; i += 2) {
        const range = new Range(Number.parseInt(seeds[i]), Number.parseInt(seeds[i]) + Number.parseInt(seeds[i + 1]) - 1);
        seedRanges.push(range);
    }

    return seedRanges;
}

/**
 * 
 * @param {string[]} almanacParts 
 */
const getTransformationPipe = function (almanacParts) {
    const seedToSoilRanges = createMappingRanges(almanacParts[1]);
    const soilToFertilizerRanges = createMappingRanges(almanacParts[2]);
    const fertilizerToWaterRanges = createMappingRanges(almanacParts[3]);
    const waterToLightRanges = createMappingRanges(almanacParts[4]);
    const lightToTemperatureRanges = createMappingRanges(almanacParts[5]);
    const temperatureToHumidityRanges = createMappingRanges(almanacParts[6]);
    const humidityToLocationRanges = createMappingRanges(almanacParts[7]);

    return (range) => {
        var soilValue = processMappingFunctions(range, seedToSoilRanges);
        var fertilizerValue = processMappingFunctions(soilValue, soilToFertilizerRanges);
        var waterValue = processMappingFunctions(fertilizerValue, fertilizerToWaterRanges);
        var lightValue = processMappingFunctions(waterValue, waterToLightRanges);
        var temperatureValue = processMappingFunctions(lightValue, lightToTemperatureRanges);
        var humidityValue = processMappingFunctions(temperatureValue, temperatureToHumidityRanges);
        return processMappingFunctions(humidityValue, humidityToLocationRanges);
    };
}

/**
 * 
 * @param {Range[]} ranges 
 * @param {MappingRange[]} mappingRanges 
 * @param {Range[]}
 */
const processMappingFunctions = function (ranges, mappingRanges) {
    const resultRanges = [];
    ranges.forEach(range => {
        let valuesAdded = false;
        mappingRanges.forEach(mappingRange => {
            if ((range.min >= mappingRange.min) && (range.max <= mappingRange.max)) {
                resultRanges.push(range.transform(mappingRange.transformation));
                valuesAdded = true;
            } else if ((range.min <= mappingRange.min) && (range.max >= mappingRange.min) && (range.max <= mappingRange.max)) {
                const firstRange = new Range(range.min, mappingRange.min);
                const secondRange = new Range(mappingRange.min, range.max);
                resultRanges.push(firstRange, secondRange.transform(mappingRange.transformation));
                valuesAdded = true;
            } else if ((range.min <= mappingRange.min) && (range.max >= mappingRange.max)) {
                const firstRange = new Range(range.min, mappingRange.min);
                const secondRange = new Range(mappingRange.min, mappingRange.max);
                const thirdRange = new Range(mappingRange.max, range.max);
                resultRanges.push(firstRange, secondRange.transform(mappingRange.transformation), thirdRange);
                valuesAdded = true;
            }
        });
        if (!valuesAdded) {
            resultRanges.push(range);
        }
    });

    return resultRanges;
}

/**
 * 
 * @param {string} mappingSting
 * @returns {MappingRange[]} 
 */
const createMappingRanges = function (mappingSting) {
    const mappingParts = mappingSting.trim().split(':');
    const mappingRangesString = mappingParts[1].trim().split(brl);

    return mappingRangesString.map(x => {
        const parts = x.trim().split(' ');
        return new MappingRange(Number.parseInt(parts[1]), Number.parseInt(parts[1]) + Number.parseInt(parts[2]) - 1, Number.parseInt(parts[0]) - Number.parseInt(parts[1]));
    });
}

const almanacString = fs.readFileSync('..\\day5.txt', 'utf-8');
console.log(getClosestSoil(almanacString));