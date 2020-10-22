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


//final
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//pattern 
let patternCanvas = document.getElementById("patternCanvas");
let patternCtx = patternCanvas.getContext("2d");

//bg color
let bgCanvas = document.getElementById("bgCanvas");
let bgCtx = bgCanvas.getContext("2d");

let one = document.getElementById("one"); //soft
let two = document.getElementById("two"); //bold
let three = document.getElementById("three"); //blah
let pixel = document.getElementById("pixel");
let pixelBtn = document.getElementById("pixelBtn");
let pixelSlider = document.getElementById("pixelSlider");
let time;
let state = "";
let colors = document.getElementById("colors");
let diffTime = 0;
let clear = document.getElementById("clear");

pixelBtn.addEventListener("click", togglePixel); //show hide it when other buttons are clicked 

function togglePixel() {
  
    console.log("clicked on slider")
    state ="pixel";

    if (pixelSlider.style.display === "none") {
        pixelSlider.style.display = "block";
    } else {
        pixelSlider.style.display = "none";
    }
}

window.addEventListener("click",function(){
    if(state!="pixel"){
        pixelSlider.style.display = "none";
     }
})

//how to keep the drawing without clearing it? - for the pattern canvas 
let pixelRatio = 1;

canvas.width = window.innerWidth * pixelRatio;
canvas.height = window.innerHeight * pixelRatio;
bgCanvas.width = window.innerWidth * pixelRatio;
bgCanvas.height = window.innerHeight * pixelRatio;
patternCanvas.width = window.innerWidth * pixelRatio;
patternCanvas.height = window.innerHeight * pixelRatio;

function updateSliderVal() {
    if (pixelRatio >= 0) {
        pixelRatio = pixelSlider.value;
        console.log("value: ", pixelRatio);
        render();
    }
}

pixelSlider.addEventListener("change", updateSliderVal);
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
    bgCanvas.width = window.innerWidth * pixelRatio;
    bgCanvas.height = window.innerHeight * pixelRatio;
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    patternCanvas.width = window.innerWidth * pixelRatio;
    patternCanvas.height = window.innerHeight * pixelRatio;
    patternCtx.clearRect(0, 0, patternCanvas.width, patternCanvas.height);

    let image = bgImages[index];
    //how to make the pattern smaller - same as the pixel ratio?
    var pattern = patternCtx.createPattern(image, 'repeat');

    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

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

clear.addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    patternCtx.clearRect(0, 0, patternCanvas.width, patternCanvas.height)
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height)


})
let penDown = false;
let last_x = 0;
let last_y = 0;

function paintStart(x, y) {
    penDown = true;
    last_x = x;
    last_y = y;
    time = new Date();
    diffTime = 0;
}

//start the brush in the center of the shape
function norm_random(size) {
    return (Math.random() - 0.5) * size;
}

one.addEventListener("click", function () {
    state = "one";
});
two.addEventListener("click", function () {
    state = "two"
});

three.addEventListener("click", function () {
    state = "three"
});
colors.addEventListener("click", function () {
    state = "colors";
    if (state === "colors") {

        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        bgCtx.fillStyle = `hsl(${Math.random()*255}, 80%, 50%)`;
        console.log(bgCtx.fillStyle)
        bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    }
});

download.addEventListener("click", function () {
    state = "download";
    console.log("download!");
    //draw everything onto the bg image and save it 
    bgCtx.drawImage(canvas, 0, 0)
    bgCanvas.toBlob(function (blob) {
        saveAs(blob, "emojiDrawing.png");
    });
})


function paintMove(x, y) {
    // let thickness = 3;
    // ctx.lineWidth = thickness;
    let rate = 20;
    let interpolatedPoints = pointsAlongLine(x, y, last_x, last_y, rate);

    let lastTime = new Date();
    diffTime = (lastTime - time) / 10;

    //brush 
    //pink circle with contrasty rect in the center 
    if (state === "one") {
        interpolatedPoints.forEach(function (p) {
            ctx.beginPath();
            ctx.fillStyle = "rgba(0,0,0,0.8)";
            ctx.fillRect(p.x + norm_random(10), p.y + norm_random(10), norm_random(20), norm_random(10))

            ctx.fillStyle = 'rgba( ' + 255 * Math.floor(diffTime) / 10 + ',' +
                Math.random() * Math.floor(diffTime) / 2 + ',' + (Math.random() * 255 + Math.floor(diffTime)) + ',' + 0.2 + ')';
            console.log("difftime:", diffTime);
            ctx.arc(p.x + norm_random(20), p.y + norm_random(20), Math.abs(norm_random(100)), 0, Math.PI * 2);
            ctx.fill();
        });
    }
    //brush two 
    //vertical lines and pink circles - cherry blossom 
    if (state === "two") {
        interpolatedPoints.forEach(function (p) {
            ctx.beginPath();
            ctx.fillStyle = 'rgb( ' + 255 * Math.floor(diffTime) / 10 + ',' +
                Math.random() * Math.floor(diffTime) / 5 + ',' + (Math.random() * 255 + Math.floor(diffTime)) + ')';
            console.log("difftime:", diffTime);
            ctx.arc(p.x + norm_random(10), p.y + norm_random(10), Math.abs(random(15)), Math.PI * norm_random(1), Math.PI * norm_random(2));
            ctx.fill();
            ctx.fillStyle = 'rgb(' + (Math.random() * 255 + Math.floor(diffTime)) + ',' +
                Math.random() * Math.floor(diffTime) + ',' + 255 * Math.floor(diffTime) / 100 + ')';
            console.log("difftime:", diffTime);
            ctx.fillRect(p.x + norm_random(20), p.y + norm_random(10), 2, 10)

        });
    }

    //brush three 
    // animating the circle when it is drawn - revealing the circle rather than drawing? 
    // created soft circles 
    //fillstyle changing color over time 

    if (state === "three") {
        interpolatedPoints.forEach(function (p) {


            ctx.beginPath();
            ctx.fillStyle = 'rgb(' + (Math.random() * 255 + Math.floor(diffTime)) + ',' +
                Math.random() * Math.floor(diffTime) + ',' + 255 * Math.floor(diffTime) / 10 + ')';
            console.log("difftime:", diffTime);
            ctx.arc(p.x + norm_random(5), p.y + norm_random(5), Math.abs(random(diffTime) * 1.2), Math.PI * norm_random(1), Math.PI * norm_random(2));
            ctx.fill();

        });
    }

    last_x = x;
    last_y = y;
}

function paintEnd(x, y) {
    pushState();
    diffTime = 0;
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
    let x = last_x * pixelRatio;
    let y = last_y * pixelRatio;
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
