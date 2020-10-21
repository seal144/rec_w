window.onload = function () {
    menu.init()
}
const main = {};
main.canvas = document.createElement('canvas');
main.ctx = main.canvas.getContext('2d');
//
const bugsInBackground = 200;
let densityOfPlants = 4;
let speedOfEvolution = 4;
//
menu = {
    init: function () {
        //
        menu.setLayout();
        window.addEventListener('resize', menu.setLayout, false);
        document.querySelector('#menuAbout').addEventListener('click', menu.showPage, false);
        document.querySelector('#menuSettings').addEventListener('click', menu.showPage, false);
        document.querySelector('#aboutBack').addEventListener('click', menu.showPage, false);
        document.querySelector('#settingsBack').addEventListener('click', menu.showPage, false);
        document.querySelector('#selectionBarDensity .leftTriangle').addEventListener('click', menu.selectionBarControl, false);
        document.querySelector('#selectionBarDensity .rightTriangle').addEventListener('click', menu.selectionBarControl, false);
        document.querySelector('#selectionBarEvolSpeed .leftTriangle').addEventListener('click', menu.selectionBarControl, false);
        document.querySelector('#selectionBarEvolSpeed .rightTriangle').addEventListener('click', menu.selectionBarControl, false);
        document.getElementById('endlessEvolution').addEventListener('click', menu.endlessEvolution, false);
        //
        document.body.appendChild(main.canvas);
        backgroundDraw(main.ctx);
        menu.setCritters()
        //
        menu.animation = setInterval(menu.animationLoop, 1000 / VAR.fps);
        //
        delete window.sessionStorage.startSpeedRatio;
        delete window.sessionStorage.startSizeRatio;
        delete window.sessionStorage.startSensesRatio;
        delete window.sessionStorage.startAggressionRatio;
        delete window.sessionStorage.densityOfPlantsRatio;
        delete window.sessionStorage.speedOfEvolutionRatio;
        delete window.sessionStorage.endlessEvolution;
        //
    },
    setLayout: function (ev) {
        VAR.W = window.innerWidth;
        VAR.H = window.innerHeight;
        main.canvas.width = VAR.W;
        main.canvas.height = VAR.H;
        //
        main.ctx.lineWidth = VAR.lineWidth;
        main.ctx.lineJoin = 'round';
    },
    setCritters: function () {
        for (let i = 0; i < bugsInBackground; i++) {
            new Critter(random(VAR.margin, VAR.W - VAR.margin), random(VAR.margin, VAR.H - VAR.margin), random(Critter.speedMin * 100, Critter.speedMax * 100) * .01, random(Critter.sizeMin * 100, Critter.sizeMax * 100) * .01, random(Critter.sensesMin * 100, Critter.sensesMax * 100) * .01, random(Critter.aggressionMin, Critter.aggressionMax))
        }
    },
    animationLoop: function () {
        for (e in Critter.all) {
            Critter.all[e].draw();
        }
        if (Object.keys(Critter.all).length < bugsInBackground) {
            new Critter(random(VAR.margin, VAR.W - VAR.margin), random(VAR.margin, VAR.H - VAR.margin), random(Critter.speedMin * 100, Critter.speedMax * 100) * .01, random(Critter.sizeMin * 100, Critter.sizeMax * 100) * .01, random(Critter.sensesMin * 100, Critter.sensesMax * 100) * .01, random(Critter.aggressionMin, Critter.aggressionMax))
        }
        backgroundFog(main.ctx);
    },
    showPage: function (ev) {
        let emergingPage;
        let vanichingPage;
        if (ev.target === document.getElementById('menuAbout')) {
            emergingPage = 'about';
            vanichingPage = 'mainMenu';
        } else if (ev.target === document.getElementById('menuSettings')) {
            emergingPage = 'settings';
            vanichingPage = 'mainMenu';
        } else if (ev.target === document.getElementById('aboutBack')) {
            emergingPage = 'mainMenu';
            vanichingPage = 'about';
        } else if (ev.target === document.getElementById('settingsBack')) {
            emergingPage = 'mainMenu';
            vanichingPage = 'settings';
            menu.setSettings();
        }
        document.getElementById(emergingPage).style.transform = 'translateY(0)';
        document.getElementById(emergingPage).style.opacity = '1';
        //
        document.getElementById(vanichingPage).style.transform = 'translateY(-100vw)';
        document.getElementById(vanichingPage).style.opacity = '0';
    },
    setSettings: function () {
        const speedRatio = document.getElementById('inputSpeed').value > 3 ? 3 : document.getElementById('inputSpeed').value < .334 ? .334 : document.getElementById('inputSpeed').value;
        const sizeRatio = document.getElementById('inputSize').value > 3 ? 3 : document.getElementById('inputSize').value < .334 ? .334 : document.getElementById('inputSize').value;
        const sensesRatio = document.getElementById('inputSenses').value > 3 ? 3 : document.getElementById('inputSenses').value < .334 ? .334 : document.getElementById('inputSenses').value;
        const aggressionRatio = document.getElementById('inputAggression').value > 2 ? 2 : document.getElementById('inputAggression').value < 0 ? 0 : document.getElementById('inputAggression').value;
        //
        window.sessionStorage.setItem('startSpeedRatio', speedRatio);
        window.sessionStorage.setItem('startSizeRatio', sizeRatio);
        window.sessionStorage.setItem('startSensesRatio', sensesRatio);
        window.sessionStorage.setItem('startAggressionRatio', aggressionRatio);
        //
        window.sessionStorage.densityOfPlantsRatio = 1 / densityOfPlants;
        //
        window.sessionStorage.speedOfEvolutionRatio = speedOfEvolution / 4;
    },
    selectionBarControl: function (ev) {
        if (ev.target === document.querySelector('#selectionBarDensity .leftTriangle')) {
            densityOfPlants = (densityOfPlants <= 1 ? 1 : densityOfPlants - 1);
            menu.selectionBarUpdate('#selectionBarDensity');
        } else if (ev.target === document.querySelector('#selectionBarDensity .rightTriangle')) {
            densityOfPlants = (densityOfPlants >= 7 ? 7 : densityOfPlants + 1);
            menu.selectionBarUpdate('#selectionBarDensity');
        } else if (ev.target === document.querySelector('#selectionBarEvolSpeed .leftTriangle')) {
            speedOfEvolution = (speedOfEvolution <= 1 ? 1 : speedOfEvolution - 1);
            menu.selectionBarUpdate('#selectionBarEvolSpeed');
        } else if (ev.target === document.querySelector('#selectionBarEvolSpeed .rightTriangle')) {
            speedOfEvolution = (speedOfEvolution >= 7 ? 7 : speedOfEvolution + 1);
            menu.selectionBarUpdate('#selectionBarEvolSpeed');
        }
    },
    selectionBarUpdate: function (target) {
        document.querySelectorAll(target + ' .active').forEach(function (e) {
            e.classList.add('notActive');
            e.classList.remove('active');
        });
        for (let i = 0; i < (target === '#selectionBarDensity' ? densityOfPlants : target === '#selectionBarEvolSpeed' ? speedOfEvolution : 0); i++) {
            const currentDiv = document.querySelector(target + ' .notActive');
            currentDiv.classList.add('active');
            currentDiv.classList.remove('notActive');
        }
    },
    endlessEvolution: function (ev) {
        if (!window.sessionStorage.endlessEvolution) {
            window.sessionStorage.endlessEvolution = true;
            document.getElementById('endlessEvolution').innerHTML = 'YES';
        } else if (window.sessionStorage.endlessEvolution) {
            delete window.sessionStorage.endlessEvolution;
            document.getElementById('endlessEvolution').innerHTML = 'NO';
        }
    }
}
