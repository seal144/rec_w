Species.namesTemplate = {
    high_speed: ['celer', 'fulgur', 'ventus', 'lepus', 'caprea', 'struthio', 'cursor', 'equitem'],
    low_speed: ['tarda', 'lapis', 'stans', 'testudo', 'cochlea', 'bradypus', 'veternum', 'quod'],
    high_size: ['magnum', 'crassus', 'giant', 'elephas', 'bovi', 'bos', 'luctator', 'hippopotamus'],
    low_size: ['parvus', 'tenues', 'leprechaun', 'mus', 'musca', 'cricetus', 'infans', 'coccinella'],
    high_senses: ['videt', 'audite', 'sentit', 'plecotus', 'strix', 'falco', 'speculator', 'vulpes'],
    low_senses: ['caecus', 'surdi', 'tenebris', 'talpa', 'paramecium', 'aurelia', 'fodiens', 'annelida'],
    high_aggression: ['homicidam', 'inimicus', 'malus', 'tigris', 'casuarius', 'orca', 'mellivora', 'sus'],
    low_aggression: ['amica', 'bonum', 'amans', 'suricata', 'dasypus', 'clupea', 'erinaceus', 'papilio'],
    neutral: ['medicoris', 'patet', 'griseo', 'livia', 'silva', 'aquae', 'caerula', 'tufty', 'esuriit', 'ursa', 'columba', 'equus', 'subtiliter', 'stultus', 'alvo', 'athleta'],
}
Species.names = {}
Species.refillNamesArrayIfEmpty = function () {
    let oneArrayEmpty = false;
    for (e in Species.names) {
        if (Species.names[e].length === 0) {
            oneArrayEmpty = true;
            break;
        }
    }
    if (oneArrayEmpty) {
        for (e in Species.namesTemplate) {
            Species.names[e] = copyArray(Species.namesTemplate[e]);
        };
        for (e in Species.names) {
            shuffleArray(Species.names[e]);
        }
    }
};
//
Species.count = 0;
Species.all = {}
Species.last;
//
function Species(holotype) {
    this.population = 0;
    this.genes = {};
    this.genes.speed = holotype.genes.speed;
    this.genes.size = holotype.genes.size;
    this.genes.senses = holotype.genes.senses;
    this.genes.aggression = holotype.genes.aggression;
    this.genes.ratio = {
        speed: this.genes.speed / Critter.speedInit,
        size: this.genes.size / Critter.sizeInit,
        senses: this.genes.senses / Critter.sensesInit,
        aggression: this.genes.aggression / Critter.aggressionInit,
    }
    if (Object.keys(Species.all).length <= 0) {
        this.name = 'PRIMUM PIONEER'
    } else {
        this.name = this.setName(holotype.genes.mainfeature);
    }
    Species.count++
    Species.all[this.name] = this;
    Species.last = this;
    console.log('new Species', this);
}
//
Species.prototype.setName = function (mainFeature) {
    Species.refillNamesArrayIfEmpty();
    let name;
    const nameCase1 = random(0, 1);
    const nameCase2 = random(0, 1);
    let firstNameLowOrHigh;
    let features = [];
    for (e in this.genes.ratio) {
        features.push({
            name: e.toString(),
            value: this.genes.ratio[e]
        })
    }
    let highestFeature = features.reduce(function (maximum, current) {
        if (current.value > maximum.value) return current
        else return maximum
    });
    let lowestFeature = features.reduce(function (minimum, current) {
        if (current.value < minimum.value) return current
        else return minimum
    });
    if (mainFeature) {
        name = Species.names['high_' + mainFeature].shift();
        firstNameLowOrHigh = 'high'
    } else if (nameCase1) {
        name = Species.names['high_' + highestFeature.name].shift();
        firstNameLowOrHigh = 'high'
    } else {
        name = Species.names['low_' + lowestFeature.name].shift();
        firstNameLowOrHigh = 'low';
    };
    if (nameCase2) {
        if (firstNameLowOrHigh === 'high') {
            name += ' ' + Species.names['low_' + lowestFeature.name].shift();
        } else {
            name += ' ' + Species.names['high_' + highestFeature.name].shift();
        }
    } else {
        name += ' ' + Species.names.neutral.shift();
    }
    name = name.toUpperCase();
    return name;
};





/*
Species.namesTemplate = {
    fast: ['celer', 'fulgur', 'ventus', 'lepus', 'caprea', 'struthio', 'cursor', 'equitem'],
    slow: ['tarda', 'lapis', 'stans', 'testudo', 'cochlea', 'bradypus', 'veternum', 'quod'],
    big: ['magnum', 'crassus', 'giant', 'elephas', 'bovi', 'bos', 'luctator', 'hippopotamus'],
    small: ['parvus', 'tenues', 'leprechaun', 'mus', 'musca', 'cricetus', 'infans', 'coccinella'],
    sharpSenses: ['videt', 'audite', 'sentit', 'plecotus', 'strix', 'falco', 'speculator', 'vulpes'],
    weekSenses: ['caecus', 'surdi', 'tenebris', 'talpa', 'paramecium', 'aurelia', 'fodiens', 'annelida'],
    mostAggression: ['homicidam', 'inimicus', 'malus', 'tigris', 'casuarius', 'orca', 'mellivora', 'sus'],
    leastAggression: ['amica', 'bonum', 'amans', 'suricata', 'dasypus', 'clupea', 'erinaceus', 'papilio'],
    neutral: ['medicoris', 'patet', 'griseo', 'livia', 'silva', 'aquae', 'caerula', 'tufty', 'esuriit', 'ursa', 'columba', 'equus', 'subtiliter', 'stultus', 'alvo', 'athleta'],
}
*/
