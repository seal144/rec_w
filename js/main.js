window.onload = function () {
    main.init()
}
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
        document.getElementById('x10').addEventListener('click', main.x10, false);
        //
        document.body.appendChild(main.canvas);
        //
        backgroundDraw(main.ctx);
        //
        main.stop = false;
        main.speedX2 = false;
        main.speedX4 = false;
        main.speedX10 = false;
        //
        VAR.simulation = true;
        main.setPlants();
        main.setCritters();
        //
        window.addEventListener('keydown', main.onKey, false);
        //
        main.animation = setInterval(main.animationLoop, 1000 / VAR.fps);
        VAR.timerNewPlant = VAR.addPlantSeconds * VAR.normalFps;
        // 
        for (e in Species.namesTemplate) {
            Species.names[e] = copyArray(Species.namesTemplate[e]);
        };
        for (e in Species.names) {
            shuffleArray(Species.names[e]);
        }
    },
    setLayout: function () {
        VAR.W = Math.max( /*window.innerWidth*/ document.body.clientWidth, VAR.minW); //
        VAR.H = Math.max(window.innerHeight, VAR.minH);
        VAR.D = Math.min(VAR.W, VAR.H);
        //
        main.canvas.width = VAR.W;
        main.canvas.height = VAR.H;
        //
        main.ctx.lineWidth = VAR.lineWidth;
        main.ctx.lineJoin = 'round';
        info.setInfoBar();
        info.setSettingsInfo();
        Species.setLabels();
    },
    layout: function (ev) {
        console.log('main.layout():skalowanie canvasa w zaleznosci od resiza');
    },
    animationLoop: function () {
        backgroundReset(main.ctx);
        for (e in Plant.all) {
            Plant.all[e].draw();
        }
        for (e in Critter.all) {
            Critter.all[e].draw();
        }
        if (VAR.timerNewPlant <= 0) {
            if (Object.keys(Plant.all).length <= Plant.maxCount / 3) {
                new Plant(random(VAR.margin, VAR.W - VAR.margin), random(VAR.margin, VAR.H - VAR.margin));
                VAR.timerNewPlant = VAR.addPlantSeconds * VAR.normalFps;
            }
        } else VAR.timerNewPlant -= 1;
        info.statsUpdate();
        Plant.findSpotAttempt = Plant.setFindSpotAttempt();
    },
    setPlants: function () {
        VAR.startNumberPlants = Math.max(VAR.minNumberPlants, Math.round(VAR.W * VAR.H * .00003));
        Plant.maxCount = Math.round(VAR.W * VAR.H * (1 / Plant.rootsRadius) * 0.0115) //415
        for (let i = 0; i < VAR.startNumberPlants; i++) {
            new Plant(random(VAR.margin, VAR.W - VAR.margin), random(VAR.margin, VAR.H - VAR.margin), random(50, 80));
        }
    },
    setCritters: function () {
        VAR.startNumberCritters = Math.round(VAR.startNumberPlants / 3);
        for (let i = 0; i < VAR.startNumberCritters; i++) {
            new Critter(random(VAR.margin, VAR.W - VAR.margin), random(VAR.margin, VAR.H - VAR.margin), VAR.startGenesRatio.speed * Critter.speedInit, VAR.startGenesRatio.size * Critter.sizeInit, VAR.startGenesRatio.senses * Critter.sensesInit, VAR.startGenesRatio.aggression * Critter.aggressionInit);
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
            main.speedX10 = false;
            document.getElementById('x2').innerHTML = 'X1';
            document.getElementById('x4').innerHTML = 'X4';
            document.getElementById('x10').innerHTML = 'X10';
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
            main.speedX10 = false;
            document.getElementById('x4').innerHTML = 'X1';
            document.getElementById('x2').innerHTML = 'X2';
            document.getElementById('x10').innerHTML = 'X10';
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
    x10: function () {
        if (!main.speedX10) {
            if (main.stop) {
                main.stop = false;
                document.getElementById('stop').innerHTML = 'STOP';
            }
            main.speedX10 = true;
            main.speedX2 = false;
            main.speedX4 = false;
            document.getElementById('x10').innerHTML = 'X1';
            document.getElementById('x2').innerHTML = 'X2';
            document.getElementById('x4').innerHTML = 'X4';
            VAR.fps = VAR.normalFps * 10;
            clearInterval(main.animation)
            main.animation = setInterval(main.animationLoop, 1000 / VAR.fps);
        } else {
            if (main.stop) {
                main.stop = false;
                document.getElementById('stop').innerHTML = 'STOP';
            }
            main.speedX10 = false;
            document.getElementById('x10').innerHTML = 'X10';
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
            if (main.stop) {
                main.startStop()
            } else if (!main.speedX2 && !main.speedX4 && !main.speedX10) {
                main.x2();
            } else if (main.speedX2) {
                main.x4();
            } else if (main.speedX4) {
                main.x10();
            }
        } else if (ev.keyCode === 37) {
            ev.preventDefault();
            if (main.speedX10) {
                main.x4()
            } else if (main.speedX4) {
                main.x2();
            } else if (main.speedX2) {
                main.x2();
            } else if (!main.speedX2 && !main.stop) {
                main.startStop();
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
// POWIEKSZYLEM MAPE POPRZEZ POMNIEJSZENIE JEJ ELEMENTÓW: WIELKOŚĆ ROŚLIN(.8), ODLEGLOŚĆ MIEDZY ROSLINAMI(.7), SIZE ZWIERZATEK (~.85), SPEED ZWIERZATEK (~.75), ZWIEKSZONY WYDATEK NA PORUSZANIE (1.2-1.3)





//main.ctx.scale(.5,.5)
//main.ctx
