//trezba zrobić porząek z maksymalną liczbą roślin
Plant.count = 0;
Plant.producingSeedsCount = 0;
Plant.all = {};
Plant.maxEnergy = 100;
Plant.reproduceAtEnergy = 70;
Plant.rootsRadius = window.sessionStorage.densityOfPlantsRatio ? (1 / (window.sessionStorage.densityOfPlantsRatio * 4)) * 140 : 35;
Plant.childCount = 1;
Plant.maxReproduceCount = 4;
Plant.maxCount = 0; //nadpisane w main.setPlants
Plant.findSpotAttempt = 3 //update in main.animationLoop by Plant.setFindSpotAttempt
//
Plant.ifTooClose = function (plantsAll, MaxDistance, seedXY) {
    for (e in plantsAll) {
        let dist = distance(seedXY, plantsAll[e].xy)
        if (dist <= MaxDistance) {
            return true
        }
    }
    return false;
}
//
Plant.setFindSpotAttempt = function () {
    const plantCount = Object.keys(Plant.all).length;
    if (plantCount < 300) {
        return 3;
    } else if (plantCount < 500) {
        return 2;
    } else {
        return 1;
    }
}
//
function Plant(x, y, energy) {
    Plant.count++;
    this.id = 'pl_' + Plant.count;
    Plant.all[this.id] = this;
    this.xy = [x, y];
    this.producingSeeds = false;
    this.reproduceCount = 0;
    this.energy = energy ? energy : random(1, 30);
    this.leafsAngles = this.setLeafsAngles();
    this.eatingCritters = [];
}
//
Plant.prototype.draw = function () {
    main.ctx.strokeStyle = 'white';
    main.ctx.beginPath()
    for (i = 0; i < this.leafsAngles.length; i++) {
        let pointXY = modPosition(this.xy, this.energy * .08, this.leafsAngles[i])
        main.ctx.moveTo(this.xy[0], this.xy[1]);
        main.ctx.lineTo(pointXY[0], pointXY[1]);
    }
    main.ctx.closePath();
    main.ctx.stroke();
    if (this.energy >= Plant.maxEnergy && this.reproduceCount < Plant.maxReproduceCount && Object.keys(Plant.all).length + (Plant.producingSeedsCount * Plant.childCount) <= Plant.maxCount) {
        this.producingSeeds = true;
        Plant.producingSeedsCount++;
    }
    if (this.energy < Plant.maxEnergy && !this.producingSeeds) this.grow();
    if (this.producingSeeds) this.reduce();
    if (this.energy <= Plant.reproduceAtEnergy && this.producingSeeds) {
        this.producingSeeds = false;
        Plant.producingSeedsCount--;
        this.reproduce();
    }
}
//
Plant.prototype.grow = function () {
    this.energy += .1;
}
Plant.prototype.reduce = function () {
    this.energy -= .1;
}
//
Plant.prototype.setLeafsAngles = function () {
    let angles = [];
    let tempAngle = 0;
    for (i = 0; true; i++) {
        if (i === 0) {
            tempAngle = random(20, 50);
            angles.push(tempAngle);
        } else {
            tempAngle += random(40, 100);
            if (tempAngle - 360 > angles[0] - 30) {
                break
            }
            angles.push(tempAngle);
        }
    }
    return angles;
}
//
Plant.prototype.reproduce = function () {
    for (let i = 0; i < Plant.childCount; i++) {
        let seedXY;
        let properSpot = false;
        for (let i = 0; i < 3; i++) {
            let seedThrowAngle = random(0, 360);
            let seedThrowingLength = random(1.1 * Plant.rootsRadius, 3 * Plant.rootsRadius);
            seedXY = modPosition(this.xy, seedThrowingLength, seedThrowAngle);
            if (
                seedXY[0] >= VAR.margin &&
                seedXY[0] <= VAR.W - VAR.margin &&
                seedXY[1] >= VAR.margin &&
                seedXY[1] <= VAR.H - VAR.margin &&
                !(Plant.ifTooClose(Plant.all, Plant.rootsRadius, seedXY))
            ) {
                properSpot = true;
                break;
            }
        }
        if (properSpot) {
            this.reproduceCount += 1;
            new Plant(seedXY[0], seedXY[1])
        }
    }
}
