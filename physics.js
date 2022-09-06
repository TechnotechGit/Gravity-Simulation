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

const mMass = 10

let centerX = 0
let centerY = 0

let soften = 0.1

let zoom = 80
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

let colorPalette = [
    new rgb(51, 153, 255),
    new rgb(0, 100, 210),
    new rgb(115, 230, 20),
    new rgb(0, 204, 136),
    new rgb(255, 170, 20),
]

let pos = {
    0: new vector2D(0, 0),
    1: new vector2D(0, 800),
    2: new vector2D(0, 2500),
    3: new vector2D(0, 1000),
    4: new vector2D(0, 700),
    5: new vector2D(500, 1800),
    6: new vector2D(400, 1700),
    7: new vector2D(2000, 1700),
    8: new vector2D(2000, 2400),
}
let velocity = [
    [0, 0], 
    [40, 0], 
    [20, 0], 
    [20, 0], 
    [20, 0], 
    [40, 0], 
    [40, 0], 
    [20, -40],
    [28, -40],
] // x, y
let masses = [1000, 1, 10, 1, 1, 2, 2, 200, 2]
let rad = [25, 10, 5, 5, 5, 5, 4, 20, 7]

let locations = [[], [], [], [], [], [], [], [], []]

let colors = []

let index = 0;


let follow = false
function track() {
    // Get the checkbox
    follow = document.getElementById("switch").checked;
    // console.log(follow)
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

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    // console.log(pos)

    objects = []
    // console.log(pos[0])
    for (let i = 0; i < Object.keys(pos).length; i++) {
        colors.push(
            colorPalette[Math.floor(Math.random() * colorPalette.length)]
        )
    }
    for (let i = 0; i < Object.keys(pos).length; i++) {
        objects.push(new drawCircle(
            ctx,
            pos[i].x, pos[i].y,
            rad[i],
            zoom,
            `rgba(${colors[i].r}, ${colors[i].g}, ${colors[i].b}, 1)`
        ))

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



    let oMass = 1
    let angle = 0

    let pathRad = 100; // a number

    let startingTime;
    let lastTime;
    let totalElapsedTime;
    let elapsedSinceLastLoop = 0;

    let vx
    let vy

    let tween = 0;
    let lastIndex = 0;
    let flag = false;
    let tweenIndex = 0;

    ; (() => {
        function main(currentTime) {
            if (follow == true) {
                // console.log(objects.length)
                if (!index || !lastIndex || index >= objects.length || index < 0) {
                    finalX = -(pos[lastIndex].x * (zoom * zoomScale))
                    finalY = (pos[lastIndex].y * (zoom * zoomScale))
                } else {
                    if (index != lastIndex) {
                        flag = true;
                        tweenIndex = lastIndex
                        tween = 0;
                    }
                    if (flag == true) {
                        if (tween <= 99) {
                            // console.table({ "tweenIndex": tweenIndex, "index": index, "pos[index].x": pos[index].x, "pos[tweenIndex].x": pos[tweenIndex].x })
                            // console.log(getTween(pos[index].x, pos[tweenIndex].x, tween))
                            finalX = -(getTween(pos[tweenIndex].x, pos[index].x, tween) * (zoom * zoomScale))
                            finalY = (getTween(pos[tweenIndex].y, pos[index].y, tween) * (zoom * zoomScale))
                            tween++
                        }
                        if (tween == 99) {
                            flag = false
                        }
                    } else {
                        finalX = -(pos[index].x * (zoom * zoomScale))
                        finalY = (pos[index].y * (zoom * zoomScale))
                    }
                }
            }
            if (!index || index > objects.length || index < 0) {
                lastIndex = lastIndex
                
            } else {
                lastIndex = index
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (!startingTime) { startingTime = currentTime; }
            if (!lastTime) { lastTime = currentTime; }
            totalElapsedTime = (currentTime - startingTime);
            elapsedSinceLastLoop = (currentTime - lastTime);
            lastTime = currentTime;
            resize()

            for (let i = 0; i < objects.length; i++) {
                for (let k = 0; k < objects.length; k++) {
                    if (k == i) { } else {
                        distance = [pos[i].x - pos[k].x, pos[i].y - pos[k].y]
                        distanceCombined = Math.sqrt(distance[0] ** 2 + distance[1] ** 2)
                        // 6.67430 * (10 ** 0)
                        let forceX = ((1) * masses[k] * 1) / (distanceCombined ** 2) * -distance[0]
                        let forceY = ((1) * masses[k] * 1) / (distanceCombined ** 2) * -distance[1]
                        
                        velocity[i] = [velocity[i][0] + (forceX), velocity[i][1] + forceY]
                    }
                }
                
                // console.table({ "distance": distance, "forceX": forceX, "forceY": forceY, "angle": angle, "vx": (forceX/oMass)*elapsedSinceLastLoop, "pos": pos })
                let newX = (canvas.width / 2) + finalX + (pos[i].x * (zoom * zoomScale) + velocity[i][0] * (zoom * zoomScale))
                let newY = (canvas.height / 2) + finalY - (pos[i].y * (zoom * zoomScale) + velocity[i][1] * (zoom * zoomScale))
                pos[i] = new vector2D(pos[i].x + velocity[i][0], pos[i].y + velocity[i][1])
                
                objects[i].update(newX, newY, zoom)
                locations[i].push(new vector2D(pos[i].x, pos[i].y))
                if (locations[i].length == 100) {
                    locations[i].shift()
                }
                if (locations[i].length >= 2) {
                    // ctx.beginPath();
                    // ctx.lineWidth = "2";
                    ctx.strokeStyle = `rgba(${colors[i].r}, ${colors[i].g}, ${colors[i].b}, 1)`;

                    for (let m = 1; m < locations[i].length; m++) {
                        ctx.beginPath();
                        ctx.lineWidth = `${40 * (0.01 * m) * (zoom * zoomScale)}`;
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
            }
            window.requestAnimationFrame(main);

            // Your main loop contents
        }

        main(); // Start the cycle
    })();
});

