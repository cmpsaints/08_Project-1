$(document).ready(function () {
    $('#modal1').modal();
    $('#modal1').modal('open');
    $("#gameover").hide();
    // $("#displaygame").hide();


    $("#submitmodal").click(function () {
        var nickname = $('#nicknameinput').val()
        // MO timer function
        timerFunc();
    });
});

// MO Configure and Initialize Database 
var config = {
    apiKey: "AIzaSyAXHWAAt4ZCoivRhnu0140RJYcB7eD-KCE",
    authDomain: "game-project-e5caa.firebaseapp.com",
    databaseURL: "https://game-project-e5caa.firebaseio.com",
    projectId: "game-project-e5caa",
    storageBucket: "",
    messagingSenderId: "116338671963"
};

firebase.initializeApp(config);
database = firebase.database();
var resultRef = database.ref("gameResult");

// MO Initialize Music Api
var tag = document.createElement('script');
var muteAudio = document.getElementById('player');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var list = ["vNZnKsB9pVs", "zyluU2OpqDA", "QwdbFNGCkLw"];
var videoIdValue = get_random(list);
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '50',
        width: '100',
        videoId: videoIdValue,
        playerVars: '',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}
var done = false;

// MO declare array for gif values
var win = ["happy", "win", "success"];
var lost = ["sad", "lost", "fail"];

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
        // MO Save Player and high Score to Local storage 
        if (!userFound()) {
            addLocalStoarge();
        }
        // MO save data to firebase Database
        saveDate();
        displaySavedData();
        // MO display gif
        var searchGif = get_random(lost);
        displayGif(searchGif);
        //Hide "display-game" section
        // $("#display-game").hide();
        $("#displaygame").css("display", "none");
        //Show "game-over" section
        // $("#game-over").show();
        $("#gameover").css("display", "contents");
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

function addLocalStoarge() {
    var player = $("#nicknameinput").val().trim();
    var score = $("#timer").text();
    if (localStorage.getItem('users')) {
        logon = JSON.parse(localStorage.getItem('users'));
    } else {
        logon = [];
    }
    logon.push(player);
    logon.push(score);
    localStorage.setItem("users", JSON.stringify(logon));
}

// MO check if data saved to local storage

function userFound() {
    var player = $("#nicknameinput").val().trim();
    var score = $("#timer").text();
    var logonStorage = JSON.parse(localStorage.getItem('users'));
    if (logonStorage === null) {
        return false;
    }
    else {
        for (var i = 0; i < logonStorage.length; i++) {

            if (logonStorage[i + 1] <= score) {
                localStorage.clear('users');
                addLocalStoarge()
            }
            return true;
        }

    }

}
// MO function To Save Data To Firebase Database

function saveDate() {
    console.log("here")
    var player = $("#nicknameinput").val().trim();
    var score = $("#timer").text();
    var newResultRef = resultRef.push();
    var d = new Date();
    newResultRef.set({
        player: player,
        score: score,
        currtime: d.toLocaleString()

    })
}

// MO function To Call Giffy API 

function displayGif(searchGif) {
    $("#gif").empty();
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        searchGif + "&api_key=dc6zaTOxFJmzC&limit=1";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        response.data.forEach(function (gif) {
            var imageDiv = $("<div>");
            var animalImage = $("<img>").attr("src", gif.images.fixed_height.url);
            animalImage.addClass("img-responsive");
            animalImage.addClass("img-thumbnail");
            $("#gif").append(animalImage)
        })

    });
}

// MO Random Function
function get_random(list) {
    return list[Math.floor((Math.random() * list.length))];

}

// MO Music Fuctions
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        //  setTimeout(stopVideo, 60000;
        done = true;
        console.log(event);
    }
}
function stopVideo() {
    player.stopVideo();
}
function onPlayerReady(event) {
    console.log(event.target);
}

function playVideo() {
    player.playVideo();
}

function get_random(list) {
    return list[Math.floor((Math.random() * list.length))];

}

// MO timer function 
function timerFunc() {
    $("#timer").text("");
    var counter = 0;
    function timeIt() {

        $("#timer").text(counter);
        counter++;
    }
    interval = setInterval(timeIt, 1000);
}


// MO function retrive data from firebase database
function displaySavedData() {
    resultRef.on("value", getData, getErr);
    function getData(data) {

        var userdata = data.val();
        var keys = Object.keys(userdata);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];

            var player = userdata[k].player;
            var score = userdata[k].score;

            $("#data-table > tbody").append("<tr><td>" + player + "</td><td>" + score + "</td><td>");
        }
    }
    function getErr(err) {
        console.log("error");
        console.log(err);
    }
}

$("#submitmodal").click(function() {

});

$('#Restart').click(function () {
    location.reload();
});

$('#Replay').click(function () {
    console.log(startScreen);
    $("#gameover").hide();
    $("#displaygame").show();
    startScreen = true;
    gameInitialize();
});


// MO play music
$('#music-controls').change(function () {

    if (this.checked) {
        playVideo();
    } else {
        stopVideo()
    }
});
draw();

// setInterval(playGame, 10);
// playGame();