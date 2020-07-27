window.onload = function () {
    main.init()
}

let VAR = {
    fps: 20,
    normalFps: 20,
    W: 0,
    minW: 500,
    H: 0,
    minH: 500,
    scale: 1,
    lineWidh: 1,
    margin: 20,
    minNumberPlants: 6,
    startNumberPlants: 0,
    startNumberCritters: 0,
    addPlantSeconds: 1
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
main = {
    init: function () {
        main.canvas = document.createElement('canvas');
        main.ctx = main.canvas.getContext('2d');
        //
        main.setLayout();
        window.addEventListener('resize', main.layout, false);
        document.getElementById('stop').addEventListener('click', main.startStop, false);
        document.getElementById('x2').addEventListener('click', main.x2, false);
        document.getElementById('x4').addEventListener('click', main.x4, false);
        //
        document.body.appendChild(main.canvas);
        //
        main.backgroundDraw(); //pierwsze rysowanie z pełnym kryciem
        //
        main.stop = false;
        main.speedX2 = false;
        main.speedX4 = false;
        //
        main.setPlants();
        main.setCritters()
        //
        window.addEventListener('keydown', main.onKey, false);
        //
        main.animation = setInterval(main.animationLoop, 1000 / VAR.fps);
        VAR.timerNewPlant = VAR.addPlantSeconds * VAR.normalFps;
    },
    setLayout: function () {
        VAR.W = Math.max(window.innerWidth, VAR.minW);
        VAR.H = Math.max(window.innerHeight, VAR.minH);
        VAR.D = Math.min(VAR.W, VAR.H);
        //
        main.canvas.width = VAR.W;
        main.canvas.height = VAR.H;
        //
        main.ctx.lineWidth = VAR.lineWidh;
        main.ctx.lineJoin = 'round';
    },
    layout: function (ev) {
        console.log('main.layout():skalowanie canvasa w zaleznosci od resiza');
    },
    backgroundDraw: function () {
        main.ctx.fillRect(0, 0, VAR.W, VAR.H);
        main.ctx.lineWidth = 1;
        main.ctx.strokeRect(0, 0, VAR.W, VAR.H);
        main.ctx.lineWidth = VAR.lineWidh;
    },
    backgroundReset: function () { // wtóre rysowania
        main.ctx.fillStyle = 'rgba(0,0,0,.9)'
        main.ctx.fillRect(0, 0, VAR.W, VAR.H);
        main.ctx.lineWidth = 1;
        main.ctx.strokeStyle = 'white';
        main.ctx.strokeRect(0, 0, VAR.W, VAR.H);
        main.ctx.lineWidth = VAR.lineWidh;
    },
    animationLoop: function () {
        main.backgroundReset();
        for (e in Plant.all) {
            Plant.all[e].draw();
        }
        for (e in Critter.all) {
            Critter.all[e].draw();
        }
        if (VAR.timerNewPlant <= 0) {
            if (Object.keys(Plant.all).length <= Plant.maxCount / 5) {
                new Plant(random(VAR.margin, VAR.W - VAR.margin), random(VAR.margin, VAR.H - VAR.margin));
                VAR.timerNewPlant = VAR.addPlantSeconds * VAR.normalFps;
            }
        } else VAR.timerNewPlant -= 1;
        info.statsUpdate();
    },
    setPlants: function () {
        VAR.startNumberPlants = Math.max(VAR.minNumberPlants, Math.round(VAR.W * VAR.H * .00003));
        Plant.maxCount = Math.round(VAR.W * VAR.H * .001)
        for (let i = 0; i < VAR.startNumberPlants; i++) {
            new Plant(random(VAR.margin, VAR.W - VAR.margin), random(VAR.margin, VAR.H - VAR.margin), random(50, 80));
        }
    },
    setCritters: function () {
        VAR.startNumberCritters = Math.round(VAR.startNumberPlants / 3);
        for (let i = 0; i < VAR.startNumberCritters; i++) {
            new Critter(random(VAR.margin, VAR.W - VAR.margin), random(VAR.margin, VAR.H - VAR.margin));
        }
    },
    startStop: function () {
        if (!main.stop) {
            main.stop = true;
            document.getElementById('stop').innerHTML = 'START';
            clearInterval(main.animation)
        } else {
            main.stop = false;
            document.getElementById('stop').innerHTML = 'STOP';
            main.animation = setInterval(main.animationLoop, 1000 / VAR.fps);
        }
    },
    x2: function () {
        if (!main.speedX2) {
            if (main.stop) {
                main.stop = false;
                document.getElementById('stop').innerHTML = 'STOP';
            }
            main.speedX2 = true;
            main.speedX4 = false;
            document.getElementById('x2').innerHTML = 'X1';
            document.getElementById('x4').innerHTML = 'X4';
            VAR.fps = VAR.normalFps * 2;
            clearInterval(main.animation);
            main.animation = setInterval(main.animationLoop, 1000 / VAR.fps);
        } else {
            if (main.stop) {
                main.stop = false;
                document.getElementById('stop').innerHTML = 'STOP';
            }
            main.speedX2 = false;
            document.getElementById('x2').innerHTML = 'X2';
            VAR.fps = VAR.normalFps;
            clearInterval(main.animation);
            main.animation = setInterval(main.animationLoop, 1000 / VAR.fps);
        }
    },
    x4: function () {
        if (!main.speedX4) {
            if (main.stop) {
                main.stop = false;
                document.getElementById('stop').innerHTML = 'STOP';
            }
            main.speedX4 = true;
            main.speedX2 = false;
            document.getElementById('x4').innerHTML = 'X1';
            document.getElementById('x2').innerHTML = 'X2';
            VAR.fps = VAR.normalFps * 4;
            clearInterval(main.animation)
            main.animation = setInterval(main.animationLoop, 1000 / VAR.fps);
        } else {
            if (main.stop) {
                main.stop = false;
                document.getElementById('stop').innerHTML = 'STOP';
            }
            main.speedX4 = false;
            document.getElementById('x4').innerHTML = 'X4';
            VAR.fps = VAR.normalFps;
            clearInterval(main.animation)
            main.animation = setInterval(main.animationLoop, 1000 / VAR.fps);
        }
    },
    onKey: function (ev) {
        if (ev.keyCode === 32) {
            ev.preventDefault();
            main.startStop();
        } else if (ev.keyCode === 39) {
            ev.preventDefault();
            if (!main.speedX2 && !main.speedX4) {
                main.x2();
            } else if (main.speedX2) {
                main.x4();
            }
        } else if (ev.keyCode === 37) {
            ev.preventDefault();
            if (main.speedX4) {
                main.x2();
            } else if (main.speedX2) {
                main.x2();
            }
        } else if (ev.keyCode === 77) {
            ev.preventDefault();
            let menuChecked = document.querySelector('input.toggler#sideToggler').checked;
            if (!menuChecked) {
                document.querySelector('input.toggler#sideToggler').checked = true;
            } else {
                document.querySelector('input.toggler#sideToggler').checked = false;
            }
        }
    }
}


// KONTROWERSJE:
// PRZY ODPOWIEDNIEJ KORELACJI ILOSCI ZWIERZĄT DO ROSLIN, ZWIERZĘTA NIE WYDAJĄ POTOMSTWA
// PRZY BARDZO MALEJ ILOŚCI ROBAKÓW MIOT JEST ZAWSZE NAJWIĘKSZY





//main.ctx.scale(.5,.5)
//main.ctx
