const fs = require('node:fs');
const brl = '\r\n';

/**
 * 
 * @param {string} networkString 
 */
const getSteps = function (networkString) {
    const networkParts = networkString.trim().split(`${brl}${brl}`);

    const steps = networkParts[0].trim();
    const nodesString = networkParts[1].trim()
    const nodesList = nodesString.split(brl);

    const nodes = {};
    nodesList.forEach(x => {
        const parts = x.trim().split('=');
        const paths = parts[1].trim().replace('(', '').replace(')', '').split(',');

        nodes[parts[0].trim()] = {
            left: paths[0].trim(),
            right: paths[1].trim()
        }
    });

    let currentNode = 'AAA';
    let currentIndex = 0;
    let stepsMade = 0;

    while (currentNode !== 'ZZZ') {
        if (currentIndex === steps.length) {
            currentIndex = 0;
        }
        const nextMove = steps[currentIndex];
        if (nextMove === 'L') {
            currentNode = nodes[currentNode].left;
        } else {
            currentNode = nodes[currentNode].right;
        }
        stepsMade++;
        currentIndex++;
    }

    return stepsMade;
}

const networkString = fs.readFileSync('..\\day8.txt', 'utf-8');
console.log(getSteps(networkString));