const fs = require('node:fs');

const colors = ['red', 'green', 'blue'];

const calculateGamesPowerSum = function (gamesTxt) {
    const gamesList = gamesTxt.trim().split('\n');
    const powerSum = gamesList.reduce((acc, game) => {
        const gameSetsStr = game.split(':')[1];
        const gamePower = colors.reduce((acc, color) => {
            const regex = new RegExp('(?<drawResult>\\d+) ' + color, 'g');
            const drawResultsMatches = Array.from(gameSetsStr.matchAll(regex));
            const drawResults = drawResultsMatches.map(x => {
                return Number(x.groups['drawResult']);
            })
            return acc * Math.max(...drawResults);
        }, 1)
        return acc + gamePower;
    }, 0)
    return powerSum;
}

const gamesTxt = fs.readFileSync('..\\day2.txt', 'utf-8');
console.log(calculateGamesPowerSum(gamesTxt));