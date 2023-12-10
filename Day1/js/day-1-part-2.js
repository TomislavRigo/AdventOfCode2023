const fs = require('node:fs');

const getCoordinatesSum = function (coordinatesCsv) {
    const coordinatesList = coordinatesCsv.trim().split('\n');
    return coordinatesList.reduce((acc, coordinate) => {
        acc += getCoordinateSum(coordinate);
        return acc;
    }, 0)
}

const digits = {
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
}

const getCoordinateSum = function (coordinate) {
    const occurrences = Object.keys(digits).reduce((acc, digit) => {
        const firstIndex = coordinate.indexOf(digit);
        if (firstIndex === -1){
            return acc;
        } 
        if (acc.first.index === -1 || acc.first.index > firstIndex){
            acc.first.digit = digits[digit];
            acc.first.index = firstIndex;
        }
        const lastIndex = coordinate.lastIndexOf(digit);
        if (acc.last.index === -1 || acc.last.index < lastIndex){
            acc.last.digit = digits[digit];
            acc.last.index = lastIndex;
        }
        return acc;
    }, {
        first: {
            index: -1,
            digit: -1,
        },
        last: {
            index: -1,
            digit: -1,
        }
    });

    return (occurrences.first.digit * 10) + occurrences.last.digit;
}

const coordinatesCsv = fs.readFileSync('..\\day1.txt', 'utf-8');
console.log(getCoordinatesSum(coordinatesCsv));