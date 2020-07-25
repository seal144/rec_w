function Critter(x, y, speed, size, senses, aggression, parentA, parentB) {
    Critter.count++;
    this.id = 'cr_' + Critter.count;
    Critter.all[this.id] = this;
    this.xy = [x, y];
    this.energy = random(300, 400); //200-300
    //
    this.parents = []
    this.parents[0] = parentA ? parentA : null;
    this.parents[1] = parentB ? parentB : null;
    //
    this.genes = {};
    this.genes.speed = speed ? speed : Critter.speedInit;
    this.genes.size = size ? size : Critter.sizeInit;
    this.genes.senses = senses ? senses : Critter.sensesInit;
    this.genes.aggression = aggression ? aggression : Critter.aggressionInit;
    this.genes.mainfeature = this.setMainFeature();
    if (this.parents[0]) {
        this.genes.targetSize = this.genes.size;
        this.genes.size = 0;
    }
    //
    this.hungryAtEnergy = this.genes.size / Critter.sizeInit * 350 + 350; // init:700, min: ~466, max: 1400;
    this.hornyAtEnergy = this.genes.size / Critter.sizeInit * 400 + 400; // init:800, min: ~533, max: 1600;
    this.sexEnergyLoss = this.genes.size / Critter.sizeInit * 200 + 200; // init:400, min: ~266, max: 800;
    //
    this.drawing = {};
    this.drawing.alfa = random(0, 360);
    this.drawing.newAlfa = this.drawing.alfa;
    this.drawing.transparency = 1;
    this.drawing.ayeColor = this.setAyeColor();
    this.drawing.fillColor = this.setFillColor();
    this.drawing.fastTurning = false;
    //
    this.didntShareList = {};
    //
    this.generation = parentA ? Math.max(parentA.generation + 1, parentB.generation + 1) : 1;
    this.state = !this.parents[0] ? 'hungry' : 'growing';
    this.timer = {
        changeAlfa: this.setTimer('changeAlfa'),
        seekGoal: this.setTimer('seekGoal'),
        lookForThreat: this.setTimer('lookForThreat'),
        copulate: 0,
        liveTime: ((240 + random(-30, +30)) + ((1 - this.genes.speed / Critter.speedMax) * 60)) * VAR.normalFps,
    };
}
//
Critter.prototype.setMainFeature = function () {
    const mainFeatureRatio = 1.2;
    const speedRatio = this.genes.speed / Critter.speedInit;
    const sizeRatio = this.genes.size / Critter.sizeInit;
    const sensesRatio = this.genes.senses / Critter.sensesInit;
    if (speedRatio > 1.2 && speedRatio > sizeRatio * mainFeatureRatio && speedRatio > sensesRatio * mainFeatureRatio) {
        console.log('speed!, ' + this.id);
        return 'speed';
    } else if (sizeRatio > 1.2 && sizeRatio > speedRatio * mainFeatureRatio && sizeRatio > sensesRatio * mainFeatureRatio) {
        console.log('size!, ' + this.id);
        return 'size';
    } else if (sensesRatio > 1.2 && sensesRatio > speedRatio * mainFeatureRatio && sensesRatio > sizeRatio * mainFeatureRatio) {
        console.log('senses!, ' + this.id);
        return 'senses';
    } else {
        return null;
    }
}
//
//DRAW CRITTER
//
Critter.prototype.draw = function () {
    this.drawBody();
    this.drawSenses();
    if (this.timer.liveTime <= 0) {
        this.state = 'dying';
    } else {
        this.timer.liveTime -= 1;
    }
    if (this.state != 'dying' && this.state != 'growing') {
        this.drawFieldOfView();
        if (this.timer.lookForThreat <= 0) {
            this.lookForThreat();
            this.timer.lookForThreat = this.setTimer('lookForThreat');
        } else this.timer.lookForThreat -= 1
    }
    this[this.state]();
}
//
Critter.prototype.drawBody = function () {
    if (this.state === 'horny' || this.goal instanceof Critter) main.ctx.strokeStyle = 'rgb(255,150,200)'
    else if (this.state === 'escaping') main.ctx.strokeStyle = 'rgb(255,255,100)'
    else main.ctx.strokeStyle = 'rgba(255,255,255,' + this.drawing.transparency + ')'
    main.ctx.fillStyle = this.drawing.fillColor;
    let sideAlfa = (1 - (this.genes.speed - Critter.speedMax) / (Critter.speedMin - Critter.speedMax)) * 70 + 90;
    let rearsideAlfa = sideAlfa + (180 - sideAlfa) / 2
    main.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        let temAlfa
        switch (i) {
            case 0:
                tempAlfa = this.drawing.alfa;
                break;
            case 1:
                tempAlfa = this.drawing.alfa + sideAlfa;
                break;
            case 2:
                tempAlfa = this.drawing.alfa + rearsideAlfa;
                break;
            case 3:
                tempAlfa = this.drawing.alfa + 180;
                break;
            case 4:
                tempAlfa = this.drawing.alfa - rearsideAlfa;
                break;
            case 5:
                tempAlfa = this.drawing.alfa - sideAlfa
                break
        }
        let xy = modPosition(this.xy, this.genes.size / 2, tempAlfa)
        i === 0 ? main.ctx.moveTo(xy[0], xy[1]) : main.ctx.lineTo(xy[0], xy[1]);
    }
    main.ctx.closePath();
    main.ctx.fill()
    main.ctx.stroke();
    if (this.genes.mainfeature === 'speed') {
        this.drawStreak();
    } else if (this.genes.mainfeature === 'size') {
        this.drawStripes(sideAlfa);
    } else if (this.genes.mainfeature === 'senses' && this.state !== 'growing') {
        this.drawWhiskers();
    }
}
//
Critter.prototype.drawStreak = function () {
    const faceXY = modPosition(this.xy, this.genes.size / 2, this.drawing.alfa);
    const backXY = modPosition(this.xy, this.genes.size / 2, this.drawing.alfa + 180);
    main.ctx.beginPath()
    main.ctx.moveTo(faceXY[0], faceXY[1]);
    main.ctx.lineTo(backXY[0], backXY[1]);
    main.ctx.stroke();
}
//
Critter.prototype.drawStripes = function (sideAlfa) {
    main.ctx.beginPath();
    main.ctx.moveTo(modPosition(this.xy, this.genes.size / 4, this.drawing.alfa + sideAlfa)[0], modPosition(this.xy, this.genes.size / 4, this.drawing.alfa + sideAlfa)[1]);
    main.ctx.lineTo(modPosition(this.xy, this.genes.size / 4, this.drawing.alfa - sideAlfa)[0], modPosition(this.xy, this.genes.size / 4, this.drawing.alfa - sideAlfa)[1]);
    main.ctx.stroke();
    main.ctx.beginPath()
    main.ctx.moveTo(modPosition(this.xy, this.genes.size / 3, this.drawing.alfa + (sideAlfa + 40))[0], modPosition(this.xy, this.genes.size / 3, this.drawing.alfa + (sideAlfa + 40))[1]);
    main.ctx.lineTo(modPosition(this.xy, this.genes.size / 3, this.drawing.alfa - (sideAlfa + 40))[0], modPosition(this.xy, this.genes.size / 3, this.drawing.alfa - (sideAlfa + 40))[1]);
    main.ctx.stroke()
}
//
Critter.prototype.drawWhiskers = function () {
    const whiskersLength = this.genes.senses * .2;
    for (let i = 0; i < 2; i++) {
        const aye = i === 0 ? 'left' : 'right';
        const ayeXY = modPosition(this.xy, this.genes.size / 4, this.drawing.alfa + (i === 0 ? +45 : -45));
        for (let j = 0; j < 3; j++) {
            let tempAlfa;
            switch (j) {
                case 0:
                    tempAlfa = this.drawing.alfa + (aye === 'left' ? +45 : -45);
                    break;
                case 1:
                    tempAlfa = this.drawing.alfa + (aye === 'left' ? +15 : -15);
                    break;
                case 2:
                    tempAlfa = this.drawing.alfa + (aye === 'left' ? +75 : -75);
                    break;
            }
            main.ctx.beginPath()
            main.ctx.moveTo(ayeXY[0], ayeXY[1])
            main.ctx.lineTo(modPosition(ayeXY, whiskersLength, tempAlfa)[0], modPosition(ayeXY, whiskersLength, tempAlfa)[1])
            main.ctx.stroke();
        }
    }
}
//
Critter.prototype.drawFieldOfView = function () {
    if (this.drawing.viewDrawTimer === undefined) this.drawing.viewDrawTimer = true;
    if (this.drawing.viewDrawAlfa === undefined) this.drawing.viewDrawAlfa = random(0, 360);
    if (this.drawing.viewDrawTimer) {
        main.ctx.strokeStyle = 'rgba(20,20,20,' + this.drawing.transparency + ')' //'rgb(20,20,20)'
        main.ctx.beginPath()
        main.ctx.arc(this.xy[0], this.xy[1], this.genes.size / 2 + this.genes.senses, Math.PI / 180 * (0 + this.drawing.viewDrawAlfa), Math.PI / 180 * (10 + this.drawing.viewDrawAlfa));
        main.ctx.stroke();
        main.ctx.strokeStyle = 'white';
        this.drawing.viewDrawTimer = false;
        this.drawing.viewDrawAlfa += 20
    } else {
        this.drawing.viewDrawTimer = true;
    }
}
//
Critter.prototype.drawSenses = function () {
    if (this.genes.senses > .1 * Critter.sensesMax) {
        main.ctx.fillStyle = this.drawing.ayeColor;
        if (this.state === 'horny' || this.goal instanceof Critter) main.ctx.strokeStyle = 'rgb(255,150,200)'
        else main.ctx.strokeStyle = 'rgba(255,255,255,' + this.drawing.transparency + ')'
        for (let i = 0; i < 2; i++) {
            let xy = modPosition(this.xy, this.genes.size / 4, this.drawing.alfa + (i === 0 ? +45 : -45));
            let ayeSize = (this.genes.size / Critter.sizeMax) * (this.genes.senses / 8);
            main.ctx.beginPath();
            main.ctx.arc(xy[0], xy[1], ayeSize, Math.PI / 180 * 0, Math.PI / 180 * 360);
            main.ctx.fill();
            main.ctx.stroke();
        }
    }
}
//
//COLOR OF CRITTER
//
Critter.prototype.setAyeColor = function () {
    let gbChannels = (1 - this.genes.aggression / Critter.aggressionMax) * 255;
    return 'rgba(220,' + gbChannels + ',' + gbChannels + ',' + this.drawing.transparency + ')';
}
//
Critter.prototype.setFillColor = function () {
    let r = (this.genes.speed / Critter.speedMax) * 250;
    let g = this.genes.targetSize ? (this.genes.targetSize / Critter.sizeMax) * 250 : (this.genes.size / Critter.sizeMax) * 250;
    let b = (this.genes.senses / Critter.sensesMax) * 250;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + this.drawing.transparency + ')';
}
//
//MOVING
//
Critter.prototype.energyOutgo = function () {
    const energyLoss = (this.genes.speed * this.genes.size + this.genes.senses) * .005; //2.4*21+32*0.005 = 0.412 (100energy spala w 12.1s)
    this.energy -= energyLoss;
    if (this.energy <= 0) {
        this.state = 'dying'
    }
}
//
Critter.prototype.changeAlfa = function (min, max) {
    if (this.drawing.alfa > 360) {
        this.drawing.alfa = this.drawing.alfa - 360;
    }
    if (this.drawing.alfa < 0) {
        this.drawing.alfa = 360 - Math.abs(this.drawing.alfa)
    }
    this.drawing.newAlfa = this.drawing.alfa + random(min ? min : -90, max ? max : 90);
    this.timer.changeAlfa = this.setTimer('changeAlfa');
}
//
Critter.prototype.go = function () {
    let turningAlfa = this.drawing.fastTurning ? this.genes.speed * 6 : this.genes.speed * 2;
    if (this.drawing.newAlfa != this.drawing.alfa) {
        if (Math.abs(this.drawing.newAlfa - this.drawing.alfa) <= turningAlfa) {
            this.drawing.alfa = this.drawing.newAlfa;
            this.drawing.fastTurning = false;
        } else this.drawing.newAlfa > this.drawing.alfa ? this.drawing.alfa += turningAlfa : this.drawing.alfa -= turningAlfa;
    }
    this.xy[0] = modPosition(this.xy, this.genes.speedRun ? this.genes.speedRun : this.genes.speed, this.drawing.alfa)[0];
    this.xy[1] = modPosition(this.xy, this.genes.speedRun ? this.genes.speedRun : this.genes.speed, this.drawing.alfa)[1];
    this.energyOutgo();
}
//
Critter.prototype.turningInPlace = function () {
    let turningAlfa = this.genes.speed * 6;
    if (this.drawing.alfa >= 270 && this.drawing.newAlfa <= 90) this.drawing.newAlfa += 360;
    if (this.drawing.alfa <= 90 && this.drawing.newAlfa >= 270) this.drawing.newAlfa -= 360;
    if (Math.abs(this.drawing.newAlfa - this.drawing.alfa) <= turningAlfa) {
        this.drawing.alfa = this.drawing.newAlfa;
    } else this.drawing.newAlfa > this.drawing.alfa ? this.drawing.alfa += turningAlfa : this.drawing.alfa -= turningAlfa;
    this.energyOutgo();
}
//
//ACT
//
Critter.prototype.growing = function () {
    if (this.genes.size >= this.genes.targetSize) {
        this.genes.size = this.genes.targetSize;
        delete this.genes.targetSize;
        this.state = 'hungry'
    } else {
        this.genes.size += this.genes.targetSize / VAR.normalFps / Critter.growingTimeS;
    }
}
//
Critter.prototype.escaping = function () {
    if (this.timer.escape <= 0) {
        delete this.genes.speedRun;
        delete this.timer.escape;
        delete this.threat;
        this.drawing.fastTurning = false;
        if (this.energy <= this.hungryAtEnergy) this.state = 'hungry'
        else this.state = 'horny';
    } else {
        const directionOfThreat = findAlfa(this.xy, this.threat.xy);
        this.newAlfa = directionOfThreat + (this.drawing.alfa < directionOfThreat ? -180 : +180);
        this.go()
        this.timer.escape -= 1;
    }
}
//
Critter.prototype.hungry = function () {
    this.seeking('plant');
}
//
Critter.prototype.horny = function () {
    this.seeking('lover');
}
//
Critter.prototype.seeking = function (goal) {
    this.go();
    if (this.timer.changeAlfa <= 0) this.changeAlfa();
    else this.timer.changeAlfa -= 1;
    if (this.timer.seekGoal <= 0) {
        if (this.xy[0] <= this.genes.size * .6 || this.xy[0] >= VAR.W - this.genes.size * .6 || this.xy[1] <= this.genes.size * .6 || this.xy[1] >= VAR.H - this.genes.size * .6) this.nearBorderAction();
        if (goal === 'plant') this.ifPlantInSight();
        else if (goal === 'lover') this.ifLoverInSight();
        this.timer.seekGoal = this.setTimer('seekGoal');
    } else this.timer.seekGoal -= 1;
    if (this.state === 'horny' && this.energy <= this.hungryAtEnergy) this.state = 'hungry';
}
//
Critter.prototype.goingToGoal = function () {
    if (this.drawing.alfa != this.drawing.newAlfa) {
        this.turningInPlace()
    } else if (this.goal instanceof Plant) {
        if (distance(this.xy, this.goal.xy) > this.genes.size / 2 + 5) {
            this.go();
        } else this.preEating()
    } else if (this.goal instanceof Critter) {
        if (distance(this.xy, this.goal.xy) > this.genes.size / 2 + this.goal.genes.size / 2) {
            this.go();
            if (distance(this.xy, this.goal.xy) < this.genes.size + this.goal.genes.size) this.drawing.newAlfa = findAlfa(this.xy, this.goal.xy) // korekta kąta
        } else this.setLovePosition()
    }
}
//
Critter.prototype.preEating = function () {
    if (this.goal.eatingCritters.length >= 2) {
        this.goal = null;
        this.state = 'hungry'
    } else if (this.goal.eatingCritters.length === 1) {
        this.goal.eatingCritters.push(this);
        this.shareOrTake();
        this.state = 'eating';
    } else {
        this.goal.eatingCritters.push(this);
        this.state = 'eating';
    }
}
Critter.prototype.shareOrTake = function () {
    const eaterA = this;
    const eaterB = this.goal.eatingCritters[0];
    for (let i = 0; i < 2; i++) {
        const eater = i === 0 ? eaterA : eaterB;
        const eaterOther = i === 0 ? eaterB : eaterA;
        if (eater.genes.aggression <= 33 && eater.didntShareList[eaterOther.id] >= 3) {
            eater.share = false;
        } else if (eater.genes.aggression > 33 && eater.genes.aggression <= 67 && eater.didntShareList[eaterOther.id] >= 2) {
            eater.share = false;
        } else if (eater.genes.aggrssion > 67 && eater.didntShareList[eaterOther.id] >= 1) {
            eater.share = false;
        } else eater.share = random(0, 100) >= this.genes.aggression ? true : false;
    }
    if (!eaterB.share) {
        if (!eaterA.didntShareList[eaterB.id]) eaterA.didntShareList[eaterB.id] = 1;
        else eaterA.didntShareList[eaterB.id] += 1;
        eaterA.cheated = true;
    }
    if (!eaterA.share) {
        if (!eaterB.didntShareList[eaterA.id]) eaterB.didntShareList[eaterA.id] = 1;
        else eaterB.didntShareList[eaterA.id] += 1;
        eaterB.cheated = true;
    }
}
//
Critter.prototype.eating = function () {
    const eaterOther = this.goal.eatingCritters.indexOf(this) === 0 ? this.goal.eatingCritters[1] : this.goal.eatingCritters[0];
    if (this.goal.eatingCritters.length === 1) this.energy += Critter.eatingSpeed;
    else if (this.goal.eatingCritters.length === 2 && this.cheated) this.energy += 0;
    else if (this.goal.eatingCritters.length === 2 && eaterOther.cheated) this.energy += Critter.eatingSpeed;
    else this.energy += Critter.eatingSpeed / 2;
    this.goal.energy -= Critter.eatingSpeed;
    if (this.goal.energy <= 0) {
        delete this.share;
        delete this.cheated;
        this.state = 'hungry';
        delete Plant.all[this.goal.id];
        this.goal = null;
        this.changeAlfa();
    } else if (this.energy >= this.hornyAtEnergy) {
        delete this.share;
        delete this.cheated;
        this.goal.eatingCritters.indexOf(this) === 0 ? this.goal.eatingCritters.shift() : this.goal.eatingCritters.pop();
        this.goal = null;
        this.state = 'horny';
    }
}
//
Critter.prototype.setLovePosition = function () {
    if (this.drawing.alfa !== this.drawing.newAlfa) {
        this.turningInPlace();
    }
    if (this.drawing.alfa === this.drawing.newAlfa && this.goal.drawing.alfa === this.goal.drawing.newAlfa) {
        if (!this.isParentA && !this.isParentB) {
            if (this.goal.isParentA) this.isParentB = true;
            else this.isParentA = true;
        } else if (this.isParentA) {
            if (this.drawing.alfa !== this.goal.drawing.alfa) this.drawing.newAlfa = this.goal.drawing.alfa;
        } else if (this.isParentB && distance(this.xy, this.goal.xy) >= this.genes.size / 10) {
            this.go();
            if (distance(this.xy, this.goal.xy) <= this.genes.size / 10) {
                this.energy -= this.sexEnergyLoss;
                this.goal.energy -= this.goal.sexEnergyLoss;
                this.copulating(1000);
                this.goal.copulating(2000);
            }
        }
    }
}
//
Critter.prototype.copulating = function (time) {
    if (this.state !== 'copulating') {
        this.state = 'copulating'
        this.timer.copulate = time / 1000 * VAR.normalFps;
    }
    if (this.timer.copulate <= 0) {
        if (this.isParentB) {
            delete this.isParentB;
        }
        if (this.isParentA) {
            delete this.isParentA;
            this.reproduce(this.xy, this, this.goal);
        }
        this.state = 'hungry';
        this.goal = null;
        this.changeAlfa();

    }
    this.timer.copulate -= 1;
}
//
Critter.prototype.reproduce = function (positionXY, parentA, parentB) {
    const babiesCount = Object.keys(Critter.all).length * 4 > Object.keys(Plant.all).length ? 0 : Object.keys(Critter.all).length < Math.round(VAR.startNumberCritters * .75) ? Critter.babiesMax : random(Critter.babiesMin, Critter.babiesMax);
    for (let i = 0; i < babiesCount; i++) {
        const bXY = [positionXY[0] + random(-parentA.genes.size / 2, parentA.genes.size / 2), positionXY[1] + random(-parentA.genes.size / 2, parentA.genes.size / 2)];
        let babieGenes = {}
        for (let j = 0; j < 3; j++) {
            const inheritanceCase = random(1, 3);
            const feature = j === 0 ? 'speed' : j === 1 ? 'size' : 'senses';
            const featureMod = 1 + random(-(Critter.affinityFactor / 2 * 100), Critter.affinityFactor / 2 * 100) * .01;
            if (inheritanceCase === 1) {
                babieGenes[feature] = parentA.genes[feature] * featureMod;
            } else if (inheritanceCase === 2) {
                babieGenes[feature] = parentB.genes[feature] * featureMod;
            } else if (inheritanceCase === 3) {
                babieGenes[feature] = (parentA.genes[feature] + parentA.genes[feature]) / 2 * featureMod;
            }
        }
        const aggressionCase = random(1, 3);
        const aggressionMod = random(-Critter.aggressionSpread / 2, Critter.aggressionSpread / 2)
        if (aggressionCase === 1) {
            babieGenes.aggression = parentA.genes.aggression + aggressionMod;
        } else if (aggressionCase === 2) {
            babieGenes.aggression = parentB.genes.aggression + aggressionMod;
        } else if (aggressionCase === 3) {
            babieGenes.aggression = (parentA.genes.aggression + parentB.genes.aggression) / 2 + aggressionMod;
        }
        //
        if (babieGenes.speed > Critter.speedMax) babieGenes.speed = Critter.speedMax;
        else if (babieGenes.speed < Critter.speedMin) babieGenes.speed = Critter.speedMin;
        if (babieGenes.size > Critter.sizeMax) babieGenes.size = Critter.sizeMax;
        else if (babieGenes.size < Critter.sizeMin) babieGenes.size = Critter.sizeMin;
        if (babieGenes.senses > Critter.sensesMax) babieGenes.senses = Critter.sensesMax;
        else if (babieGenes.senses < Critter.sensesMin) babieGenes.senses = Critter.sensesMin;
        if (babieGenes.aggression > Critter.aggressionMax) babieGenes.aggression = Critter.aggressionMax;
        else if (babieGenes.aggression < Critter.aggressionMin) babieGenes.aggression = Critter.aggressionMin;
        //
        new Critter(bXY[0], bXY[1], babieGenes.speed, babieGenes.size, babieGenes.senses, babieGenes.aggression, parentA, parentB)
    }
}
//
Critter.prototype.dying = function () {
    this.eraseFromRecords();
    this.drawing.ayeColor = this.setAyeColor();
    this.drawing.fillColor = this.setFillColor();
    if (this.drawing.transparency > 0) this.drawing.transparency -= .01;
    else delete Critter.all[this.id];
}
//
Critter.prototype.nearBorderAction = function () {
    // ponizsze warunki sa zwiazne z tym ze maksymalna zmiana kierunku robaczka w changeAlfa() wynosi 90, jeżeli zmiana zostala by zmieniona na więcej niz 90 stopni trzeba też wprowadzic zmiany w warunkach bo w wyjątkowych zytuacjach robaczki mglyby wyjsc poza ekran na dluzej
    if (this.xy[0] <= this.genes.size * .6 && ((180 < this.drawing.alfa && this.drawing.alfa < 360) || this.drawing.alfa < 0) && ((180 < this.drawing.newAlfa && this.drawing.newAlfa < 360) || this.drawing.newAlfa < 0)) {
        if (!this.drawing.fastTurning) {
            if (180 <= this.drawing.alfa && this.drawing.alfa <= 225) this.changeAlfa(-90, -45);
            else if (225 < this.drawing.alfa && this.drawing.alfa <= 270) this.changeAlfa(-135, -90);
            else if ((270 < this.drawing.alfa && this.drawing.alfa <= 315) || (-90 <= this.drawing.alfa && this.drawing.alfa <= -45)) this.changeAlfa(90, 135);
            else if ((315 < this.drawing.alfa && this.drawing.alfa <= 360) || (-45 < this.drawing.alfa && this.drawing.alfa <= 0)) this.changeAlfa(45, 90);
            this.drawing.fastTurning = true;
        }
    } else if (this.xy[0] >= VAR.W - this.genes.size * .6 && ((0 < this.drawing.alfa && this.drawing.alfa < 180) || this.drawing.alfa > 360) && ((0 < this.drawing.newAlfa && this.drawing.newAlfa < 180) || this.drawing.newAlfa > 360)) {
        if (!this.drawing.fastTurning) {
            if ((0 <= this.drawing.alfa && this.drawing.alfa <= 45) || (360 <= this.drawing.alfa && this.drawing.alfa <= 405)) this.changeAlfa(-90, -45);
            else if ((45 < this.drawing.alfa && this.drawing.alfa <= 90) || (405 < this.drawing.alfa && this.drawing.alfa <= 450)) this.changeAlfa(-135, -90);
            else if (90 < this.drawing.alfa && this.drawing.alfa <= 135) this.changeAlfa(90, 135);
            else if (135 < this.drawing.alfa && this.drawing.alfa <= 180) this.changeAlfa(45, 90);
            this.drawing.fastTurning = true;
        }
    } else if (this.xy[1] <= this.genes.size * .6 && (90 < this.drawing.alfa && this.drawing.alfa < 270) && (90 < this.drawing.newAlfa && this.drawing.newAlfa < 270)) {
        if (!this.drawing.fastTurning) {
            if (90 <= this.drawing.alfa && this.drawing.alfa <= 135) this.changeAlfa(-90, -45);
            else if (135 < this.drawing.alfa && this.drawing.alfa <= 180) this.changeAlfa(-135, -90);
            else if (180 < this.drawing.alfa && this.drawing.alfa <= 225) this.changeAlfa(90, 135);
            else if (225 < this.drawing.alfa && this.drawing.alfa <= 270) this.changeAlfa(45, 90);
            this.drawing.fastTurning = true;
        }
    } else if (this.xy[1] >= VAR.H - this.genes.size * .6 && ((270 < this.drawing.alfa && this.drawing.alfa <= 450) || (-90 <= this.drawing.alfa && this.drawing.alfa < 90)) && ((270 < this.drawing.newAlfa && this.drawing.newAlfa <= 450) || (-90 <= this.drawing.newAlfa && this.drawing.newAlfa < 90))) {
        if (!this.drawing.fastTurning) {
            if ((270 <= this.drawing.alfa && this.drawing.alfa <= 315) || (-90 <= this.drawing.alfa && this.drawing.alfa <= -45)) this.changeAlfa(-90, -45);
            else if ((315 < this.drawing.alfa && this.drawing.alfa <= 360) || (-45 < this.drawing.alfa && this.drawing.alfa <= 0)) this.changeAlfa(-135, -90);
            else if ((0 < this.drawing.alfa && this.drawing.alfa <= 45) || (360 < this.drawing.alfa && this.drawing.alfa <= 405)) this.changeAlfa(90, 135);
            else if ((45 < this.drawing.alfa && this.drawing.alfa <= 90) || (405 < this.drawing.alfa && this.drawing.alfa <= 450)) this.changeAlfa(45, 90);
            this.drawing.fastTurning = true;
        }
    }
}
//
//USING SENSES
//
Critter.prototype.ifPlantInSight = function () {
    let plantsInSight = [];
    for (e in Plant.all) {
        if (Plant.all[e].eatingCritters.length <= 1) {
            const dist = distance(this.xy, Plant.all[e].xy)
            if (dist <= this.genes.senses + this.genes.size / 2) {
                plantsInSight.push({
                    plant: Plant.all[e],
                    distance: dist
                })
            }
        }
    }
    if (plantsInSight.length > 0) {
        let closestPlant = plantsInSight.reduce(function (min, current) {
            if (current.distance < min.distance) return current;
            else return min;
        });
        this.goal = closestPlant.plant;
        this.drawing.newAlfa = findAlfa(this.xy, this.goal.xy);
        this.state = 'goingToGoal';
    }
}
//
Critter.prototype.ifLoverInSight = function () {
    const loverScent = this.genes.senses * 5 + this.genes.size / 2;
    let loverInSight = [];
    for (e in Critter.all) {
        let dist = distance(this.xy, Critter.all[e].xy);
        if (Critter.all[e].id != this.id && Critter.all[e].state === 'horny' && !Critter.all[e].goal && dist <= loverScent) {
            if (Critter.similarityCheck(this, Critter.all[e])) {
                loverInSight.push({
                    lover: Critter.all[e],
                    distance: dist
                })
            }
        }
    }
    if (loverInSight.length > 0) {
        let closestLover = loverInSight.reduce(function (min, current) {
            if (current.distance < min.distance) return current;
            else return min;
        })
        this.goal = closestLover.lover;
        this.goal.goal = this;
        this.drawing.newAlfa = findAlfa(this.xy, this.goal.xy);
        this.goal.drawing.newAlfa = findAlfa(this.goal.xy, this.xy);
        this.state = 'goingToGoal';
        this.goal.state = 'goingToGoal';
    }
}
//
Critter.prototype.lookForThreat = function () {
    for (e in Critter.all) {
        const dist = distance(this.xy, Critter.all[e].xy);
        const treatScent = this.genes.senses * 1.5 + this.genes.size / 2 + Critter.all[e].genes.size / 2;
        if (dist <= treatScent && Critter.all[e].state != 'growing' && Critter.all[e].genes.size >= this.genes.size * Critter.sizeThreatFactor) {
            const directionOfThreat = findAlfa(this.xy, Critter.all[e].xy);
            this.threat = Critter.all[e];
            this.eraseFromRecords();
            this.drawing.newAlfa = directionOfThreat + (this.drawing.alfa < directionOfThreat ? -180 : +180);
            this.timer.escape = VAR.normalFps * Critter.escapingTimeS;
            if (this.state != 'escaping') this.genes.speedRun = this.genes.speed * 1.3;
            this.drawing.fastTurning = true;
            this.state = 'escaping';
        }
    }
}
//
//OTHER
//
Critter.prototype.eraseFromRecords = function () {
    if (this.goal) {
        if (this.goal instanceof Critter) {
            if (this.goal.energy >= this.hungryAtEnergy) this.goal.state = 'horny'
            else this.goal.state = 'hungry'
            this.goal.goal = null;
        } else if (this.goal instanceof Plant && this.state === 'eating') {
            this.goal.eatingCritters.indexOf(this) === 0 ? this.goal.eatingCritters.shift() : this.goal.eatingCritters.pop();
        }
        this.goal = null;
    }
}
//
Critter.prototype.setTimer = function (timer) {
    if (timer === 'changeAlfa') {
        return VAR.normalFps * random(1, 3) / (this.genes.speed / Critter.speedInit);
    } else if (timer === 'seekGoal') {
        return VAR.normalFps * .5 / (this.genes.speed / Critter.speedInit);
    } else if (timer === 'lookForThreat') {
        return VAR.normalFps * .5 / (this.genes.speed / Critter.speedInit);
    }
}
//
//PROBLEMY:
//pomysleć o zróżnicowaniu wyglądu
//zwierzaki wchodzą w dziwny taniec godowy
//zmiejszyć skalę świata
//zrobić wykres
//stworzyć gatunki
//zrobić main menu
//jak rosliny nie mają miejsca to niech zieksza im sie statystyka ze sie rozmnozyly
//podpiąć pod sktrót info bar
