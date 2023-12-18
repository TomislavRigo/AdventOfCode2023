const fs = require('node:fs');
const path = require('node:path');
const brl = '\r\n';

/**
 * 
 * @param {string} networkString 
 */
const getSteps = function (networkString) {
    const networkParts = networkString.trim().split(`${brl}${brl}`);
    const steps = networkParts[0].trim();
    const nodesString = networkParts[1].trim();
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

    const startingNodes = Object.keys(nodes).filter(x => x[2] === 'A');
    const cycles = [];

    startingNodes.forEach(startingNode => {
        let firstZNode = null;
        let currentIndex = 0;
        let currentNode = startingNode;
        let stepsTaken = 0;
        const cycle = [];
        while (stepsTaken === 0 || !firstZNode || currentNode !== firstZNode) {
            if (currentIndex === steps.length) {
                currentIndex = 0;
            }
            if (steps[currentIndex] === 'L') {
                currentNode = nodes[currentNode].left;
            }
            else {
                currentNode = nodes[currentNode].right;
            }
            stepsTaken++;
            currentIndex++;

            if (currentNode[2] === 'Z' && !firstZNode) {
                firstZNode = currentNode;
                cycle.push(stepsTaken);
                stepsTaken = 0;
            }
        }
        cycle.push(stepsTaken);
        cycles.push(cycle);
    });

    const cycleValues = cycles.map(x => x[0]);

    return cycleValues.reduce((acc, x) => {
        if (acc === 0) {
            acc = x;

        } else {
            acc = (acc * x) / greatestCommonDevisor(acc, x);
        }
        return acc;
    }, 0);
}

const greatestCommonDevisor = function (a, b) {
    if (b == 0) {
        return a;
    }
    return greatestCommonDevisor(b, a % b);
}

const networkString = fs.readFileSync('..\\day8.txt', 'utf-8');
console.log(getSteps(networkString));