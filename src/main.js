import {
    pointsAlongLine,
    random
} from "./vector.js"

import {
    saveAs
} from './fileSaver.js';

/*********** 
steps:
1. background texture 
2. radius of dots
3. color picker 
4. line thickness 
5. undo redo 
6. pixelation
7. fill in color within shape 

create the color array to choose from - andy warhol style 
overlay the patterns on top/ overlay? or difference of the background 

**********/

/*********** 
questions:
1. how to create the patterns on top of a colored background
**********/



let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
//create pattern off screen 
let patternCanvas = document.getElementById("canvas");
let patternContext = canvas.getContext("2d");
patternCanvas.width = 50;
patternCanvas.height = 50;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let pixelRatio = 1; //remeber to change the brush x and y

let bg = document.getElementById("bg");

let urls = ["/assets/patterns_circle.png", "/assets/patterns_dots.png", "/assets/patterns_fill square.png", "/assets/patterns_spiral.png", "/assets/patterns_square.png", "/assets/patterns_x.png"];
let index = 0;
let bgImages = urls.map((url) => {
    const image = new Image();
    image.src = url;
    return image;
});

bgImages[0].addEventListener("load", render);
bg.addEventListener("click", function () {
    index = (bgImages.length + index + 1) % bgImages.length;
    render();

});

function render() {
    // patternContext.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
    // patternContext.fillStyle = `hsl(${Math.random()*255}, 80%, 50%)`;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let image = bgImages[index];

    var pattern = ctx.createPattern(image, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);


}


let restore = document.getElementById("undo");

let undoStack = [];
pushState();

restore.addEventListener("click", undo);

function undo() {
    if (undoStack.length > 1) {
        undoStack.pop();
    }
    let lastElemeent = undoStack[undoStack.length - 1];
    ctx.putImageData(lastElemeent, 0, 0);

}

function pushState() {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

    if (undoStack.length > 50) {
        undoStack.shift();
    }
}

ctx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
ctx.fillStyle = `hsl(${Math.random()*255}, 80%, 50%)`;

//random background when opening 

ctx.strokeStyle = "rgba(0,0,0,0.6)";
ctx.fillStyle = "rgba(0,0,0,0.6)";

let penDown = false;
let last_x = 0;
let last_y = 0;

function paintStart(x, y) {
    penDown = true;
    last_x = x;
    last_y = y;
}

//start the brush in the center of the shape
function norm_random(size) {
    return (Math.random() - 0.5) * size;
}

let state = "";


clear.addEventListener("click", function () {
    state = "clear";
    if (state === "clear") {

        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = `hsl(${Math.random()*255}, 80%, 50%)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // ctx.strokeStyle = "rgba(0,0,0,0.6)";
        // ctx.fillStyle = "rgba(0,0,0,0.6)";
    }
});

download.addEventListener("click", function () {
    state = "download";
    console.log("download!");
    canvas.toBlob(function (blob) {
        saveAs(blob, "emojiDrawing.png");
    });
})


function paintMove(x, y) {
    // let thickness = 3;
    // ctx.lineWidth = thickness;
    let rate = 20;
    let interpolatedPoints = pointsAlongLine(x, y, last_x, last_y, rate);


    //brush 
    //pink circle with contrasty rect in the center 
    // interpolatedPoints.forEach(function (p) {

    //     ctx.globalAlpha=0.2;

    //     ctx.beginPath();
    //     ctx.fillStyle = "rgba(0,0,0,0.7)";
    //     ctx.fillRect(p.x + norm_random(10), p.y + norm_random(10), norm_random(20), norm_random(10))

    //     ctx.fillStyle = "rgba(255,0,0,0.1)";
    //     ctx.arc(p.x + norm_random(20), p.y + norm_random(20),Math.abs(norm_random(100)), 0, Math.PI * 2);
    //     ctx.fill();
    //     });

    //brush two 
    //vertical lines and pink circles - cherry blossom 
    interpolatedPoints.forEach(function (p) {
        ctx.beginPath();
        ctx.fillStyle = "pink";
        ctx.arc(p.x + norm_random(10), p.y + norm_random(10), Math.abs(random(15)), Math.PI * norm_random(1), Math.PI * norm_random(2));
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillRect(p.x + norm_random(20), p.y + norm_random(10), 2, 10)

    });


    //brush three 
    // animating the circle when it is drawn - revealing the circle rather than drawing? 
    // created soft circles 
    // interpolatedPoints.forEach(function (p) {
    //     ctx.beginPath();
    //     // ctx.fillStyle/(0,0,0,0.2)
    //     ctx.arc(p.x+norm_random(10), p.y+norm_random(10), Math.abs(random(15)), Math.PI*norm_random(1), Math.PI * norm_random(2));
    //     ctx.fill();

    // });

    last_x = x;
    last_y = y;
}

function paintEnd(x, y) {
    pushState();
}

canvas.addEventListener("mousedown", function (evt) {
    let x = evt.clientX * pixelRatio;
    let y = evt.clientY * pixelRatio;
    paintStart(x, y);
});

canvas.addEventListener("touchstart", function (evt) {
    let touches = Array.from(evt.touches);
    let touch = touches[0];
    paintStart(touch.clientX * pixelRatio, touch.clientY(pixelRatio));
});

canvas.addEventListener("mousemove", function (evt) {
    if (penDown === false) {
        return;
    }

    let x = evt.clientX * pixelRatio;
    let y = evt.clientY * pixelRatio;
    paintMove(x, y);
});

canvas.addEventListener("touchmove", function (evt) {
    evt.preventDefault();

    let touches = Array.from(evt.touches);
    let touch = touches[0];

    let x = touch.clientX * pixelRatio;
    let y = touch.clientY * pixelRatio;
    paintMove(x, y);
});

canvas.addEventListener("touchend", function (evt) {
    let x = last_x;
    let y = last_y;
    paintEnd(x, y);
});

canvas.addEventListener("mouseout", function (evt) {
    penDown = false;
});
canvas.addEventListener("mouseup", function (evt) {
    penDown = false;
    let x = evt.clientX * pixelRatio;
    let y = evt.clientY * pixelRatio;
    paintEnd(x, y);
});
