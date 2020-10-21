// import "./styles.css";
import {
    pointsAlongLine
} from "./vector.js"

import { saveAs } from './FileSaver.js';


let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//random background when opening 
ctx.fillStyle = `hsl(${Math.random()*255}, 80%, 50%)`;
ctx.fillRect(0, 0, canvas.width, canvas.height);

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




clear.addEventListener("click", function () {
    state = "clear";
    if (state === "clear") {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = `hsl(${Math.random()*255}, 80%, 50%)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "rgba(0,0,0,0.6)";
        ctx.fillStyle = "rgba(0,0,0,0.6)";
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
    let interpolatedPoints = pointsAlongLine(x, y, last_x, last_y, 5);

    // Fill with gradient - how to make it drawing while color is changing? 
    // why it does not work on arc? works on rect 
    var grd = ctx.createLinearGradient(0, 0, 800, 0);
    grd.addColorStop(0, "red");
    grd.addColorStop(0.2, "purple");
    grd.addColorStop(0.6, "blue");
    grd.addColorStop(0.8, "yellow");
    grd.addColorStop(1, "green");
    ctx.fillStyle = grd;


    //brush four 
    // interpolatedPoints.forEach(function (p) {

    //     ctx.fillStyle = "black";
    //     ctx.beginPath();
    //      ctx.arc(p.x + norm_random(20), p.y + norm_random(10), 0.8, Math.PI, Math.PI * 2);
    //     ctx.arc(p.x + norm_random(20), p.y + norm_random(10), Math.PI * Math.random() * 10, Math.PI * Math.random(), Math.PI * Math.random() * 2);
    //     ctx.stroke();
    // });

    //brush two 
    // interpolatedPoints.forEach(function (p) {
    //     ctx.beginPath();
    //     ctx.fillRectp(.x + norm_random(20), p.y + norm_random(10), 2,1)
    //     ctx.fill();
    // });


    //brush three 
    // interpolatedPoints.forEach(function (p) {
    //     ctx.beginPath();
    //     ctx.arc(p.x + norm_random(200), p.y + norm_random(10), 0.8, Math.PI, Math.PI * 2);
    //     ctx.fill();
    // });

    last_x = x;
    last_y = y;
}

function paintEnd(x, y) {}

canvas.addEventListener("mousedown", function (evt) {
    let x = evt.clientX;
    let y = evt.clientY;
    paintStart(x, y);
});

canvas.addEventListener("touchstart", function (evt) {
    let touches = Array.from(evt.touches);
    let touch = touches[0];
    paintStart(touch.clientX, touch.clientY);
});

canvas.addEventListener("mousemove", function (evt) {
    if (penDown === false) {
        return;
    }

    let x = evt.clientX;
    let y = evt.clientY;
    paintMove(x, y);
});

canvas.addEventListener("touchmove", function (evt) {
    evt.preventDefault();

    let touches = Array.from(evt.touches);
    let touch = touches[0];

    let x = touch.clientX;
    let y = touch.clientY;
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
    let x = evt.clientX;
    let y = evt.clientY;
    paintEnd(x, y);
});
