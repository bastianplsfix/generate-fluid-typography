/*eslint no-irregular-whitespace: ["error", { "skipComments": true }]*/

// 1. ﻿-YAxisIntersection: The variable ﻿yAxisIntersection is essentially the "starting point" of the scalable font-size: it's the font size that should be used when the viewport is at its minimum width (﻿minViewportWidth). The negative is used because the CSS ﻿clamp() function requires a calculation that relates viewport width v to font size, but in a way where decreasing v decreases the font size. If we use ﻿-minViewportWidth in our calculation, it means "as the viewport decreases from its minimum size, reduce the font size", which fits into the ﻿clamp() rule.
// 2. ﻿slope: This is part of the ﻿preferred value in the ﻿clamp() function and is responsible for the "responsiveness" of our font-size. ﻿Slope represents the rate at which the font-size should change as the viewport width changes. It's computed as the change in font size divided by change in viewport width. By multiplying ﻿slope with the viewport width (vw), it allows the font size to increase linearly as the viewport width increases.


const remSize = 16;
const minViewportWidth = 500
const maxViewportWidth = 1200
const unit = "px"

export function roundNumber(value) {
    return parseFloat(value.toFixed(4));
}

export function convertToRem(value, unit) {
    if (unit === "rem") {
        return parseFloat(value);
    }

    return parseFloat(value) / remSize;
}


function generateClamp(values) {
    // Turn all values into REM
    const minViewportWidth = convertToRem(values.minViewportWidth, values.unit);
    const maxViewportWidth = convertToRem(values.maxViewportWidth, values.unit);
    const minFontSize = convertToRem(values.minFontSize, values.unit);
    const maxFontSize = convertToRem(values.maxFontSize, values.unit);

    // Calculate values
    const slope = (maxFontSize - minFontSize) / (maxViewportWidth - minViewportWidth);
    const yAxisIntersection = roundNumber(-minViewportWidth * slope + minFontSize);

    // String values
    const min = `${minFontSize}rem`;
    const max = `${maxFontSize}rem`;
    const preferred = `${yAxisIntersection}rem + ${roundNumber(slope * 100)}vw`;

    return `clamp(${min}, ${preferred}, ${max})`;
}

function generateCss(array) {
    let cssResult = "";

    array.forEach(item => {
        const values = {
            minViewportWidth,
            maxViewportWidth,
            minFontSize: item.minFontSize,
            maxFontSize: item.maxFontSize,
            unit
        };

        const fontSize = generateClamp(values);
        let lineHeightRule = item.lineHeight ? `line-height: ${item.lineHeight};\n` : "";

        cssResult += `
.${item.class} {
    font-size: ${fontSize};
    ${lineHeightRule}
}
        `;
    });

    return cssResult;
}

// Usage
const array = [
    {class: "display", minFontSize: 16, maxFontSize: 48, lineHeight: 1.2}, 
    {class: "body", minFontSize: 16, maxFontSize: 20, lineHeight: 1.5},
    {class: "subtitle", minFontSize: 16, maxFontSize: 30, lineHeight: 1.5}
];

console.log(generateCss(array));