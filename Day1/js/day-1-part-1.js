const fs = require('node:fs');

const getCoordinatesSum = function (coordinatesCsv) {
    const coordinatesList = coordinatesCsv.trim().split('\n');
    return coordinatesList.reduce((acc, coordinate) => {
        acc += getCoordinateSum(coordinate);
        return acc;
    }, 0)
}

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const getCoordinateSum = function (coordinate) {
    const occurrences = digits.reduce((acc, digit) => {
        const firstIndex = coordinate.indexOf(digit);
        if (firstIndex === -1){
            return acc;
        } 
        if (acc.first.index === -1 || acc.first.index > firstIndex){
            acc.first.digit = digit;
            acc.first.index = firstIndex;
        }
        const lastIndex = coordinate.lastIndexOf(digit);
        if (acc.last.index === -1 || acc.last.index < lastIndex){
            acc.last.digit = digit;
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