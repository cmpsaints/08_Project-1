$(document).ready(function(){
    $('#modal1').modal();
    $('#modal1').modal('open'); 
    $("#gameover").hide();
   // $("#displaygame").hide();
 
 
    $("#submitmodal").click(function(){
        var nickname=$('#nicknameinput').val()
    });
});

 // JavaScript for referencing 2D context in Canvas drawing area
 var canvas = document.getElementById("myCanvas");
 var ctx = canvas.getContext("2d");
 
 // Declaring variables (and variables are given initial values)

const startMsgWidth = canvas.width / 2;
const startMsgHeight = canvas.height / 4;

var startScreen = true;

const borderThickness = 10;
const horizOpeningWidth = 80;

var horizBorderWidthLeft = (canvas.width - horizOpeningWidth) / 2;      // initializing left horiz border with a value
var horizBorderWidthRight = canvas.width - horizBorderWidthLeft - horizOpeningWidth;
const horizBorderHeight = borderThickness;

var horizBorderDx = 4;

const vertBorderWidth = borderThickness;
const vertBorderHeight = canvas.height - horizBorderHeight;

const paddleHeight = 10;
const paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

const ballRadius = 10;

var x = canvas.width / 2;
var y = canvas.height - 30;

var dx = 6;
var dy = -6;

var rightPressed = false;
var leftPressed = false;


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
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
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
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("startGame", canvas.width / 2 - 55, canvas.height / 2 - 20);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "14px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("pressSpaceBar", canvas.width / 2 - 85, canvas.height / 2 + 10);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = "14px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("arrowKeys to control", canvas.width / 2 - 85, canvas.height / 2 + 25);
    ctx.closePath();
}

function displayYouWin() {
    function display() {
        ctx.beginPath();
        ctx.rect((canvas.width - startMsgWidth) / 2, (canvas.height - startMsgHeight) / 2, startMsgWidth, startMsgHeight);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("YOU WIN", canvas.width / 2 - 55, canvas.height / 2 - 20);
        ctx.closePath();
    }

    window.setTimeout(display, 250);
}

function displayGameOver() {
    function display() {
        ctx.beginPath();
        ctx.rect((canvas.width - startMsgWidth) / 2, (canvas.height - startMsgHeight) / 2, startMsgWidth, startMsgHeight);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("GAME OVER", canvas.width / 2 - 55, canvas.height / 2 - 20);
        ctx.closePath();
    }

    window.setTimeout(display, 250);
}


function gameInitialize() {
    if (startScreen) {
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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

// ----------
// main function to play game
// ----------

function playGame() {
    // if (startScreen) {
    //     ctx.clearRect((canvas.width - startMsgWidth) / 2, (canvas.height - startMsgHeight) / 2, startMsgWidth, startMsgHeight);
    //     displayStartScreen();
    // }
    // else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBall();
        drawBorder();
        drawPaddle();

        // moving horiz GOAL opening back & forth
        if (horizBorderWidthLeft <= vertBorderWidth || horizBorderWidthRight <= vertBorderWidth) {
            horizBorderDx = -horizBorderDx;
        }
        horizBorderWidthLeft += horizBorderDx;
        horizBorderWidthRight = canvas.width - horizBorderWidthLeft - horizOpeningWidth;

        // detect ball collision with VERTical walls
        if (x + dx < borderThickness + ballRadius / 2 || x + dx > canvas.width - borderThickness - ballRadius / 2) {
            dx = -dx;
        }

        // detect ball passing through GOAL opening
        if (x > horizBorderWidthLeft + ballRadius / 2 && x < horizBorderWidthLeft + horizOpeningWidth - ballRadius / 2) {
            if (y + dy < borderThickness - ballRadius / 2) {
                displayYouWin();
                return;
                // alert("YOU WIN");
                // document.location.reload();
            }
        }   // detect ball collision with TOP HORIZontal wall
        else if (y + dy < borderThickness + ballRadius / 2 && dy < 0) {
            dy = -dy;
        }
        // detect ball collision with PADDLE
        if (x > paddleX && x < paddleX + paddleWidth) {
            if (y + dy > canvas.height - paddleHeight - ballRadius / 2 && dy > 0) {
                dy = -dy;
            }
        }   // detect ball passing by PADDLE, thus player loses a life
        else if (y + dy > canvas.height) {
            //Hide "display-game" section
            // $("#display-game").hide();
            $("#displaygame").css("display","none");
            //Show "game-over" section
            // $("#game-over").show();
            $("#gameover").css("display", "contents");
                // document.location.reload();
            // displayGameOver();
            // return;
            // alert("GAME OVER");
            // document.location.reload();
        }

        // // ..... detect ball collision with TOP horizontal wall
        // if (y + dy < borderThickness + ballRadius) {
        //     if (x < horizBorderWidthLeft - ballRadius || x > horizBorderWidthLeft + horizOpeningWidth + ballRadius) {
        //         dy = -dy;
        //     }   // ..... detect ball passing through GOAL opening
        //     else if (y + dy < borderThickness) {
        //         alert("YOU WIN");
        //         document.location.reload();
        //     }
        // }   // ..... detect ball collision with paddle
        // else if (y + dy > canvas.height - paddleHeight - ballRadius / 2) {
        //     if (x > paddleX && x < paddleX + paddleWidth) {
        //         dy = -dy;
        //     }
        //     // else {
        //     //     alert("GAME OVER");
        //     //     document.location.reload();
        //     // }
        // }
        // // ..... detect ball passing by paddle, thus player loses
        // if (y + dy > canvas.height - ballRadius / 2) {
        //     alert("GAME OVER");
        //     document.location.reload();
        // }

        // move paddle due to pressing L/R arrow keys
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        // increment x & y positions of ball
        x += dx;
        y += dy;

        requestAnimationFrame(playGame);
    // }
}

$('#Restart').click(function() {
    location.reload();
});

$('#Replay').click(function() {
    console.log(startScreen)
    $("#gameover").hide();
    $("#displaygame").show();
    startScreen = true;
    gameInitialize();
});

// setInterval(playGame, 10);
// playGame();