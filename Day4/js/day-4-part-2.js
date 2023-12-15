const fs = require('node:fs');

/**
 * 
 * @param {string} scratchCardsString 
 */
const getTotalWonScratchCardsCount = function (scratchCardsString) {
    const scratchCards = scratchCardsString.trim().split('\r\n');
    const numberPart = scratchCards.map(x => x.trim().split(':')[1].trim());    // 1 2 3 4 5 | 1 2 3 4 5 6 7 8 9

    let scratchCardsWon = numberPart.length;
    for (let i = 0; i < numberPart.length; i++) {
        console.log(`Card number: ${i}`); // This is used as an indicator since, it can appeared stuck.
        scratchCardsWon += getScratchCardWonCount(numberPart, i, i);
    }

    return scratchCardsWon;
}

/**
 * 
 * @param {string[]} scratchCards 
 * example: Card 1: 1 2 3 4 5 | 1 2 3 4 5 6 7 8 9
 * @param {Number} startCardIndex 
 * @param {Number} endCardIndex 
 */
const getScratchCardWonCount = function (scratchCards, startCardIndex, endCardIndex) {
    let count = 0;
    for (let i = startCardIndex; i <= endCardIndex; i++) {
        var cardsWon = calculateCardPoints(scratchCards[i]);
        count += cardsWon;
        if (cardsWon > 0) {
            count += getScratchCardWonCount(scratchCards, i + 1, i + cardsWon);
        }
    }
    return count;
}

/**
 * 
 * @param {string} scratchCard 
 * example: 1 2 3 4 5 | 1 2 3 4 5 6 7 8 9
 */
const calculateCardPoints = function (scratchCard) {
    const numberParts = scratchCard.split('|');
    const winingNumbers = numberParts[0].trim().split(' ').filter(x => x !== '' && x !== ' ');
    const numbersToCheck = numberParts[1].trim().split(' ');

    return winingNumbers.reduce((acc, number) => {
        if (numbersToCheck.indexOf(number) > -1) {
            acc++;
        }
        return acc;
    }, 0);
}

const scratchCardsString = fs.readFileSync('..\\day4.txt', 'utf-8');
console.log(getTotalWonScratchCardsCount(scratchCardsString));