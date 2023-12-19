const fs = require('node:fs');
const brl = '\r\n';

/**
 * 
 * @param {string} reportString 
 */
const processReport = function (reportString) {

    const reports = reportString.trim().split(brl);
    const parsedReport = reports.map(x => {
        const values = x.trim().split(' ');
        return values.map(y => Number.parseInt(y));
    });

    return parsedReport.reduce((acc, x) => {
        acc += getFirstDigit(x);
        return acc;
    }, 0);
}

/**
 * 
 * @param {number[]} report 
 * @returns {number}
 */
const getFirstDigit = function (report) {
    let atLeastOneNotZero = false;
    for (let i = 0; report.length; i++) {
        if (report[i] !== 0) {
            atLeastOneNotZero = true;
            break;
        }
    }
    if (!atLeastOneNotZero) {
        return 0;
    }

    const secondLevel = [];
    for(let i = 1; i < report.length; i++) {
        secondLevel.push(report[i] - report[i-1]);
    }

    return report[0] - getFirstDigit(secondLevel);
}


const reportString = fs.readFileSync('..\\day9.txt', 'utf-8');
console.log(processReport(reportString));