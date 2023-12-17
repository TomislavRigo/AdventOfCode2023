const fs = require('node:fs');
const brl = '\r\n';

/**
 * 
 * @param {string} raceTimesString 
 */
const getRaceProduct = function(raceTimesString) {
    const races = parseRaces(raceTimesString);

    const raceProduct = races.map(race => {
        let winCount = 0;
        for (i = 1; i < race.distance; i++) {
            const remainingTime = race.time - i;
            if (remainingTime * i > race.distance) {
                winCount++;
            }
        }
        return winCount;
    });

    return raceProduct.reduce((acc, winCount) => {
        acc *= winCount;
        return acc;
    }, 1);
}

/**
 * 
 * @param {string} raceTimesString 
 * @returns {{time: number, distance: number}[]}
 */
const parseRaces = function(raceTimesString) {
    const raceParts = raceTimesString.trim().split(brl);
    const times = raceParts[0]
        .trim().split(':')[1]
        .trim().split(' ')
        .filter(x => x !== '' && x !== ' ');
    const distances = raceParts[1]
        .trim().split(':')[1]
        .trim().split(' ')
        .filter(x => x !== '' && x !== ' ');
    const races = [];
    for(let i = 0; i < times.length; i++) {
        const race = {
            time: Number.parseInt(times[i]),
            distance: Number.parseInt(distances[i])
        }
        races.push(race);
    }

    return races;
}

const raceTimesString = fs.readFileSync('..\\day6.txt', 'utf-8');
console.log(getRaceProduct(raceTimesString));