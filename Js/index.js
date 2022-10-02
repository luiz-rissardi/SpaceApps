
// function of the configurations of layers and the planet 
const configuratinsAndInital = function () {
    //this initial code is responsible for starting the wordwind canvas
    const wwd = new WorldWind.WorldWindow("canvasOne");
    // variables to using in layers
    const starFieldLayer = new WorldWind.StarFieldLayer();
    const atmosphereLayer = new WorldWind.AtmosphereLayer();
    const BMNGLayer = new WorldWind.BMNGLayer();
    const controller = new WorldWind.ViewControlsLayer(wwd);
    const coords = new WorldWind.CoordinatesDisplayLayer(wwd);

    // add layers
    wwd.addLayer(BMNGLayer);
    wwd.addLayer(starFieldLayer);
    wwd.addLayer(atmosphereLayer);
    wwd.addLayer(coords);
    wwd.addLayer(controller);

    //starting a startfild and atmosfere , for have a date 
    const date = new Date();
    starFieldLayer.time = date;
    atmosphereLayer.time = date;
    wwd.navigator.range = 50000000; // repositioning the initial visual height with respect to the planet to 70.000Km 
    wwd.redraw();
    return {
        wwd,
        starFieldLayer,
        atmosphereLayer,
    }// returning wordwind , starfild and atmosphere in object to use to later 
}

// function to the start simulation and stop
const startSimulation = function (check) {
    return function () {
        if (check.checked) {
            command.wwd.redrawCallbacks[1] = runSunSimulation;
        }
        else {
            command.wwd.redrawCallbacks[1] = stopSimulation;
        }
    }
}

//this function starts the simulation by assigning a value to the rotation
const runSunSimulation = function (wwd) {
    timeStep += (1.2*60*60);
    var date = new Date(timeStep);
    command.starFieldLayer.time = date;
    command.atmosphereLayer.time = date;
    wwd.redraw();
}
//this function stops the rotation, leaving the rotation constant
const stopSimulation = function (wwd) {
    timeStep = timeStep;
    const date = new Date(timeStep)
    command.starFieldLayer.time = date;
    command.atmosphereLayer.time = date;
    wwd.redraw();
}
// Add a ISS model
const startISS = function (wwd) {
    //create a layer of the ISS
    const modelLayer = new WorldWind.RenderableLayer("iss");
    wwd.addLayer(modelLayer);

    //seting the configurations of layer
    const position = new WorldWind.Position(10.0, -125.0, 4170000.0);
    const config = { dirPath: "../iss-dae/" };
    const colladaLoader = new WorldWind.ColladaLoader(position, config);
    colladaLoader.load("iss.dae", function (colladaModel) {
        colladaModel.scale = 500000;
        modelLayer.addRenderable(colladaModel);
    });
    return position
}

//get api coords
const dataApi = async function() 
{
    for ( ; ; ) 
    {
        const data = fetch("http://api.open-notify.org/iss-now.json")
        const teste2 = await data;
        const teste = await teste2.json();
        y = teste.iss_position.latitude;
        x = teste.iss_position.longitude;
        master(x,y)
    }
}

function master(x,y) {
        positionISS.longitude = x;
        positionISS.latitude = y;
        command.wwd.redraw()
        document.getElementById("latitute").value = y;
        document.getElementById("longitude").value = x;
}

//started variables
let timeStep = Date.now();
let positionISS;
let x;
let y;

//start Functions in Order 
const command = configuratinsAndInital();
positionISS = startISS(command.wwd);
dataApi();
const checkStartSimulatio = document.getElementById("onSimulation");
checkStartSimulatio.addEventListener("change", startSimulation(checkStartSimulatio))