const fs = require('node:fs');

/**
 * 
 * @param {string} schematic 
 */
const getGearRationSum = function (schematic) {
    const schematicLines = schematic.trim().split('\r\n');

    const coordinates = [];
    for (let lineIndex = 0; lineIndex < schematicLines.length; lineIndex++) {
        for (let characterIndex = 0; characterIndex < schematicLines[lineIndex].length; characterIndex++) {
            const character = schematicLines[lineIndex][characterIndex];
            if (character === '*') {
                coordinates.push([lineIndex, characterIndex]);
            }
        }
    }
    return coordinates.reduce((acc, coordinate) => {
        var gearRatio = getGearRatio(coordinate, schematicLines);
        acc += gearRatio;
        return acc;
    }, 0);
}

/**
 * 
 * @param {number[]} coordinate 
 * @param {string[]} schematicLines 
 */
const getGearRatio = function (coordinate, schematicLines) {
    const maxLineIndex = schematicLines.length - 1;
    const maxCharacterIndex = schematicLines[0].length - 1;

    numberStrings = [];

    if (coordinate[0] > 0) {
        const startCharacterIndex = coordinate[1] > 0 ? coordinate[1] - 1 : coordinate[0];
        const topNumbers = findNumbersFromRow([coordinate[0] - 1, startCharacterIndex], schematicLines);
        numberStrings.push(...topNumbers);
    }
    if (coordinate[1] > 0) {
        const leftNumber = findNumberLeft([coordinate[0], coordinate[1] - 1], schematicLines);
        if (leftNumber.length > 0) {
            numberStrings.push(leftNumber);
        }
    }
    if (coordinate[1] < maxCharacterIndex) {
        const rightNumber = findNumberRight([coordinate[0], coordinate[1] + 1], schematicLines);
        if (rightNumber.length > 0) {
            numberStrings.push(rightNumber);
        }
    }
    if (coordinate[0] < maxLineIndex) {
        const startCharacterIndex = coordinate[1] > 0 ? coordinate[1] - 1 : coordinate[0];
        const bottomNumbers = findNumbersFromRow([coordinate[0] + 1, startCharacterIndex], schematicLines);
        numberStrings.push(...bottomNumbers);
    }

    if (numberStrings.length === 2) {
        return numberStrings.reduce((acc, string) => {
            acc = acc * new Number(string);
            return acc;
        }, 1);
    }
    else {
        return 0;
    }
}

const findNumbersFromRow = function (coordinates, schematicList) {
    const lastCharacterIndex = schematicList[0].length - 1;
    const lastStartIndex = coordinates[1] + 2;
    if (lastStartIndex > lastCharacterIndex) {
        lastStartIndex = lastCharacterIndex;
    }

    let currentCharacter = schematicList[coordinates[0]][coordinates[1]];
    while (coordinates[1] > 0 && isStringNumber(currentCharacter)) {
        coordinates[1] -= 1;
        currentCharacter = schematicList[coordinates[0]][coordinates[1]];
    }

    const resultArray = [];
    let currentNumber = '';

    while (true) {
        if (isStringNumber(currentCharacter)) {
            currentNumber = currentNumber.concat(currentCharacter)
        } else if (currentNumber.length > 0) {
            resultArray.push(currentNumber);
            currentNumber = '';
        }

        coordinates[1] = coordinates[1] + 1;
        if (coordinates[1] > (schematicList[0].length - 1)) {
            if (currentNumber.length > 0) {
                resultArray.push(currentNumber);
                currentNumber = '';
            }
            break;
        }
        currentCharacter = schematicList[coordinates[0]][coordinates[1]];

        if (coordinates[1] >= lastStartIndex && !isStringNumber(currentCharacter)) {
            if (currentNumber.length > 0) {
                resultArray.push(currentNumber);
                currentNumber = '';
            }
            break;
        }
    }

    return resultArray;
}

/**
 * 
 * @param {number[]} coordinates 
 * @param {string[]} schematicList 
 */
const findNumberLeft = function (coordinates, schematicList) {
    let currentCoordinates = coordinates;
    let currentCharacter = schematicList[currentCoordinates[0]][currentCoordinates[1]];

    if (!isStringNumber(currentCharacter)) {
        return '';
    }

    let numberString = currentCharacter;

    while (currentCoordinates[0] > 0 && !Number.isNaN(Number.parseInt(currentCharacter))) {
        currentCoordinates = [currentCoordinates[0], currentCoordinates[1] - 1];
        currentCharacter = schematicList[currentCoordinates[0]][currentCoordinates[1]];
        if (isStringNumber(currentCharacter)) {
            numberString = currentCharacter + numberString;
        }
    }

    return numberString;
}

const findNumberRight = function (coordinates, schematicList) {
    const maxCharacterIndex = schematicList[0].length - 1;
    let currentCoordinates = coordinates;
    let currentCharacter = schematicList[currentCoordinates[0]][currentCoordinates[1]];

    if (!isStringNumber(currentCharacter)) {
        return '';
    }

    let numberString = currentCharacter;

    while (currentCoordinates[0] < maxCharacterIndex && !Number.isNaN(Number.parseInt(currentCharacter))) {
        currentCoordinates = [currentCoordinates[0], currentCoordinates[1] + 1];
        currentCharacter = schematicList[currentCoordinates[0]][currentCoordinates[1]];
        if (isStringNumber(currentCharacter)) {
            numberString += currentCharacter;
        }
    }

    return numberString;
}

const isStringNumber = function (string) {
    return !Number.isNaN(Number.parseInt(string))
}

let schematic = fs.readFileSync('..\\day3.txt', 'utf-8');
console.log(getGearRationSum(schematic));