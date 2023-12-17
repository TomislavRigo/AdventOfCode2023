const fs = require('node:fs');
const brl = '\n';

/**
 * 
 * @param {string} raceTimesString 
 */
const getRaceProduct = function (raceTimesString) {
    const race = parseRace(raceTimesString);

    const lowBound = findLowBound(race);
    const highBound = findHighBound(race);

    return highBound - lowBound;
}

/**
 * 
 * @param {{time: number, distance: number}} race 
 * @returns {number}
 */
const findHighBound = function (race) {
    let lowBound = 0;
    let highBound = race.time;
    let pointer = -1;

    while (lowBound !== highBound) {
        pointer = Math.floor((highBound + lowBound) / 2);
        if (checkRace(race, pointer)) {
            if (lowBound === pointer) {
                lowBound = pointer + 1;
            } else {
                lowBound = pointer;
            }
        } else {
            if (highBound === pointer) {
                highBound = pointer - 1;
            } else {
                highBound = pointer;
            }
        }
    }

    return highBound;
}

/**
 * 
 * @param {{time: number, distance: number}} race 
 * @returns {number}
 */
const findLowBound = function (race) {
    let lowBound = 0;
    let highBound = race.time;
    let pointer = -1;

    while (lowBound !== highBound) {
        pointer = Math.floor((highBound + lowBound) / 2);
        if (checkRace(race, pointer)) {
            if (highBound === pointer) {
                highBound = pointer - 1;
            } else {
                highBound = pointer;
            }
        } else {
            if (lowBound === pointer) {
                lowBound = pointer + 1;
            } else {
                lowBound = pointer;
            }
        }
    }

    return lowBound;
}

/**
 * 
 * @param {{time: number, distance: number}} race 
 * @param {number} pressDuration 
 * @returns 
 */
const checkRace = function (race, pressDuration) {
    const remainingTime = race.time - pressDuration;
    return (remainingTime * pressDuration) > race.distance;
}

/**
 * 
 * @param {string} raceTimesString 
 * @returns {{time: number, distance: number}}
 */
const parseRace = function (raceTimesString) {
    const raceParts = raceTimesString.trim().split(brl);
    const time = raceParts[0]
        .trim().split(':')[1]
        .trim().replace(/\s+/g, '');
    const distance = raceParts[1]
        .trim().split(':')[1]
        .trim().replace(/\s+/g, '');

    return {
        time: Number.parseInt(time),
        distance: Number.parseInt(distance)
    }
}

const raceTimesString = fs.readFileSync('..\\day6.txt', 'utf-8');

console.log(getRaceProduct(raceTimesString));