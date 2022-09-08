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
    constructor(vector, velocity, mass, radius) {
        this.pos = vector
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
    0: new object2D(new vector2D(0, 0), [0, 0], 5000000, 400),
    1: new object2D(new vector2D(0, 35000), [250, 0], 20000, 40),
    2: new object2D(new vector2D(0, 55000), [270, 0], 5000, 40),
    3: new object2D(new vector2D(0, 85000), [230, 0], 6000, 40),
}

let playerPos = new vector2D(0, 35500)
let playerV = new vector2D(250, 0)

// let initial = {
//     0: new object2D(new vector2D(0, 3000), [20, 0], 1, 5),
//     1: new object2D(new vector2D(-800, 0), [0, -10], 200, 20),
//     2: new object2D(new vector2D(800, 0), [0, 10], 200, 20),
//     3: new object2D(new vector2D(-800, 300), [26, 0], 0.0001, 2),
// }



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
    $(document).bind('mousewheel', function (evt) {
        let delta = evt.originalEvent.wheelDelta
        zoom += delta
        finalX += delta * ((zoom * zoomScale))
        //- (canvas.width / 2) * (zoom * zoomScale)
        // console.log(finalX)
        // console.log(zoom*zoomScale)
        if (zoom <= 2) {
            zoom = 2
        }
    });

    let down = false;
    let initX = 0, initY = 0;
    let dragX = 0, dragY = 0
    let deltaX = 0, deltaY = 0
    let finalX = 0, finalY = 0

    $(canvas).bind("mousedown", function (e) {
        down = true
        initX = e.pageX, initY = e.pageY;
    });

    $(canvas).bind("mousemove", function (e) {
        // console.log(finalX)
        if (down == true) {
            dragX = e.pageX
            dragY = e.pageY;

            deltaX = dragX - initX, deltaY = dragY - initY;
            initX = e.pageX, initY = e.pageY;
            // console.log("X: "+dragX+" Y: "+dragY);
            // console.log("X: " + deltaX + " Y: " + deltaY);
            if (follow == false) {
                finalX += deltaX
                finalY += deltaY
            }
        }
    });
    
    $(canvas).bind("mouseup", function () {
        down = false
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

    player = new drawTriangle(
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

    ; (() => {
        function main(currentTime) {
            let lerpN = Math.min(0.8 * zoom * zoomScale * (1 - lerpScale) + 0.8 * lerpScale, 1)
            // console.log(lastIndex)
            if (follow == true) {
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
                // if (index != lastIndex) {
                //     // flag = true;
                //     tweenIndex = lastIndex
                //     // tween = 0;
                // }
                finalX = -lerp(cameraPos.x, follow2D.x, lerpN) * (zoom * zoomScale)
                finalY = lerp(cameraPos.y, follow2D.y, lerpN) * (zoom * zoomScale)
                // if (flag == true) {
                // if (tween <= 99) {
                //     console.table({ "tweenIndex": tweenIndex, "index": index, "pos[index].x": pos[index].x, "pos[tweenIndex].x": pos[tweenIndex].x })
                //     console.log(getTween(pos[index].x, pos[tweenIndex].x, tween))
                //     finalX = -(getTween(pos[tweenIndex].x, pos[index].x, tween) * (zoom * zoomScale))
                //     finalY = (getTween(pos[tweenIndex].y, pos[index].y, tween) * (zoom * zoomScale))
                //     tween++
                // }
                // if (tween == 99) {
                //     flag = false
                // }
                //     } else {
                //         finalX = -(pos[index].x * (zoom * zoomScale))
                //         finalY = (pos[index].y * (zoom * zoomScale))
                //     }
                // }
                cameraPos.x = lerp(cameraPos.x, follow2D.x, lerpN)
                cameraPos.y = lerp(cameraPos.y, follow2D.y, lerpN)

                // console.table({ "playerPos": playerPos.x, "camPos": cameraPos.x, "x": follow2D.x })

                // }
            } else if (playerCam == true) {
                // -((playerPos.x + lastCamPos.x) / 2 * (zoom * zoomScale))
                finalX = -lerp(cameraPos.x, playerPos.x, lerpN) * (zoom * zoomScale)
                finalY = lerp(cameraPos.y, playerPos.y, lerpN) * (zoom * zoomScale)
                cameraPos.x = lerp(cameraPos.x, playerPos.x, lerpN)
                cameraPos.y = lerp(cameraPos.y, playerPos.y, lerpN)
            }
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
                    ctx.strokeStyle = `rgba(${colors[i].r}, ${colors[i].g}, ${colors[i].b}, 1)`;

                    for (let m = 1; m < locations[i].length; m++) {
                        ctx.beginPath();
                        ctx.lineWidth = `${20 * (0.01 * m) * (zoom * zoomScale)}`;
                        ctx.moveTo((canvas.width / 2) + finalX + locations[i][m - 1].x * (zoom * zoomScale), (canvas.height / 2) + finalY - locations[i][m - 1].y * (zoom * zoomScale));
                        ctx.strokeStyle = `rgba(${colors[i].r}, ${colors[i].g}, ${colors[i].b}, ${(0.01 * m)})`;
                        ctx.lineTo((canvas.width / 2) + finalX + locations[i][m].x * (zoom * zoomScale), (canvas.height / 2) + finalY - locations[i][m].y * (zoom * zoomScale));
                        ctx.stroke();
                        ctx.closePath();
                    }

                    // for (let m = 1; m < locations[i].length; m++) {
                    //     ctx.beginPath();
                    //     ctx.fillStyle = `rgba(${colors[i].r}, ${colors[i].g}, ${colors[i].b}, ${(0.01 * m)})`;
                    //     ctx.arc(
                    //         (canvas.width / 2) + finalX + locations[i][m].x * (zoom * zoomScale),
                    //         (canvas.height / 2) + finalY - locations[i][m].y * (zoom * zoomScale),
                    //         `${20 * (0.01 * m) * (zoom * zoomScale)}`, 0, 2 * Math.PI, false
                    //     )
                    //     ctx.fill()
                    // }

                }

                if (screenLocations[i].length >= 3 && cameraTracer == true) {
                    ctx.strokeStyle = `rgba(${colors[i].r}, ${colors[i].g}, ${colors[i].b}, 1)`;
                    for (let m = 1; m < screenLocations[i].length; m++) {
                        ctx.beginPath();
                        ctx.lineWidth = `${30 * (1 / sL * m) * (zoom * zoomScale)}`;
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
                console.log(playerSL)
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
            window.requestAnimationFrame(main);

            // Your main loop contents
        }

        main(); // Start the cycle
    })();
});

