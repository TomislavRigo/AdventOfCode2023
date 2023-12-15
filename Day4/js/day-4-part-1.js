const fs = require('node:fs');

/**
 * 
 * @param {string} scratchCardsString 
 */
const calculatePoints = function (scratchCardsString) {
    const scratchCards = scratchCardsString.trim().split('\r\n');   // example: Card 1: 1 2 3 4 5 | 1 2 3 4 5 6 7 8 9
    return scratchCards.reduce((acc, scratchCard) => {
        const points = calculateCardPoints(scratchCard);
        acc += points;
        return acc;
    }, 0);
}

/**
 * 
 * @param {string} scratchCard 
 * example: Card 1: 1 2 3 4 5 | 1 2 3 4 5 6 7 8 9
 */
const calculateCardPoints = function (scratchCard) {
    const cardParts = scratchCard.split(':');
    const numberPart = cardParts[1].trim();
    const numberParts = numberPart.split('|');
    const winingNumbers = numberParts[0].trim().split(' ').filter(x => x !== '' && x !== ' ');
    const numbersToCheck = numberParts[1].trim().split(' ');

    const matches = winingNumbers.reduce((acc, number) => {
        if (numbersToCheck.indexOf(number) > -1) {
            acc++;
        }
        return acc;
    }, 0);

    if (matches > 0) {
        return 2 ** (matches - 1);
    }

    return 0;
}

const scratchCards = fs.readFileSync('..\\day4.txt', 'utf-8');

console.log(calculatePoints(scratchCards));