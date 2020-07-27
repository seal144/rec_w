info = {
    timer: {
        statsUpdate: 0,
    },
    statsUpdate: function () {
        if (info.timer.statsUpdate <= 0) {
            info.plantsBugsUpdate();
            info.generationUpdate();
            info.featureUpdate('speed');
            info.featureUpdate('size');
            info.featureUpdate('senses');
            info.featureUpdate('aggression');
            info.timer.statsUpdate = VAR.normalFps;
        } else info.timer.statsUpdate -= 1
    },
    plantsBugsUpdate: function () {
        document.getElementById('Pplants').innerHTML = Object.keys(Plant.all).length;
        document.getElementById('Pbugs').innerHTML = Object.keys(Critter.all).length;
    },
    generationUpdate: function () {
        let latestGeneration = 0;
        for (e in Critter.all) {
            if (Critter.all[e].generation > latestGeneration) latestGeneration = Critter.all[e].generation;
        }
        if (Number(document.getElementById('Pgeneration').innerHTML) < latestGeneration) document.getElementById('Pgeneration').innerHTML = latestGeneration;
    },
    featureUpdate: function (feature) {
        let highest;
        let lowest;
        let sum = 0;
        let count = 0;
        let avarege;
        for (e in Critter.all) {
            let ifGrowing = feature === 'size' && Critter.all[e].genes.targetSize ? true : false;
            if (!highest) {
                if (ifGrowing) {
                    highest = Critter.all[e].genes.targetSize;
                    lowest = Critter.all[e].genes.targetSize;
                } else {
                    highest = Critter.all[e].genes[feature];
                    lowest = Critter.all[e].genes[feature];
                }
            } else {
                if (ifGrowing) {
                    Critter.all[e].genes.targetSize > highest ? highest = Critter.all[e].genes.targetSize : Critter.all[e].genes.targetSize < lowest ? lowest = Critter.all[e].genes.targetSize : null;
                } else {
                    Critter.all[e].genes[feature] > highest ? highest = Critter.all[e].genes[feature] : Critter.all[e].genes[feature] < lowest ? lowest = Critter.all[e].genes[feature] : null;
                }
            }
            if (ifGrowing) {
                sum += Critter.all[e].genes.targetSize / Critter[feature + 'Init'];
            } else {
                sum += Critter.all[e].genes[feature] / Critter[feature + 'Init'];
                count++;
            }
        }
        highest = Math.round((highest / Critter[feature + 'Init']) * 100) / 100;
        lowest = Math.round((lowest / Critter[feature + 'Init']) * 100) / 100;
        avarege = Math.round((sum / count) * 100) / 100;
        if (isNaN(highest)) highest = 0;
        if (isNaN(lowest)) lowest = 0;
        if (isNaN(avarege)) avarage = 0;
        document.getElementById('P' + feature + 'H').innerHTML = highest;
        document.getElementById('P' + feature + 'L').innerHTML = lowest;
        document.getElementById('P' + feature + 'A').innerHTML = avarege;
    },
}
