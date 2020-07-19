Critter.count = 0
Critter.all = {}
//
Critter.states = ['growing', 'hungry', 'goingToGoal', 'eating', 'horny', 'copulating', 'dying', 'escaping'];
//
Critter.aggressionMin = 0;
Critter.aggressionInit = 50;
Critter.aggressionMax = 100;
Critter.aggressionSpread = 30;
//
//PRZYROST WYKŁADNICZY
//
Critter.speedMin = .8;
Critter.speedInit = 2.4;
Critter.speedMax = 7.2;
//
Critter.sizeMin = 7; // it's diameter of creature
Critter.sizeInit = 21;
Critter.sizeMax = 63;
//
Critter.sensesMin = 10; // it's radius. fieldOfView = size/2+senses 
Critter.sensesInit = 40;
Critter.sensesMax = 160;
//
Critter.affinityFactor = .4;
Critter.sizeThreatFactor = 1.5;
Critter.babiesMin = 1;
Critter.babiesMax = 3;
Critter.growingTimeS = 5;
Critter.escapingTimeS = 3;
Critter.eatingSpeed = .8; //1.4
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
        console.log('jest falseaggression', loverA, loverB);
    }
    return true;
}
