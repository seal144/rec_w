let VAR = {
    fps: 20,
    normalFps: 20,
    W: 0,
    minW: 500,
    H: 0,
    minH: 500,
    scale: 1,
    lineWidth: 1,
    margin: 20,
    minNumberPlants: 6,
    startNumberPlants: 0,
    startNumberCritters: 0,
    addPlantSeconds: 1,
    simulation: false,
    startGenesRatio: {
        speed: window.sessionStorage.startSpeedRatio ? window.sessionStorage.startSpeedRatio : 1,
        size: window.sessionStorage.startSizeRatio ? window.sessionStorage.startSizeRatio : 1,
        senses: window.sessionStorage.startSensesRatio ? window.sessionStorage.startSensesRatio : 1,
        aggression: window.sessionStorage.startAggressionRatio ? window.sessionStorage.startAggressionRatio : 1,
    }
}
//
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
//
function modPosition(startArrayXY, distance, alfa) {
    let modPositionXY = []
    let x = Math.sin(Math.PI / 180 * alfa) * distance + startArrayXY[0];
    let y = Math.cos(Math.PI / 180 * alfa) * distance + startArrayXY[1];
    modPositionXY.push(x);
    modPositionXY.push(y);
    return modPositionXY;
};
//
function findAlfa(startXY, endXY) {
    const x = endXY[0] - startXY[0];
    const y = endXY[1] - startXY[1];
    const alfa = endXY[0] >= startXY[0] ? (90 - (Math.round(Math.atan(y / x) * (180 / Math.PI)))) : (270 - (Math.round(Math.atan(y / x) * (180 / Math.PI))));
    return alfa;
};
//
function distance(startXY, endXY) {
    let a = endXY[0] - startXY[0];
    let b = endXY[1] - startXY[1];
    let c = Math.sqrt(a * a + b * b);
    return c;
};
//
function shuffleArray(array) {
    for (e in array) {
        let temp;
        let randomIndex = random(0, array.length - 1);
        temp = array[randomIndex];
        array[randomIndex] = array[e];
        array[e] = temp;
    }
}
//
function copyArray(array) {
    let copiedArray = [];
    if (Object.getPrototypeOf(array) !== Array.prototype) {
        return new Error('function copyArray accepts only array');
    }
    for (e in array) {
        if (array[e] instanceof Object) {
            return new Error('datatypes in array in function copyArray have to be primitive');
        }
        copiedArray[e] = array[e];
    }
    return copiedArray;
}
//first drawing background
function backgroundDraw(ctx) {
    ctx.fillStyle = 'rgba(0,0,0)';
    ctx.fillRect(0, 0, VAR.W, VAR.H);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.strokeRect(0, 0, VAR.W, VAR.H);
    ctx.lineWidth = VAR.lineWidth;
}
//background drawing loop
function backgroundReset(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,.9)';
    ctx.fillRect(0, 0, VAR.W, VAR.H);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.strokeRect(0, 0, VAR.W, VAR.H);
    ctx.lineWidth = VAR.lineWidth;
}
//background fog in menu
function backgroundFog(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,.2)';
    ctx.fillRect(0, 0, VAR.W, VAR.H);
}

//test functions for compare energy autgo
const energyOutgo1 = function (speed, size, senses) {
    const energyLoss = ((speed * 2.5) * (size * 1) + senses) * .0035;
    console.log('zurzycie na sec:', energyLoss * 20);
    console.log('zurzycie 200 energii w :', 200 / (energyLoss * 20), ' sec')
}
const energyOutgo2 = function (speed, size, senses) {
    const energyLoss = ((speed * 1) * (size * 1) + (senses * .5)) * .35;
    console.log('zurzycie na sec:', energyLoss * 20);
    console.log('zurzycie 200 energii w :', 200 / (energyLoss * 20), ' sec')
}

/*
issues:
-sometimes the species labels show wrong population, don't know why
*/
