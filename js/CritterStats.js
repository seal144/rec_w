Critter.count = 0
Critter.all = {}
//
Critter.states = ['growing', 'hungry', 'goingToGoal', 'eating', 'horny', 'copulating', 'dying', 'escaping'];
//
Critter.aggressionMin = 0;
Critter.aggressionInit = 50;
Critter.aggressionMax = 100;
Critter.aggressionSpread = window.sessionStorage.speedOfEvolutionRatio ? 30 * window.sessionStorage.speedOfEvolutionRatio : 30;
//
//exponential growth
//
Critter.speedMin = .6;
Critter.speedInit = 1.8;
Critter.speedMax = 5.4;
//
Critter.sizeMin = 6; // it's diameter of creature
Critter.sizeInit = 18;
Critter.sizeMax = 54;
//
Critter.sensesMin = 15; // it's radius. fieldOfView = size/2+senses 
Critter.sensesInit = 45;
Critter.sensesMax = 135;
//
Critter.affinityFactor = window.sessionStorage.speedOfEvolutionRatio ? .4 * window.sessionStorage.speedOfEvolutionRatio : .4;
Critter.geneMutationRate = window.sessionStorage.speedOfEvolutionRatio ? .33 * window.sessionStorage.speedOfEvolutionRatio : .33;
Critter.sizeThreatFactor = 1.01 + Critter.affinityFactor;
Critter.babiesMin = 1;
Critter.babiesMax = 3;
Critter.growingTimeS = 5;
Critter.escapingTimeS = 3;
Critter.eatingSpeed = .6;
//
Critter.similarityCheck = function (loverA, loverB) {
    for (let i = 0; i < 3; i++) {
        let property = i === 0 ? 'speed' : i === 1 ? 'size' : 'senses';
        const highProp = Math.max(loverA.genes[property], loverB.genes[property]) === loverA.genes[property] ? loverA.genes[property] : loverB.genes[property];
        const lowProp = highProp === loverA.genes[property] ? loverB.genes[property] : loverA.genes[property];
        if (highProp > lowProp * (1 + Critter.affinityFactor)) return false;
    }
    if (!(loverB.genes.aggression >= loverA.genes.aggression - Critter.aggressionSpread && loverB.genes.aggression <= loverA.genes.aggression + Critter.aggressionSpread)) {
        return false;
    }
    return true;
}
//
Critter.relationFactor = function (critterA, critterB) {
    const ratioA = critterA.genes.ratio;
    const ratioB = critterB.genes.ratio;
    const relationFactor = Math.abs(ratioA.speed - ratioB.speed) + Math.abs(ratioA.size - ratioB.size) + Math.abs(ratioA.senses - ratioB.senses) + (Math.abs(ratioA.aggression - ratioB.aggression) * .25)
    return relationFactor;
}
