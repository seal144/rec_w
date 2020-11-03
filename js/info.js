info = {
    plantsBugsQuantity: [],
    maxQuantityRecords: 360,
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
            info.quantityGraphUpdate();
            info.timer.statsUpdate = VAR.normalFps;
        } else info.timer.statsUpdate -= 1
    },
    plantsBugsUpdate: function () {
        const plantsBugs = [Object.keys(Plant.all).length, Object.keys(Critter.all).length];
        if (info.plantsBugsQuantity.length === info.maxQuantityRecords) {
            info.plantsBugsQuantity.shift();
            info.plantsBugsQuantity.push(plantsBugs);
        } else {
            info.plantsBugsQuantity.push(plantsBugs);
        }
        document.getElementById('Pplants').innerHTML = plantsBugs[0];
        document.getElementById('Pbugs').innerHTML = plantsBugs[1];
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
        let numberOfCritters = Object.keys(Critter.all).length;
        for (e in Critter.all) {
            if (!highest) {
                highest = Critter.all[e].genes[feature];
                lowest = Critter.all[e].genes[feature];
            } else {
                Critter.all[e].genes[feature] > highest ? highest = Critter.all[e].genes[feature] : Critter.all[e].genes[feature] < lowest ? lowest = Critter.all[e].genes[feature] : null;
            }
            sum += Critter.all[e].genes[feature] / Critter[feature + 'Init'];
            count++;
        }
        highest = Math.round((highest / Critter[feature + 'Init']) * 100) / 100;
        lowest = Math.round((lowest / Critter[feature + 'Init']) * 100) / 100;
        avarege = Math.round((sum / numberOfCritters) * 100) / 100;
        if (!numberOfCritters) highest = 0;
        if (!numberOfCritters) lowest = 0;
        if (!numberOfCritters) avarege = 0;
        document.getElementById('P' + feature + 'H').innerHTML = highest;
        document.getElementById('P' + feature + 'L').innerHTML = lowest;
        document.getElementById('P' + feature + 'A').innerHTML = avarege;
    },
    initQuantityGrapth: function () {
        info.canvasQG = document.createElement('canvas');
        info.ctxQG = info.canvasQG.getContext('2d');
        info.canvasQG.id = 'quantityGraph'
        info.quantityGraphLayout()
        info.ctxQG.lineJoin = 'round';
        document.getElementById('infoBar').appendChild(info.canvasQG);
    },
    quantityGraphLayout: function () {
        if (VAR.W <= 700 || VAR.H <= 650) {
            info.canvasQG.width = 146;
            info.canvasQG.height = 146;
            info.ctxQG.lineWidth = 1;
        } else {
            info.canvasQG.width = 230;
            info.canvasQG.height = 230;
            info.ctxQG.lineWidth = 2;
        }
    },
    quantityGraphUpdate: function () {
        let highestValue;
        for (e in info.plantsBugsQuantity) {
            if (!highestValue) {
                highestValue = info.plantsBugsQuantity[e][0]
            } else {
                highestValue < info.plantsBugsQuantity[e][0] ? highestValue = info.plantsBugsQuantity[e][0] : null;
                highestValue < info.plantsBugsQuantity[e][1] ? highestValue = info.plantsBugsQuantity[e][1] : null;
            }
        }
        highestValue <= Plant.maxCount / 2 ? highestValue = Plant.maxCount / 2 + 10 : highestValue += 10;
        info.ctxQG.fillStyle = 'rgb(50,80,200)';
        info.ctxQG.fillRect(0, 0, info.canvasQG.width, info.canvasQG.height);
        drawLine('plants');
        drawLine('bugs');
        //
        function drawLine(lifeForm) {
            const index = lifeForm === 'plants' ? 0 : 1;
            info.ctxQG.strokeStyle = lifeForm === 'plants' ? 'rgb(80,200,50)' : 'rgb(200,80,50)';
            info.ctxQG.beginPath();
            info.ctxQG.moveTo(0, info.canvasQG.height - info.plantsBugsQuantity[0][index] / highestValue * info.canvasQG.height);
            for (let i = 1; i < info.plantsBugsQuantity.length; i++) {
                info.ctxQG.lineTo(i * (info.canvasQG.width / info.maxQuantityRecords), info.canvasQG.height - info.plantsBugsQuantity[i][index] / highestValue * info.canvasQG.height);
            }
            info.ctxQG.stroke();
        }
    },
    setInfoBar: function () {
        info.initQuantityGrapth();
        if (VAR.W <= 700 || VAR.H <= 650) {
            document.querySelector('#infoBar').style.width = '170px';
            //
            document.querySelector('#statsNames').style.padding = '.5rem';
            document.querySelector('#statsNames').style.width = '150px';
            document.querySelector('#stats').style.padding = '.5rem';
            document.querySelector('#stats').style.width = '150px';
            //
            document.querySelectorAll('#infoBar p').forEach(function (e) {
                e.style.fontSize = '1.1rem';
            })
            document.querySelector('button').style.width = '45px';
            document.querySelectorAll('buttom').forEach(function (e) {
                e.style.fontSize = '1rem';
            })
            document.querySelectorAll('button.animSpeed').forEach(function (e) {
                e.style.width = '35px';
            })
            //
            document.querySelector('canvas#quantityGraph').style.left = '21px';
            document.querySelector('canvas#quantityGraph').style.bottom = '1px';
        } else {
            document.querySelector('#infoBar').setAttribute('style', 'width:260px');
            //
            document.querySelector('#statsNames').style.padding = '2rem';
            document.querySelector('#statsNames').style.width = '240px';
            document.querySelector('#stats').style.padding = '2rem';
            document.querySelector('#stats').style.width = '240px';
            //
            document.querySelectorAll('#infoBar p').forEach(function (e) {
                e.style.fontSize = '1.3rem';
            })
            //
            document.querySelector('button').style.width = '90px';
            document.querySelectorAll('button.animSpeed').forEach(function (e) {
                e.style.width = '50px';
            })
            //
            document.querySelector('canvas#quantityGraph').style.left = '25px';
            document.querySelector('canvas#quantityGraph').style.bottom = '5px';
        }
        document.querySelector('#infoBar').style.left = '-260px';
        document.querySelector('#infoBar').style.height = String(VAR.H) + 'px';
        document.querySelector('#showInfoBar').style.height = String(VAR.H) + 'px';
        document.querySelector('#sideToggler').style.height = String(VAR.H) + 'px';
    },
    setSettingsInfo: function () {
        document.getElementById('startSettingsInfo').style.top = String(VAR.H) + 'px';
        document.getElementById('startSettingsInfo').style.width = String(VAR.W * .6) + 'px';
        document.getElementById('startSettingsInfo').style.left = String(VAR.W * .4) + 'px';
        document.getElementById('startSettingsInfo').style.textAlign = 'right';
        if (VAR.W <= 700 || VAR.H <= 650) {
            document.getElementById('startSettingsInfo').style.fontSize = '.8rem';
            document.getElementById('startSettingsInfo').style.paddingRight = '.4rem';
        } else {
            document.getElementById('startSettingsInfo').style.fontSize = '1rem';
            document.getElementById('startSettingsInfo').style.paddingRight = '.5rem';
        }
        //
        if (window.sessionStorage.length > 0) {
            document.getElementById('startSettingsInfo').innerHTML = 'START SETTINGS: start genes: ' + window.sessionStorage.startSpeedRatio + ' , ' + window.sessionStorage.startSizeRatio + ' , ' + window.sessionStorage.startSensesRatio + ' , ' + window.sessionStorage.startAggressionRatio + ' ; density of plants: ' + Math.round(window.sessionStorage.densityOfPlantsRatio * 100) / 100 + ' ; speed of evolution: ' + Math.round(window.sessionStorage.speedOfEvolutionRatio * 100) / 100 + ' ; endless evolution: ' + (window.sessionStorage.endlessEvolution ? 'yes' : 'no');
        }

    },
};
