const fs = require('node:fs');
const brl = '\r\n';
const cardStrength = {
    '2': 1,
    '3': 2,
    '4': 3,
    '5': 4,
    '6': 5,
    '7': 6,
    '8': 7,
    '9': 8,
    'T': 9,
    'J': 10,
    'Q': 11,
    'K': 12,
    'A': 13
};
const combinationStrengths = {
    'hc': 1,
    'op': 2,
    'tp': 3,
    'tok': 4,
    'fh': 5,
    'fok': 6,
    'fiok': 7
};

/**
 * 
 * @param {string} handsString 
 */
const calculateWinnings = function (handsString) {
    const hands = handsString
        .trim().split(brl).map(x => {
            const handParts = x.trim().split(' ');
            return {
                hand: handParts[0],
                bid: handParts[1]
            }
        });

    const sortedHands = hands.sort((a, b) => compareHands(a.hand, b.hand));

    return sortedHands.reduce((acc, hand, index) => {
        const rank = index + 1;
        acc += hand.bid * rank;
        return acc;
    }, 0)
}

/**
 * 
 * @param {string} firstHand 
 * @param {string} secondHand 
 * @returns {number}
 */
const compareHands = function (firstHand, secondHand) {
    const firstHandCombination = getHandCombination(firstHand);
    const secondHandCombination = getHandCombination(secondHand);
    if (firstHandCombination !== secondHandCombination) {
        return firstHandCombination - secondHandCombination;
    }

    for (let i = 0; i < 5; i++) {
        const firstHandHighCard = cardStrength[firstHand[i]];
        const secondHandHighCard = cardStrength[secondHand[i]];
        if (firstHandHighCard !== secondHandHighCard) {
            return firstHandHighCard - secondHandHighCard;
        }
    }

    return 0;
}

/**
 * 
 * @param {string} hand 
 */
const getHandCombination = function (hand) {
    let uniqueCharacters = [];
    for (let i = 0; i < hand.length; i++) {
        const index = uniqueCharacters.findIndex(x => x.character === hand[i]);
        if (index === -1) {
            uniqueCharacters.push({ character: hand[i], value: 1 })
        } else {
            uniqueCharacters[index].value += 1;
        }
    }
    uniqueCharacters = uniqueCharacters.sort((a, b) => b.value - a.value);
    switch (uniqueCharacters.length) {
        case 1:
            return combinationStrengths.fiok;
        case 2:
            if (uniqueCharacters[0].value === 4) {
                return combinationStrengths.fok;
            } else if (uniqueCharacters[1].value === 2) {
                return combinationStrengths.fh;
            } else {
                return combinationStrengths.tok
            }
        case 3:
            if (uniqueCharacters[0].value === 3) {
                return combinationStrengths.tok;
            } else {
                return combinationStrengths.tp;
            }
        case 4:
            return combinationStrengths.op;
        default:
            return combinationStrengths.hc;
    }
}

let handsString = fs.readFileSync('..\\day7.txt', 'utf-8');
console.log(calculateWinnings(handsString));