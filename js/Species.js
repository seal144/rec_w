Species.namesTemplate = { //max 8 letters
    high_speed: ['celer', 'fulgur', 'ventus', 'lepus', 'caprea', 'struthio', 'cursor', 'equitem'],
    low_speed: ['tarda', 'lapis', 'stans', 'testudo', 'cochlea', 'bradypus', 'veternum', 'quod'],
    high_size: ['magnum', 'crassus', 'giant', 'elephas', 'bovi', 'bos', 'luctator', 'porcus'],
    low_size: ['parvus', 'tenues', 'gnome', 'mus', 'musca', 'cricetus', 'infans', 'formica'],
    high_senses: ['videt', 'audite', 'sentit', 'plecotus', 'strix', 'falco', 'observet', 'vulpes'],
    low_senses: ['caecus', 'surdi', 'tenebris', 'talpa', 'amoeba', 'aurelia', 'fodiens', 'annelida'],
    high_aggression: ['bellum', 'inimicus', 'malus', 'tigris', 'gulo', 'orca', 'mellivora', 'sus'],
    low_aggression: ['amica', 'bonum', 'amans', 'suricata', 'dasypus', 'clupea', 'vitula', 'papilio'],
    neutral: ['medicoris', 'patet', 'griseo', 'livia', 'silva', 'aquae', 'caerula', 'tufty', 'esuriit', 'ursa', 'columba', 'equus', 'collegam', 'stultus', 'alvo', 'athleta'],
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
    this.holotype = holotype;
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
    this.generation = holotype.generation;
    if (Object.keys(Species.all).length <= 0) {
        this.name = 'PRIMUM PIONEER'
    } else {
        this.name = this.setName(holotype.genes.mainfeature);
    }
    //
    Species.count++
    Species.all[this.name] = this;
    Species.last = this;
    this.addLabel();
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
//
Species.CheckUpdate = function () {
    for (e in Species.all) {
        Species.all[e].population = 0;
    }
    for (e in Critter.all) {
        Critter.all[e].species = Critter.all[e].speciesCheck();
    }
    return Species.last.name;
}
//
Species.prototype.addLabel = function () {
    let div = document.createElement('div')
    div.className = 'speciesLabel'
    div.id = this.name + '_' + String(this.generation);
    document.querySelector('#species').appendChild(div);
    //
    let h3 = document.createElement('h3');
    h3.className = 'Sname';
    h3.innerHTML = this.name;
    div.appendChild(h3);
    //
    let h4 = document.createElement('h4');
    h4.className = 'Sholotype';
    h4.innerHTML = 'HOLOTYPE:';
    div.appendChild(h4);
    //
    div.appendChild(Species.addH5('speed', this));
    div.appendChild(Species.addH5('size', this));
    div.appendChild(Species.addH5('senses', this));
    div.appendChild(Species.addH5('aggression', this));
    div.appendChild(Species.addH5('generation', this));
    //
    let h4pop = document.createElement('h4');
    h4pop.className = 'Spopulation';
    h4pop.innerHTML = 'POPULATION:';
    div.appendChild(h4pop);
    //
    div.appendChild(Species.addPhantom(this))
}
//
Species.addH5 = function (statistic, holotype) {
    let h5 = document.createElement('h5');
    h5.className = 'S' + statistic;
    if (statistic === 'generation') {
        h5.innerHTML = statistic.toUpperCase() + ': ' + String(holotype[statistic])
    } else {
        h5.innerHTML = statistic.toUpperCase() + ': ' + String(Math.round(holotype.genes.ratio[statistic] * 100) / 100);
    }
    return h5;
}
//
Species.addPhantom = function (spec) {
    const canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')
    canvas.width = 60; //74
    canvas.height = 60; //74
    ctx.lineWidth = VAR.lineWidth;
    ctx.lineJoin = 'round';
    canvas.className = 'Sphantom';
    //
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, main.canvas.width, main.canvas.height);
    //
    const tempXY = spec.holotype.xy;
    const tempAlfa = spec.holotype.drawing.alfa;
    spec.holotype.xy = [canvas.width / 2, canvas.height / 2];
    spec.holotype.drawing.alfa = 180;
    spec.holotype.drawBody(ctx);
    spec.holotype.drawSenses(ctx);
    spec.holotype.xy = tempXY;
    spec.holotype.drawing.alfa = tempAlfa;
    //
    return canvas;
}
//
Species.addIndividual = function (species) {
    species.population++;
    document.getElementById(species.name + '_' + species.generation).querySelector('.Spopulation').innerHTML = 'POPULATION: ' + species.population;
}
//
Species.removeIndividual = function (species) {
    const speciesTag = document.getElementById(species.name + '_' + species.generation);
    species.population--;
    if (species.population <= 0) {
        delete Species.all[species.name];
        document.getElementById('species').removeChild(speciesTag);
    } else {
        document.getElementById(species.name + '_' + species.generation).querySelector('.Spopulation').innerHTML = 'POPULATION: ' + species.population;
    }
}
//
Species.setLabels = function () {
    document.querySelector('div#species').style.top = String(VAR.H) + 'px';
    document.querySelector('div#species').style.width = String(VAR.W) + 'px';
}
