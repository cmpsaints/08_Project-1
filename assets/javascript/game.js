$(document).ready(function(){
    $("#displaygame").hide();
    $("#gameover").hide();
});

$("#submitmodal").click(function(){
    
    var nickname=$('#nicknameinput').val();
    
    if ( nickname != "" && nickname.length <= 8) { 
        $("#usernickname").hide();
        $("#displaygame").show();
    }
    else {
        $("#nick-error").html("You must enter a nickcname 8 characters or under.")
    }
});
    
// JavaScript for referencing 2D context in Canvas drawing area
 var canvas = document.getElementById("myCanvas");
 var ctx = canvas.getContext("2d");

 // loading audio files

var endMusic = new Howl({
    urls: ["sound/music.ogg"],
    autoplay: false,
    loop: true
});

var mute = false;

function createAudio(src, options) {
    var audio = document.createElement("audio");
    audio.volume = options.volume || 0.5;
    audio.loop   = options.loop;
    audio.src = src;
    return audio;
}
var brickAudio = createAudio("assets/sounds/BEEPPURE.wav", {volume: 0.75});
var lifeCountAudio = createAudio("assets/sounds/BEEPPURE.wav", {volume: 0.75});
var youWinAudio = createAudio("assets/sounds/BEEPPURE.wav", {volume: 0.75});
var youLoseAudio = createAudio("assets/sounds/BEEPPURE.wav", {volume: 0.75});
var lastPageAudio = createAudio("assets/sounds/BEEPPURE.wav", {volume: 0.75});

function playSound(sound) {
    sound.play();
}
 
// DECLARING GLOBAL VARIABLES ---------------

const startMsgWidth = canvas.width / 2;
const startMsgHeight = canvas.height / 4;

// const borderThickness = 2;
const horizOpeningWidth = 80;

var horizBorderWidthLeft = (canvas.width - horizOpeningWidth) / 2;      // initializing left horiz border with a value
var horizBorderWidthRight = canvas.width - horizBorderWidthLeft - horizOpeningWidth;
const horizBorderHeight = 6;

var horizBorderDx = 4;

const vertBorderWidth = 2;
const vertBorderHeight = canvas.height - horizBorderHeight;

const paddleHeight = 12;
const paddleWidth = 100;

var paddleX = (canvas.width - paddleWidth) / 2;     // setting PADDLE to initial position
var paddleDx = 6;

const ballRadius = 10;

// var x = canvas.width / 2;
// var y = canvas.height - 30;

var x;
var y;
var startX = [canvas.width / 2 - 80, canvas.width / 2, canvas.width / 2 + 80];
var startY = [canvas.height / 2 + 120, canvas.height / 2 + 160, canvas.height / 2 + 200];

var dx = 6;     // dx initial value (absolute value same throughout runtime of app, changing back & forth btwn pos & neg)
var dy;
var startDy = [-5, -6, -7, -8];

var rightPressed = false;   // intialized Arrow Key states for PADDLE & WALL collision detection
var leftPressed = false;


const brickRowCount = 4;
const brickColumnCount = 6;
const brickWidth = 115;
const brickHeight = 26;
const brickPadding = 12;
const brickOffsetTop = 30;
const brickOffsetLeft = 12;

const regularColor = "rgba(150, 150, 150, 45%)";
const doubleHitColor = "red";
const singleHitColor = "yellow";

var brickColors = [regularColor, regularColor, doubleHitColor, singleHitColor];

var bricks = [];
// initializing brick matrix
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, color: brickColors[Math.floor(Math.random() * 3)] };
    }
}
// console.log(bricks);

var doubleHitStatus = [];
// initializing double-hit matrix for status of double-hit bricks
for (var c = 0; c < brickColumnCount; c++) {
    doubleHitStatus[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].color === brickColors[2]) {
            doubleHitStatus[c][r] = 1;
        }
        else {
            doubleHitStatus[c][r] = 0;
        }
    }
}
// console.log(doubleHitStatus);

var lives = 3;
var startScreen = true;     // initialization

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.keyCode === 39) {
        rightPressed = true;
    }
    else if (e.keyCode === 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode === 39) {
        rightPressed = false;
    }
    else if (e.keyCode === 37) {
        leftPressed = false;
    }
}


function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft + vertBorderWidth;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop + horizBorderHeight;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


function drawBorder() {
    ctx.beginPath();
    // left vert border
    ctx.rect(0, horizBorderHeight, vertBorderWidth, vertBorderHeight);
    // right vert border
    ctx.rect(canvas.width - vertBorderWidth, horizBorderHeight, vertBorderWidth, vertBorderHeight);
    // left horiz border
    ctx.rect(0, 0, horizBorderWidthLeft, horizBorderHeight);
    // right horiz border
    ctx.rect(canvas.width - horizBorderWidthRight, 0, horizBorderWidthRight, horizBorderHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.rect(x - ballRadius / 2, y - ballRadius / 2, ballRadius, ballRadius);
    ctx.rect(x - ballRadius / 2, y - ballRadius, ballRadius, ballRadius / 2);
    ctx.rect(x - ballRadius / 2, y + ballRadius / 2, ballRadius, ballRadius / 2);
    ctx.rect(x - ballRadius, y - ballRadius / 2, ballRadius / 2, ballRadius);
    ctx.rect(x + ballRadius / 2, y - ballRadius / 2, ballRadius / 2, ballRadius);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}


function displayStartScreen() {
    ctx.beginPath();
    ctx.rect((canvas.width - startMsgWidth) / 2, (canvas.height - startMsgHeight) / 2, startMsgWidth, startMsgHeight);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "100px pixelated";
    ctx.fillStyle = "black";
    ctx.fillText("startGame", canvas.width / 2 - 220, canvas.height / 2 + 40);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "40px pixelated";
    ctx.fillStyle = "black";
    ctx.fillText("pressSpaceBar", canvas.width / 2 - 114, canvas.height / 2 + 90);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "25px pixelated";
    ctx.fillStyle = "black";
    ctx.fillText("arrowKeys to control", canvas.width / 2 - 114, canvas.height / 2 + 120);
    ctx.closePath();
}

function displayYouWin() {
    ctx.beginPath();
    ctx.rect((canvas.width - startMsgWidth) / 2, (canvas.height - startMsgHeight) / 2, startMsgWidth, startMsgHeight);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "80px pixelated";
    ctx.fillStyle = "black";
    ctx.fillText("YOU WIN", canvas.width / 2 - 74, canvas.height / 2 - 20);
    ctx.closePath();
    
    window.setTimeout(playSound(youWinAudio), 50);
}

function displayYouLose() {    
    ctx.beginPath();
    ctx.rect((canvas.width - startMsgWidth) / 2, (canvas.height - startMsgHeight) / 2, startMsgWidth, startMsgHeight);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "80px pixelated";
    ctx.fillStyle = "black";
    ctx.fillText("YOU LOSE", canvas.width / 2 - 78, canvas.height / 2);
    ctx.closePath();

    window.setTimeout(playSound(youLoseAudio), 600);
}

// function displayGameOver() {
//     function display() {
//         ctx.beginPath();
//         ctx.rect((canvas.width - startMsgWidth) / 2, (canvas.height - startMsgHeight) / 2, startMsgWidth, startMsgHeight);
//         ctx.fillStyle = "red";
//         ctx.fill();
//         ctx.closePath();

//         ctx.beginPath();
//         ctx.font = "80px pixelated";
//         ctx.fillStyle = "black";
//         ctx.fillText("GAME OVER", canvas.width / 2 - 55, canvas.height / 2 - 20);
//         ctx.closePath();
//     }

//     window.setTimeout(display, 250);
// }


function gameInitialize() {
    if (startScreen) {
        drawBorder();
        drawPaddle();
        displayStartScreen();
    }
    else {
        // random initial direction of GOAL opening
        var initializeDirec = Math.floor(Math.random() * 2);
        if (initializeDirec === 0) {
            horizBorderDx = -horizBorderDx;
        }
        // random initial direction of ball
        var initializeDirec = Math.floor(Math.random() * 2);
        if (initializeDirec === 0) {
            dx = -dx;
        }
        // play game
        x = startX[Math.floor(Math.random() * 3)];
        y = startY[Math.floor(Math.random() * 3)];
        dy = startDy[Math.floor(Math.random() * 4)];

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLives();
        drawBricks();
        drawBall();
        drawBorder();
        drawPaddle();

        window.setTimeout(playGame, 1150);
    }
}

document.addEventListener("keyup", spaceBar);

function spaceBar(e) {
    if (e.keyCode === 32 && startScreen === true) {
        startScreen = false;
        gameInitialize();
    }
}

gameInitialize();

// -----------------------------------
// main function to play game
//
function playGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawLives();
    drawBricks();
    drawBall();
    drawBorder();
    drawPaddle();

    collisionDetection();
    // // var collision = collisionDetection;
    // if (collisionDetection === true) {
    //     playSound(brickAudio);
    // }

    // moving horiz GOAL opening back & forth
    if (horizBorderWidthLeft <= vertBorderWidth || horizBorderWidthRight <= vertBorderWidth) {
        horizBorderDx = -horizBorderDx;
    }
    horizBorderWidthLeft += horizBorderDx;
    horizBorderWidthRight = canvas.width - horizBorderWidthLeft - horizOpeningWidth;

    // detect ball collision with VERTical walls
    if (x + dx < vertBorderWidth + ballRadius / 2 || x + dx > canvas.width - vertBorderWidth - ballRadius / 2) {
        dx = -dx;
    }

    // detect ball passing through GOAL opening
    if (x > horizBorderWidthLeft + ballRadius / 2 && x < horizBorderWidthLeft + horizOpeningWidth - ballRadius / 2) {
        if (y + dy < horizBorderHeight - ballRadius / 2) {
            window.setTimeout(displayYouWin, 350);
            return;
        }
    }   // detect ball collision with TOP HORIZontal wall
    else if (y + dy < horizBorderHeight + ballRadius / 2 && dy < 0) {
        dy = -dy;
    }
    
    // detect ball collision with PADDLE
    if (x > paddleX && x < paddleX + paddleWidth) {
        if (y + dy > canvas.height - paddleHeight - ballRadius / 4 && dy > 0) {
            dy = -dy;
            // ...................................
        }
    }   // detect ball passing by PADDLE, thus player loses a life
    else if (y + dy > canvas.height) {
        lives--;
        if (lives === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks();
            drawBall();
            drawBorder();
            drawPaddle();

            window.setTimeout(playSound(lifeCountAudio), 150);
            window.setTimeout(redrawLives, 200);
            window.setTimeout(displayYouLose, 800);
            return;
        }
        else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks();
            drawBall();
            drawBorder();
            drawPaddle();

            window.setTimeout(playSound(lifeCountAudio), 150);
            window.setTimeout(redrawLives, 400);
            window.setTimeout(redraw, 900);
            return;
        }
    }

    // increment x & y positions of ball
    x += dx;
    y += dy;

    // move paddle due to pressing L/R arrow keys
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleDx;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= paddleDx;
    }
    
    requestAnimationFrame(playGame);
}


function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight / 2) {
                    playSound(brickAudio);
                    dy = -dy;
                    if (doubleHitStatus[c][r] === 1) {
                        doubleHitStatus[c][r] = 0;
                        b.color = brickColors[3];   // convert to singleHitColor
                    }
                    else if (doubleHitStatus[c][r] === 0) {
                        b.status = 0;
                    }
                    // return true;
                    return;
                }
            }
        }
    }
}

function brickStatus() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status === 0) {
                b.status = Math.floor(Math.random() * 2);
                if (b.color === brickColors[3]) {
                    b.color = brickColors[2];
                    doubleHitStatus[c][r] = 1;
                }
            }
        }
    }
}

// window.setInterval(brickStatus, 5000);
setInterval(brickStatus, 8000);

// ----------------------------------------
// ----------------------------------------

function drawLives() {
    ctx.font = "450px pixelated";
    ctx.fillStyle = "rgba(255, 255, 255, 40%)";
    ctx.fillText(lives, canvas.width / 2 - 85, canvas.height - 70);

    ctx.font = "30px pixelated";
    ctx.fillStyle = "rgba(255, 255, 255, 65%)";
    ctx.fillText("LIVE(S)", canvas.width / 2 - 48, canvas.height - 35);
}

function redrawLives() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLives();
    drawBricks();
    drawBall();
    drawBorder();
    drawPaddle();
}

function redraw() {
    // x = canvas.width / 2;
    // y = canvas.height - 30;
    x = startX[Math.floor(Math.random() * 3)];
    y = startY[Math.floor(Math.random() * 3)];
    dy = startDy[Math.floor(Math.random() * 4)];
    paddleX = (canvas.width - paddleWidth) / 2;     // resetting to initial position

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLives();
    drawBricks();
    drawBall();
    drawBorder();
    drawPaddle();

    window.setTimeout(playGame, 800);
}

$('#Restart').click(function() {
    location.reload();
 });
 
 $('#Replay').click(function() {
    console.log(startScreen);
    $("#gameover").hide();
    $("#displaygame").show();
    startScreen = true;
    gameInitialize();
 });


// function playGame() {
//     // if (startScreen) {
//     //     ctx.clearRect((canvas.width - startMsgWidth) / 2, (canvas.height - startMsgHeight) / 2, startMsgWidth, startMsgHeight);
//     //     displayStartScreen();
//     // }
//     // else {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         drawBall();
//         drawBorder();
//         drawPaddle();

//         // moving horiz GOAL opening back & forth
//         if (horizBorderWidthLeft <= vertBorderWidth || horizBorderWidthRight <= vertBorderWidth) {
//             horizBorderDx = -horizBorderDx;
//         }
//         horizBorderWidthLeft += horizBorderDx;
//         horizBorderWidthRight = canvas.width - horizBorderWidthLeft - horizOpeningWidth;

//         // detect ball collision with VERTical walls
//         if (x + dx < borderThickness + ballRadius / 2 || x + dx > canvas.width - borderThickness - ballRadius / 2) {
//             dx = -dx;
//         }

//         // detect ball passing through GOAL opening
//         if (x > horizBorderWidthLeft + ballRadius / 2 && x < horizBorderWidthLeft + horizOpeningWidth - ballRadius / 2) {
//             if (y + dy < borderThickness - ballRadius / 2) {
//                 displayYouWin();
//                 return;
//                 // alert("YOU WIN");
//                 // document.location.reload();
//             }
//         }   // detect ball collision with TOP HORIZontal wall
//         else if (y + dy < borderThickness + ballRadius / 2 && dy < 0) {
//             dy = -dy;
//         }
//         // detect ball collision with PADDLE
//         if (x > paddleX && x < paddleX + paddleWidth) {
//             if (y + dy > canvas.height - paddleHeight - ballRadius / 2 && dy > 0) {
//                 dy = -dy;
//             }
//         }   // detect ball passing by PADDLE, thus player loses a life
//         else if (y + dy > canvas.height) {
//             //Hide "display-game" section
//             // $("#display-game").hide();
//             $("#displaygame").css("display","none");
//             //Show "game-over" section
//             // $("#game-over").show();
//             $("#gameover").css("display", "contents");
//                 // document.location.reload();
//             // displayGameOver();
//             // return;
//             // alert("GAME OVER");
//             // document.location.reload();
//         }

//         // move paddle due to pressing L/R arrow keys
//         if (rightPressed && paddleX < canvas.width - paddleWidth) {
//             paddleX += 7;
//         }
//         else if (leftPressed && paddleX > 0) {
//             paddleX -= 7;
//         }

//         // increment x & y positions of ball
//         x += dx;
//         y += dy;

//         requestAnimationFrame(playGame);
//     // }
// }
