'use strict';



var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "block";
        }
    });
}








// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events;

// create an engine
var engine = Engine.create();

var canWidth = 1000,
    canHeight = 600;
var objectSides = 0,
    objectSize = 50,
    objectDensity = 0.001,
    objectRestitution = 0.4,
    objectFriction = 0.1,
    objectColor = "#ff8000",
    objectOpacity = 1,
    objectOutlineWidth = 0,
    objectOutlineColor = "#000000";
var tool = 0;
var running = true;

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: canWidth,
        height: canHeight,
        pixelRatio: 1,
        background: '#cccccc',
        wireframes: false,
        wireframeBackground: '#222',
        hasBounds: false,
        enabled: true,
        showSleeping: true,
        showDebug: false,
        showBroadphase: false,
        showBounds: false,
        showVelocity: false,
        showCollisions: false,
        showSeparations: false,
        showAxes: false,
        showPositions: false,
        showAngleIndicator: true,
        showIds: false,
        showShadows: false,
        showVertexNumbers: false,
        showConvexHulls: false,
        showInternalEdges: false,
        showMousePosition: false
    }
});

// create ground & walls
var ground = Bodies.rectangle((canWidth * 0.5), canHeight, (canWidth + 10), 60, { isStatic: true }),
    wallA = Bodies.rectangle(0, ((canHeight * 0.5) + 5), 60, (canHeight + 10), { isStatic: true }),
    wallB = Bodies.rectangle(canWidth, (canHeight * 0.5), 60, (canHeight + 10), { isStatic: true }),
    roof = Bodies.rectangle((canWidth * 0.5), 0, (canWidth + 10), 60, { isStatic: true });

// add all of the bodies to the world
World.add(engine.world, [ground, wallA, wallB, roof]);
  
function spawnObject(x, y) {
    World.add(engine.world, [Bodies.polygon(
        x,
        y,
        objectSides,
        objectSize,
        {
            restitution: objectRestitution,
            friction: objectFriction,
            density: objectDensity,
            render: {
                fillStyle: objectColor,
                opacity: objectOpacity,
                lineWidth: objectOutlineWidth,
                strokeStyle: objectOutlineColor
            }
        }
    )]);
}

var wireToggled = 1;
function toggleWire() {
    if (wireToggled === 1) {
        render.options.wireframes = true;
        wireToggled = 0;
    } else {
        render.options.wireframes = false;
        wireToggled = 1;
    }
}

var angleToggled = 0;
function toggleAngle() {
    if (angleToggled === 1) {
        render.options.showAngleIndicator = true;
        angleToggled = 0;
    } else {
        render.options.showAngleIndicator = false;
        angleToggled = 1;
    }
}

var sideSlider = document.getElementById("sideSlider");
var sideIndicator = document.getElementById("sideTxt");
sideSlider.oninput = function () {
    if (this.value == 0) {
        objectSides = this.value;
        sideIndicator.innerHTML = "Circle";
    } else {
        objectSides = parseInt(this.value);
        objectSides += 2;
        sideIndicator.innerHTML = (objectSides + " Sides");
    }
};

var sizeSlider = document.getElementById("sizeSlider");
var sizeIndicator = document.getElementById("sizeTxt");
sizeSlider.oninput = function () {
    objectSize = this.value;
    sizeIndicator.innerHTML = ("Size: " + objectSize);
};

var densitySlider = document.getElementById("densitySlider");
var densityIndicator = document.getElementById("densityTxt");
densitySlider.oninput = function () {
    objectDensity = this.value;
    densityIndicator.innerHTML = ("Density: " + Math.floor(objectDensity * 10000));
};

var bounceSlider = document.getElementById("bounceSlider");
var bounceIndicator = document.getElementById("bounceTxt");
bounceSlider.oninput = function () {
    objectRestitution = this.value;
    bounceIndicator.innerHTML = ("Restitution: " + Math.floor(objectRestitution * 100) + "%");
};

var frictionSlider = document.getElementById("frictionSlider");
var frictionIndicator = document.getElementById("frictionTxt");
frictionSlider.oninput = function () {
    objectFriction = this.value;
    frictionIndicator.innerHTML = ("Friction: " + Math.floor(objectFriction * 100) + "%");
};

var colorInput = document.getElementById("colorInput");
colorInput.oninput = function () {
    objectColor = this.value;
};

var opacitySlider = document.getElementById("opacitySlider");
var opacityIndicator = document.getElementById("opacityTxt");
opacitySlider.oninput = function () {
    objectOpacity = this.value;
    opacityIndicator.innerHTML = ("Opacity: " + Math.floor(objectOpacity * 100) + "%");
};



var colorOutlineInput = document.getElementById("colorOutlineInput");

var sizeOutlineSlider = document.getElementById("sizeOutlineSlider");
var sizeOutlineIndicator = document.getElementById("sizeOutlineTxt");
sizeOutlineSlider.oninput = function () {
    objectOutlineWidth = this.value;
    if (this.value == 0) {
        objectOutlineColor = "rgba(0,0,0,0)";
    } else {
        objectOutlineColor = colorOutlineInput.value;
    }
    sizeOutlineIndicator.innerHTML = ("Outline Width: " + objectOutlineWidth);
};

colorOutlineInput.oninput = function () {
    objectOutlineColor = this.value;
};


// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
  
function setTool(n) {
    tool = n;
}

var mouse = Matter.Mouse.create(render.canvas);
var mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            type: "line",
            strokeStyle: "rgba(0,0,0,0.25)"
        }
    }
});
World.add(engine.world, mouseConstraint);

function clearWorld() {
    Matter.Composite.clear(engine.world);
    var ground = Bodies.rectangle((canWidth * 0.5), canHeight, (canWidth + 10), 60, { isStatic: true }),
        wallA = Bodies.rectangle(0, ((canHeight * 0.5) + 5), 60, (canHeight + 10), { isStatic: true }),
        wallB = Bodies.rectangle(canWidth, (canHeight * 0.5), 60, (canHeight + 10), { isStatic: true }),
        roof = Bodies.rectangle((canWidth * 0.5), 0, (canWidth + 10), 60, { isStatic: true });
    World.add(engine.world, [ground, wallA, wallB, roof]);
    World.add(engine.world, mouseConstraint);
}

Events.on(mouseConstraint, 'mousedown', function (event) {
    var mousePosition = event.mouse.position;
    if (tool === 0) {
        spawnObject(mousePosition.x, mousePosition.y);
    }
});

Events.on(mouseConstraint, 'startdrag', function (event) {
    if (tool === 2) {
        Matter.Composite.remove(engine.world, event.body);
    } else if (tool === 3) {
        event.body.restitution = objectRestitution;
        event.body.friction = objectFriction;
        event.body.density = objectDensity;
        event.body.render.fillStyle = objectColor;
        event.body.render.opacity = objectOpacity;
        event.body.render.lineWidth = objectOutlineWidth;
        event.body.render.strokeStyle = objectOutlineColor;
    } else if (tool === 4) {
        Matter.Body.setStatic(event.body, true);
    } else if (tool === 5) {
        if (event.body.isStatic) {
            Matter.Body.setStatic(event.body, false);
        } else {
            Matter.Body.setStatic(event.body, true);
        }
    }
});

var upPressed = false,
    downPressed = false,
    upPressed2 = false,
    downPressed2 = false;


window.addEventListener("keydown", function (e) {
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
    
function keyDownHandler(e) {
    if (e.key == "Up" || e.key == "ArrowUp" || e.key == "w" || e.key == "W") {
        upPressed = true;
    }
    if (e.key == "Down" || e.key == "ArrowDown" || e.key == "s" || e.key == "S") {
        downPressed = true;
    }
    
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d" || e.key == "D") {
        upPressed2 = true;
    }
    if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a" || e.key == "A") {
        downPressed2 = true;
    }
    
    if (tool === 4) {
        var mObject = mouseConstraint.body;
        if (upPressed) {
            Matter.Body.scale(mObject, 1, 1.05);
        } else if (downPressed) {
            Matter.Body.scale(mObject, 1, 0.95);
        }
        if (upPressed2) {
            Matter.Body.scale(mObject, 1.05, 1);
        } else if (downPressed2) {
            Matter.Body.scale(mObject, 0.95, 1);
        }
    }
}

function keyUpHandler(e) {
    if (e.key == "Up" || e.key == "ArrowUp" || e.key == "w" || e.key == "W") {
        upPressed = false;
    }
    if (e.key == "Down" || e.key == "ArrowDown" || e.key == "s" || e.key == "S") {
        downPressed = false;
    }
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d" || e.key == "D") {
        upPressed2 = false;
    }
    if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a" || e.key == "A") {
        downPressed2 = false;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

Events.on(mouseConstraint, 'enddrag', function (event) {
    if (tool === 4) {
        Matter.Body.setStatic(event.body, false);
    }
});


function pauseSim() {
    if (running) {
        engine.timing.timeScale = 0.0001;
        document.getElementById("pauseButton").innerHTML = "Play";
        running = false;
    } else {
        engine.timing.timeScale = 1;
        document.getElementById("pauseButton").innerHTML = "Pause";
        running = true;
    }
}