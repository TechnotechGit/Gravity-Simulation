function drawCircle(ctx, x, y, radius, zoom, fill, stroke, strokeWidth) {
    ctx.beginPath()
    this.x = x
    this.y = y

    // this.location = function () {
    //     return this.x
    // }

    this.l = function () {
        return [this.x, this.y]
    }

    this.draw = function (zoom) {
        ctx.arc(this.x, this.y, radius * (zoom * 0.01), 0, 2 * Math.PI, false)
        if (fill) {
            ctx.fillStyle = fill
            ctx.fill()
        }
        if (stroke) {
            ctx.lineWidth = strokeWidth
            ctx.strokeStyle = stroke
            ctx.stroke()
        }
    }

    this.update = function (x, y, zoom) {
        // ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        this.x = x
        this.y = y
        this.draw(zoom);
    }


    this.draw()
}

function drawTriangle(ctx, x, y, radius, zoom, fill, angle) {
    this.x = x
    this.y = y

    // this.location = function () {
    //     return this.x
    // }

    // coords

    let top = new vector2D(0, 0)
    let bottomL = new vector2D(0, 0)
    let bottomR = new vector2D(0, 0)
    this.l = function () {
        return [this.x, this.y]
    }

    this.draw = function (zoom) {
        // console.log(new vector2D(radius * Math.sin((240 + angle) * (180 / Math.PI)) + x, radius * Math.cos((240 + angle) * (180 / Math.PI))))
        // ctx.arc(top.x, top.y, radius * (zoom * 0.01), 0, 2 * Math.PI, false)
        ctx.beginPath()
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(bottomL.x, bottomL.y);
        ctx.lineTo(bottomR.x, bottomR.y);
        ctx.lineTo(top.x, top.y);
        ctx.closePath();
        ctx.strokeStyle = fill;
        ctx.stroke();
        ctx.fillStyle = fill
        ctx.fill()
    }

    this.update = function (x, y, zoom, angle, zoomScalar) {
        // ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        this.x = x
        this.y = y
        rad = (radius * zoomScalar) + (radius * (zoom * 0.01) * (1 - zoomScalar))
        top.x = rad * Math.sin((0 + angle) * (Math.PI / 180)) + x
        top.y = -rad * Math.cos((0 + angle) * (Math.PI / 180)) + y
        bottomL.x = rad * Math.sin((120 + angle) * (Math.PI / 180)) + x
        bottomL.y = -rad * Math.cos((120 + angle) * (Math.PI / 180)) + y
        bottomR.x = rad * Math.sin((240 + angle) * (Math.PI / 180)) + x
        bottomR.y = -rad * Math.cos((240 + angle) * (Math.PI / 180)) + y

        this.draw(zoom);
    }


    this.draw()
}

const mMass = 10

let centerX = 0
let centerY = 0

let soften = 0.1

let zoom = 10
let zoomScale = 0.001

class vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class rgb {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

class object2D {
    constructor(pos, velocity, mass, radius) {
        this.pos = pos
        this.velocity = velocity
        this.mass = mass
        this.radius = radius
    }
}

/**
 *  @function lerp
 *  @param {a} start number
 *  @param {b} end number
 *  @param {t} speed multiplier
 */
function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

let colorPalette = [
    new rgb(51, 153, 255),
    new rgb(0, 100, 210),
    new rgb(115, 230, 20),
    new rgb(0, 204, 136),
    new rgb(255, 170, 20),
]

let initial = {
    0: new object2D(new vector2D(0, 0), [0, 0], 10000, 40),
}

// let initial = {
//     0: new object2D(new vector2D(0, 0), [0, 0], 5000000, 300),
//     1: new object2D(new vector2D(0, 20000), [250, 0], 10000, 40),

// }

let playerPos = new vector2D(0, 10000)
let playerV = new vector2D(10, 0)

// let initial = {
//     0: new object2D(new vector2D(0, 3000), [20, 0], 1, 5),
//     1: new object2D(new vector2D(-800, 0), [0, -10], 200, 20),
//     2: new object2D(new vector2D(800, 0), [0, 10], 200, 20),
//     3: new object2D(new vector2D(-800, 300), [26, 0], 0.0001, 2),
// }

// let initial = {
//     0: new object2D(new vector2D(0, 0), [0, 0], 5000000, 400),
//     1: new object2D(new vector2D(100000, -20000), [-100, 100], 5000000, 400),
//     2: new object2D(new vector2D(20000, 80000), [200, 0], 5000000, 400),
//     3: new object2D(new vector2D(-10000, 30000), [300, -200], 5000, 200),
//     4: new object2D(new vector2D(10000, 40000), [-300, -200], 5000, 200),
//     5: new object2D(new vector2D(80000, 10000), [-300, -200], 5000, 200),

// }





let index = 0;

let follow = false
let playerCam = false
function track() {
    // Get the checkbox
    follow = document.getElementById("switch").checked;
    // console.log(follow)
}

function trackPlayer() {
    // Get the checkbox
    playerCam = document.getElementById("camera").checked;
    // console.log(follow)
}

let cameraTracer = false
function cameraTracers() {
    cameraTracer = document.getElementById("screen").checked;
}

const indexHandler = function (e) {
    index = e.value;
    console.log(index)
}

// b - beginning position
// e - ending position
// i - your current value (0-99)
function getTween(b, e, i) {
    return b + ((i / 99) * (e - b));
}

let pMove = 0.5
let lastCamPos = new vector2D(0, 0)
let playerLocations = [new vector2D(playerPos.x, playerPos.y), new vector2D(playerPos.x, playerPos.y), new vector2D(playerPos.x, playerPos.y)]
let playerSL = []

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    // console.log(pos)

    let pos = []
    let velocity = [] // x, y
    let masses = []
    let rad = []

    let locations = []
    let screenLocations = []
    let colors = []

    for (let i = 0; i < Object.keys(initial).length; i++) {
        pos.push(initial[i].pos)
        velocity.push(initial[i].velocity)
        masses.push(initial[i].mass)
        rad.push(initial[i].radius)
        console.log(initial[i])
    }


    objects = []
    // console.log(pos[0])
    for (let i = 0; i < pos.length; i++) {
        colors.push(
            colorPalette[Math.floor(Math.random() * colorPalette.length)]
        )
    }
    for (let i = 0; i < pos.length; i++) {
        objects.push(new drawCircle(
            ctx,
            pos[i].x, pos[i].y,
            rad[i],
            zoom,
            `rgba(${colors[i].r}, ${colors[i].g}, ${colors[i].b}, 1)`
        ))
        locations.push([])
        screenLocations.push([])

    }
    // console.log(objects)

    // objects = [
    //     new drawCircle(
    //         ctx,
    //         pos[0][0], pos[0][1],
    //         20,
    //         zoom,
    //         "#888"
    //     ),
    //     new drawCircle(
    //         ctx,
    //         pos[1][0], pos[1][1],
    //         20,
    //         zoom,
    //         "#888"
    //     )
    // ]

    // let p = new drawCircle(
    //     ctx,
    //     1, 1,
    //     40,
    //     zoom,
    //     "#888"
    // )
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = '#181818';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // centerX = canvas.width / 2;
        // centerY = canvas.height / 2;
        // p.update(centerX, centerY, zoom)
    }
    resize()
    window.addEventListener('resize', resize)
    // console.log(canvas)
    let zoomTarget = 20
    $(document).bind('mousewheel', function (evt) {
        let delta = evt.originalEvent.wheelDelta
        zoomTarget += delta * 0.5
        // finalX += delta * ((zoom * zoomScale))
        //- (canvas.width / 2) * (zoom * zoomScale)
        // console.log(finalX)
        // console.log(zoom*zoomScale)
        if (zoomTarget <= 2) {
            zoomTarget = 2
        }
        console.log(zoomTarget)
    });

    let down = false;
    let initX = 0, initY = 0;
    let dragX = 0, dragY = 0
    let deltaX = 0, deltaY = 0
    let finalX = 0, finalY = 0

    let targetX = 0, targetY = 0
    let mouse = new vector2D(0, 0)

    $(canvas).bind("mousedown", function (e) {
        down = true
        initX = e.pageX, initY = e.pageY;
        dragX = e.pageX, dragY = e.pageY;
    });

    $(canvas).bind("mousemove", function (e) {
        // console.log(finalX)
        mouse.x = e.pageX
        mouse.y = e.pageY
        
        if (down == true) {
            dragX = e.pageX
            dragY = e.pageY;

            // deltaX = dragX - initX, deltaY = dragY - initY;
            // initX = e.pageX, initY = e.pageY;
            // console.log("X: "+dragX+" Y: "+dragY);
            // console.log("X: " + deltaX + " Y: " + deltaY);
            // if (follow == false) {
            //     targetX += (deltaX / zoom) * 30
            //     targetY += (deltaY / zoom) * 30
            // }


        }
    });

    $(canvas).bind("mouseup", function () {
        down = false
        pos.push(new vector2D((initX - (canvas.width / 2)) * zoom, 100))
        // pos.push(new vector2D(finalX + (initX * (zoom * 2.5)) - (canvas.width / 2), -(initY - (canvas.height / 2)) * (zoom * 2.5) + finalY))
        velocity.push([dragX - initX, -dragY + initY])
        masses.push(10)
        rad.push(20)
        
        console.log(cameraPos.x * zoom * 0.1, finalX * zoom * 0.1)
        // console.log(-(canvas.width / 2) + finalX * (zoom * zoomScale) + initX)

        colors.push(
            colorPalette[Math.floor(Math.random() * colorPalette.length)]
        )

        objects.push(new drawCircle(
            ctx,
            pos[pos.length - 1].x, pos[pos.length - 1].y,
            rad[pos.length - 1],
            zoom,
            `rgba(${colors[pos.length - 1].r}, ${colors[pos.length - 1].g}, ${colors[pos.length - 1].b}, 1)`
        ))
        locations.push([])
        screenLocations.push([])
        // console.log(initial[i])
    });

    $('#switch').change(function () {
        console.log(true)
        if ($('#switch:checked').length) {
            $('#camera').attr('disabled', true);
            $('#camera').prop('checked', false);
            playerCam = document.getElementById("camera").checked;
        } else {
            $('#camera').removeAttr("disabled");
        }
    });


    let oMass = 1
    let angle = 0

    let pathRad = 100; // a number

    let startingTime;
    let lastTime;
    let totalElapsedTime;
    let elapsedSinceLastLoop = 0;

    let cameraPos = new vector2D(0, 0)

    let vx
    let vy

    let tween = 0;
    let lastIndex = 0;
    let flag = false;
    let tweenIndex = 0;

    let lastFollow = false
    if (lastFollow != follow) {
        screenLocations = []
        for (let i = 0; i < pos.length; i++) {
            screenLocations.push([])

        }
    }

    let player = new drawTriangle(
        ctx,
        0, 0,
        14,
        zoom,
        `rgba(255, 255, 255, 1)`,
        0
    )
    let pA = 0

    let keyState = {};
    window.addEventListener('keydown', function (event) {
        keyState[event.key] = true;
        // console.log(keyState)
    }, true);
    window.addEventListener('keyup', function (event) {
        keyState[event.key] = false;
        // console.log(keyState)
    }, true);

    // window.addEventListener("keypress", function (event) {
    //     if (event.defaultPrevented) {
    //         return; // Do nothing if the event was already processed
    //     }
    //     console.log(playerV)

    //     // Cancel the default action to avoid it being handled twice
    //     event.preventDefault();
    // }, true);
    let lerpScale = 0.4
    let gConstant = 0.01
    let camFollow = false


    let testObject = new drawCircle(
        ctx,
        0, 0,
        20,
        zoom,
        `rgb(255, 255, 255)`
    )

    let cMove = 2

        ; (() => {
            function main(currentTime) {
                let lerpN = Math.min(0.8 * zoom * zoomScale * (1 - lerpScale) + 0.8 * lerpScale, 1)

                // Zoom
                zoom = lerp(zoom, zoomTarget, 0.05)

                if (keyState["s"]) {
                    targetY -= cMove
                } if (keyState["w"]) {
                    targetY += cMove
                } if (keyState["d"]) {
                    targetX -= cMove
                } if (keyState["a"]) {
                    targetX += cMove
                }

                if (follow == true) {
                    camFollow = true
                    let follow2D = new vector2D(0, 0)
                    // console.log(parseInt(index) + " - index")
                    // console.log(objects.length + " - length")
                    if (!index || parseInt(index) >= objects.length || index < 0) {
                        follow2D.x = pos[lastIndex].x
                        follow2D.y = pos[lastIndex].y
                    } else {
                        follow2D.x = pos[index].x
                        follow2D.y = pos[index].y
                    }

                    finalX = -lerp(cameraPos.x, follow2D.x, lerpN) * (zoom * zoomScale)
                    finalY = lerp(cameraPos.y, follow2D.y, lerpN) * (zoom * zoomScale)
                    cameraPos.x = lerp(cameraPos.x, follow2D.x, lerpN)
                    cameraPos.y = lerp(cameraPos.y, follow2D.y, lerpN)

                    targetX = cameraPos.x
                    targetY = cameraPos.y

                } else if (playerCam == true) {
                    camFollow = true
                    // -((playerPos.x + lastCamPos.x) / 2 * (zoom * zoomScale))
                    finalX = -lerp(cameraPos.x, playerPos.x, lerpN) * (zoom * zoomScale)
                    finalY = lerp(cameraPos.y, playerPos.y, lerpN) * (zoom * zoomScale)
                    cameraPos.x = lerp(cameraPos.x, playerPos.x, lerpN)
                    cameraPos.y = lerp(cameraPos.y, playerPos.y, lerpN)

                    targetX = -cameraPos.x * (zoom * zoomScale)
                    targetY = cameraPos.y * (zoom * zoomScale)
                } else {
                    camFollow = false
                    finalX = lerp(cameraPos.x, targetX, 0.1) * (zoom * 0.1)
                    finalY = lerp(cameraPos.y, targetY, 0.1) * (zoom * 0.1)
                    cameraPos.x = lerp(cameraPos.x, targetX, 0.1)
                    cameraPos.y = lerp(cameraPos.y, targetY, 0.1)
                }

                // console.log(targetX * (zoom * zoomScale))
                if (!index || index >= objects.length || index < 0) {
                    lastIndex = lastIndex
                } else {
                    lastIndex = index
                }
                // console.table({ "playerPos": playerPos.x, "camPos": cameraPos.x, finalX: finalX })


                ctx.clearRect(0, 0, canvas.width, canvas.height);


                if (!startingTime) { startingTime = currentTime; }
                if (!lastTime) { lastTime = currentTime; }
                totalElapsedTime = (currentTime - startingTime);
                elapsedSinceLastLoop = (currentTime - lastTime);
                lastTime = currentTime;
                resize()

                if (down == true) {
                    ctx.beginPath()
                    ctx.lineWidth = `4`;
                    ctx.moveTo(initX, initY);
                    ctx.lineTo(dragX, dragY);
                    // console.table(initX, initY, dragX, dragY)
                    ctx.strokeStyle = `rgba(255, 255, 255, 1)`;
                    ctx.stroke();
                    ctx.closePath();
                }


                let sL = 100
                for (let i = 0; i < objects.length; i++) {
                    for (let k = 0; k < objects.length; k++) {
                        if (k == i) { } else {
                            distance = [pos[i].x - pos[k].x, pos[i].y - pos[k].y]
                            distanceCombined = Math.sqrt(distance[0] ** 2 + distance[1] ** 2)
                            // 6.67430 * (10 ** 0)
                            let forceX = ((gConstant) * masses[k] * 1) / (distanceCombined ** 2) * -distance[0]
                            let forceY = ((gConstant) * masses[k] * 1) / (distanceCombined ** 2) * -distance[1]

                            velocity[i] = [velocity[i][0] + (forceX), velocity[i][1] + forceY]
                        }
                    }

                    // console.table({ "distance": distance, "forceX": forceX, "forceY": forceY, "angle": angle, "vx": (forceX/oMass)*elapsedSinceLastLoop, "pos": pos })
                    let newX = (canvas.width / 2) + finalX + (pos[i].x * (zoom * zoomScale) + velocity[i][0] * (zoom * zoomScale))
                    let newY = (canvas.height / 2) + finalY - (pos[i].y * (zoom * zoomScale) + velocity[i][1] * (zoom * zoomScale))
                    pos[i] = new vector2D(pos[i].x + velocity[i][0], pos[i].y + velocity[i][1])

                    objects[i].update(newX, newY, zoom)
                    // if (i == objects.length - 1) console.log(pos[i])
                    // Location update
                    locations[i].push(new vector2D(pos[i].x, pos[i].y))
                    if (locations[i].length == 100) {
                        locations[i].shift()
                    }

                    // Screen location update
                    if (cameraTracer == true) {
                        screenLocations[i].push(new vector2D(newX, newY))
                        if (screenLocations[i].length == sL) {
                            screenLocations[i].shift()
                        }
                    }
                    // if (follow == true) {
                    //     lastFollow = true
                    //     screenLocations[i].push(new vector2D(newX, newY))
                    //     if (screenLocations[i].length == sL) {
                    //         screenLocations[i].shift()
                    //     }
                    // } else {
                    //     lastFollow = false
                    // }
                    // && follow == false
                    if (locations[i].length >= 2) {
                        // ctx.beginPath();
                        // ctx.lineWidth = "2";
                        // ctx.strokeStyle = `rgba(${colors[i].r}, ${colors[i].g}, ${colors[i].b}, 1)`;

                        for (let m = 1; m < locations[i].length; m++) {
                            ctx.beginPath();
                            // (40 * (0.01 * m) * (zoom * zoomScale)) * 0.1 + (80) * 0.9
                            ctx.lineWidth = `${(40 * (0.01 * m) * (zoom * zoomScale)) * 0.95 + (40 * (0.01 * m)) * 0.05}`;
                            ctx.strokeStyle = `rgba(${colors[i].r}, ${colors[i].g}, ${colors[i].b}, ${(0.01 * m)})`;
                            ctx.moveTo((canvas.width / 2) + finalX + locations[i][m - 1].x * (zoom * zoomScale), (canvas.height / 2) + finalY - locations[i][m - 1].y * (zoom * zoomScale));
                            ctx.lineTo((canvas.width / 2) + finalX + locations[i][m].x * (zoom * zoomScale), (canvas.height / 2) + finalY - locations[i][m].y * (zoom * zoomScale));
                            ctx.stroke();
                            ctx.closePath();
                        }

                        // for (let m = 1; m < locations[i].length; m++) {
                        //     if (Number.isInteger(m / 4) != true) {} else {
                        //         ctx.fillStyle = `rgba(${colors[i].r}, ${colors[i].g}, ${colors[i].b}, ${((1/locations[i].length) * m)})`;
                        //         ctx.beginPath();
                        //         ctx.arc(
                        //             (canvas.width / 2) + finalX + locations[i][m].x * (zoom * zoomScale),
                        //             (canvas.height / 2) + finalY - locations[i][m].y * (zoom * zoomScale),
                        //             `${200 * ((1/locations[i].length) * m) * (zoom * zoomScale)}`, 0, 2 * Math.PI, false
                        //         )
                        //         ctx.fill()
                        //     }
                        // }

                    }

                    if (screenLocations[i].length >= 3 && cameraTracer == true) {
                        // ctx.strokeStyle = `rgba(${colors[i].r}, ${colors[i].g}, ${colors[i].b}, 1)`;
                        for (let m = 1; m < screenLocations[i].length; m++) {
                            ctx.beginPath();
                            ctx.lineWidth = `${(30 * (1 / sL * m) * (zoom * zoomScale))}`;
                            ctx.moveTo(screenLocations[i][m - 1].x, screenLocations[i][m - 1].y);
                            ctx.strokeStyle = `rgba(${colors[i].r}, ${colors[i].g}, ${colors[i].b}, ${(1 / sL * m)})`;
                            ctx.lineTo(screenLocations[i][m].x, screenLocations[i][m].y);
                            ctx.stroke();
                            ctx.closePath();
                        }
                    }
                }

                for (let k = 0; k < objects.length; k++) {
                    distance = [playerPos.x - pos[k].x, playerPos.y - pos[k].y]
                    // console.table({"playerPos.x": playerPos.x, "playerPos.y": playerPos.y, "pos.x": pos[k].x, "pos.y": pos[k].y})
                    distanceCombined = Math.sqrt(distance[0] ** 2 + distance[1] ** 2)
                    // 6.67430 * (10 ** 0)
                    let fX = ((gConstant) * masses[k] * 1) / (distanceCombined ** 2) * -distance[0]
                    let fY = ((gConstant) * masses[k] * 1) / (distanceCombined ** 2) * -distance[1]

                    playerV.x = playerV.x + fX, playerV.y = playerV.y + fY
                }

                if (keyState["ArrowDown"]) {
                    playerV.y -= pMove
                } if (keyState["ArrowUp"]) {
                    playerV.y += pMove
                } if (keyState["ArrowLeft"]) {
                    playerV.x -= pMove
                } if (keyState["ArrowRight"]) {
                    playerV.x += pMove
                }
                playerLocations.push(new vector2D(playerPos.x, playerPos.y))
                if (playerLocations.length == 200) {
                    playerLocations.shift()
                }
                for (let m = 1; m < playerLocations.length; m++) {
                    ctx.beginPath();
                    ctx.lineWidth = `${20 * (0.01 * m) * (zoom * zoomScale)}`;
                    ctx.moveTo((canvas.width / 2) + finalX + playerLocations[m - 1].x * (zoom * zoomScale), (canvas.height / 2) + finalY - playerLocations[m - 1].y * (zoom * zoomScale));
                    ctx.strokeStyle = `rgba(255, 255, 255, ${(0.01 * m)})`;
                    ctx.lineTo((canvas.width / 2) + finalX + playerLocations[m].x * (zoom * zoomScale), (canvas.height / 2) + finalY - playerLocations[m].y * (zoom * zoomScale));
                    ctx.stroke();
                    ctx.closePath();
                }

                if (cameraTracer == true) {
                    playerSL.push(new vector2D(playerPos.x, playerPos.y))
                    if (playerSL.length == sL) {
                        playerSL.shift()
                    }
                    // console.log(playerSL)
                }
                if (playerSL.length >= 3 && cameraTracer == true) {
                    // ctx.strokeStyle = `rgba(${colors[i].r}, ${colors[i].g}, ${colors[i].b}, 1)`;
                    for (let m = 1; m < playerSL.length; m++) {
                        ctx.beginPath();
                        ctx.lineWidth = `${20 * (1 / sL * m) * (zoom * zoomScale)}`;
                        ctx.moveTo(playerSL[m - 1].x, playerSL[m - 1].y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${(1 / sL * m)})`;
                        ctx.lineTo(playerSL[m].x, playerSL[m].y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }

                if (playerV.y > 0) {
                    pA = 0 + Math.atan(-playerV.x / -playerV.y) * (180 / Math.PI)
                } else {
                    pA = 180 + Math.atan(-playerV.x / -playerV.y) * (180 / Math.PI)
                }

                

                player.update((canvas.width / 2) + finalX + playerPos.x * (zoom * zoomScale), (canvas.height / 2) + finalY - playerPos.y * (zoom * zoomScale), zoom, pA, 0.1)
                playerPos.x += playerV.x, playerPos.y += playerV.y

                testObject.update((canvas.width / 2) + finalX + ((mouse.x + (canvas.width / 2)) * (zoom * zoomScale)), 400, zoom)

                window.requestAnimationFrame(main);

                // Your main loop contents
            }

            main(); // Start the cycle
        })();
});

