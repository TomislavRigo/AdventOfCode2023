const fs = require('node:fs');

/**
 * Gets sum of all number that are near at least one symbol. 
 * @param {string} schematic 
 */
const getSchematicSum = function (schematic) {

const schematicLines = schematic.split('\r\n').filter(x => x.length > 0);  // Array of strings, think 2d array of characters

    const numberCoordinates = [];
    let currentNumber = [];

    for (let lineIndex = 0; lineIndex < schematicLines.length; lineIndex++) {
        for (let characterIndex = 0; characterIndex < schematicLines[lineIndex].length; characterIndex++) {
            const currentChar = schematicLines[lineIndex][characterIndex];
            if (!Number.isNaN(Number.parseInt(currentChar))) {
                currentNumber.push([lineIndex, characterIndex])
            } else if (currentNumber.length > 0) {
                numberCoordinates.push(currentNumber);
                currentNumber = [];
            }
            if (characterIndex == (schematicLines[lineIndex].length - 1) && (currentNumber.length > 0)) {
                numberCoordinates.push(currentNumber);
                currentNumber = [];
            }
        }
    }

    return numberCoordinates.reduce((acc, coordinates) => {
        const isPartNumber = checkIsNumberPartNumber(coordinates, schematicLines);
        if (isPartNumber) {
            const numberStr = coordinates.reduce((numberAcc, coordinate) => {
                numberAcc += schematicLines[coordinate[0]][coordinate[1]];
                return numberAcc;
            }, '')
            acc += Number(numberStr);
        }
        return acc;
    }, 0);
}

/**
 * 
 * @param {number[][]} numberCoordinates 
 * @param {string[]} schematicLines 
 */
const checkIsNumberPartNumber = function (numberCoordinates, schematicLines) {
    const lastCharacterIndex = schematicLines[0].length - 1;
    const lastLineIndex = schematicLines.length - 1;
    const coordinatesToCheck = numberCoordinates.reduce((acc, coordinate, index) => {
        if (index === 0) {
            if (coordinate[1] > 0) {
                if (coordinate[0] > 0) {
                    acc.push([coordinate[0] - 1, coordinate[1] - 1])
                }
                acc.push([coordinate[0], coordinate[1] - 1]);
                if (coordinate[0] < lastLineIndex) {
                    acc.push([coordinate[0] + 1, coordinate[1] - 1]);
                }
            }
        }
        if (coordinate[0] > 0) {
            acc.push([coordinate[0] - 1, coordinate[1]]);
        }
        if (coordinate[0] < lastLineIndex) {
            acc.push([coordinate[0] + 1, coordinate[1]]);
        }
        if (index === (numberCoordinates.length - 1)) {
            if (coordinate[1] < lastCharacterIndex) {
                if (coordinate[0] > 0) {
                    acc.push([coordinate[0] - 1, coordinate[1] + 1])
                }
                acc.push([coordinate[0], coordinate[1] + 1]);
                if (coordinate[0] < lastLineIndex) {
                    acc.push([coordinate[0] + 1, coordinate[1] + 1]);
                }
            }
        }
        return acc;
    }, []);

    let isPartNumber = false;
    coordinatesToCheck.forEach(x => {
        if (isPartNumber) {
            return;
        }
        const character = schematicLines[x[0]][x[1]];
        if (Number.isNaN(Number.parseInt(character)) && character !== '.') {
            isPartNumber = true;
            return;
        }
    });

    return isPartNumber;
}

const schematic = fs.readFileSync('..\\day3.txt', 'utf-8');
console.log(getSchematicSum(schematic));