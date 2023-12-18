const fs = require('node:fs');
const brl = '\r\n';
const cardStrength = {
    'J': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'T': 10,
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
                bid: Number.parseInt(handParts[1])
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
    const uniqueCharacters = [];
    for (let i = 0; i < hand.length; i++) {
        const index = uniqueCharacters.findIndex(x => x.character === hand[i]);
        if (index === -1) {
            uniqueCharacters.push({ character: hand[i], value: 1 })
        } else {
            uniqueCharacters[index].value += 1;
        }
    }

    const jokers = uniqueCharacters.find(x => x.character === 'J');
    const other = uniqueCharacters.filter(x => x.character !== 'J').sort((a, b) => b.value - a.value);

    if (uniqueCharacters.length === 1) {
        return combinationStrengths.fiok;
    }
    if (uniqueCharacters.length === 2) {
        const count = other[0].value + (jokers?.value ?? 0);
        if (count === 5) {
            return combinationStrengths.fiok;
        } else if (count === 4) {
            return combinationStrengths.fok;
        } else {
            return combinationStrengths.fh;
        }
    }
    if (uniqueCharacters.length === 3) {
        const count = other[0].value + (jokers?.value ?? 0);
        if (count === 4) {
            return combinationStrengths.fok;
        } else if (count === 3) {
            if (other[1].value === 2) {
                return combinationStrengths.fh
            } else {
                return combinationStrengths.tok
            }
        } else {
            return combinationStrengths.tp;
        }
    }
    if (uniqueCharacters.length === 4) {
        const count = other[0].value + (jokers?.value ?? 0);
        if (count === 3) {
            return combinationStrengths.tok;
        } else {
            return combinationStrengths.op;
        }
    }
    if (uniqueCharacters.length === 5) {
        const count = other[0].value + (jokers?.value ?? 0);
        if (count === 2) {
            return combinationStrengths.op;
        } else {
            return combinationStrengths.hc;
        }
    }
}

const handsString = fs.readFileSync('..\\day7.txt', 'utf-8');
console.log(calculateWinnings(handsString));