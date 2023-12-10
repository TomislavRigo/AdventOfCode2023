const fs = require('node:fs');

const validGame = {
    'red': 12,
    'green': 13,
    'blue': 14
};

const getValidGames = function (gamesTxt) {
    const gamesList = gamesTxt.split('\n');
    return gamesList.reduce((acc, game) => {
        const gameDescription = game.split(':');  // Game [number]: [comma separated set]; [comma separated set]
        const gameIdStr = gameDescription[0].match(/(\d+)/)[0];
        const setList = gameDescription[1]; // [comma separated set]; [comma separated set]

        const isValid = Object.keys(validGame).reduce((acc, color) => {
            if (!acc) {
                return acc;
            }
            const regex = new RegExp('(?<drawResult>\\d+) ' + color, 'g');
            const drawResults = Array.from(setList.matchAll(regex));
            acc = checkGameValidityForColor(color, drawResults);
            return acc;
        }, true)

        if (isValid) {
            acc += Number(gameIdStr);
        }

        return acc;
    }, 0);
}

const checkGameValidityForColor = function (colorName, regexMatchResult) {
    let gameValid = true;
    const validResult = validGame[colorName];
    regexMatchResult.forEach(regexMatch => {
        if (!gameValid) {
            return;
        }
        const drawResult = Number(regexMatch.groups['drawResult']);
        gameValid = drawResult <= validResult
    });
    return gameValid;
}


const gamesTxt = fs.readFileSync('..\\day2.txt', 'utf-8');
console.log(getValidGames(gamesTxt));