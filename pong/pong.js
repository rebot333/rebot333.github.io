    var block; //dont change
    var paddle; //dont change
    var spacing = 1;
    var gameSpeed = 1;
    var colorVal = 0; //dont change
    var canvasWidth = 1000;
    var canvasHeight = 700;
    var blockWidth = 20;
    var blockHeight = 20;
    var paddleWidth = 15;
    var paddleHeight = 90;
    var paddleSpace = 30;
    var paddleSpeed = 0.75; //changes player speed
    var reset = false; //dont change
    var paddle2Speed = 0.875; //changes default paddle speed
    var playerScoreVal = 0; //dont change
    var aiScoreVal = 0; //dont change
    var upPressed = false; //dont change
    var downPressed = false; //dont change
    var upPressed2 = false; //dont change
    var downPressed2 = false; //dont change
    var mode = 0;
    
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    
    window.addEventListener("keydown", function(e) {
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
    
    function keyDownHandler(e) {
        if(e.key == "Up" || e.key == "ArrowUp") {
            upPressed = true;
        }
        else if(e.key == "Down" || e.key == "ArrowDown") {
            downPressed = true;
        }
        if(e.key == "w" || e.key == "W") {
            upPressed2 = true;
        }
        else if(e.key == "s" || e.key == "S") {
            downPressed2 = true;
        }
    }

    function keyUpHandler(e) {
        if(e.key == "Up" || e.key == "ArrowUp") {
            upPressed = false;
        }
        else if(e.key == "Down" || e.key == "ArrowDown") {
            downPressed = false;
        }
        if(e.key == "w" || e.key == "W") {
            upPressed2 = false;
        }
        else if(e.key == "s" || e.key == "S") {
            downPressed2 = false;
        }
    }
    
    function start() {
        block = new component(blockWidth, blockHeight, "rgb(255,0,0)", Math.floor(canvasWidth * 0.5), Math.floor(canvasHeight * 0.5));
        paddle = new component(paddleWidth, paddleHeight, "rgb(255,255,255)", Math.floor(canvasWidth - paddleSpace - paddleWidth), Math.floor((canvasHeight * 0.5) - (paddleHeight * 0.5)));
        paddle2 = new component(paddleWidth, paddleHeight, "rgb(255,255,255)", Math.floor(paddleSpace), Math.floor((canvasHeight * 0.5) - (paddleHeight * 0.5)));
        playerScore = new component("30px", "Impact", "rgb(0,0,0,0.5)", (canvasWidth - (paddleSpace * 5)), 40, "text");
        aiScore = new component("30px", "Impact", "rgb(0,0,0,0.5)", (paddleSpace * 2), 40, "text");
        area.start();
    }

    var area = {
        canvas : document.createElement("canvas"),
        start : function() {
            this.canvas.width = canvasWidth;
            this.canvas.height = canvasHeight;
            this.context = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
            this.interval = setInterval(updateArea, gameSpeed);
        },
        clear : function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    function component(width, height, color, x, y, type) {
        this.type = type;
        this.width = width;
        this.height = height;
        this.speedX = spacing;
        this.speedY = spacing;
        this.x = x;
        this.y = y;    
        this.update = function() {
            ctx = area.context;
            
            if (colorVal == 0) {
                ctx.fillStyle = "rgb(255,0,0)"
            }
            if (colorVal == 1) {
                ctx.fillStyle = "rgb(255,125,0)"
            }
            if (colorVal == 2) {
                ctx.fillStyle = "rgb(255,255,0)"
            }
            if (colorVal == 3) {
                ctx.fillStyle = "rgb(0,255,50)"
            }
            if (colorVal == 4) {
                ctx.fillStyle = "rgb(0,100,255)"
            }
            if (colorVal == 5) {
                ctx.fillStyle = "rgb(200,0,255)"
            }
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        this.updatePaddle = function() {
            ctx = area.context;
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        this.updateText = function() {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        this.updatePos = function() {
            if (reset) {
                this.x = Math.floor(canvasWidth * 0.5);
                this.y = Math.floor(Math.random() * (canvasHeight - blockHeight));
                reset = false;
            } else {
                this.x += this.speedX;
                this.y += this.speedY;
            }
        }
    }
    
function updateArea() {
    area.clear();
    block.updatePos();    
    block.update();
    paddle.updatePaddle();
    paddle.updatePos();
    paddle2.updatePaddle();
    paddle2.updatePos();
    
    if (mode == 0) {
        playerScore.text = "Player: " + playerScoreVal;
        playerScore.updateText();
        
        aiScore.text = "Bot: " + aiScoreVal;
        aiScore.updateText(); 
    } else {
        playerScore.text = "Player 2: " + playerScoreVal;
        playerScore.updateText();
        
        aiScore.text = "Player 1: " + aiScoreVal;
        aiScore.updateText();   
    }
    
    paddle.speedX = 0;
    paddle2.speedX = 0;
    
    var random = Math.floor(Math.random() * 6);
    var paddle2X = Math.floor(paddle2.x + paddleWidth);
    
    if (block.y == canvasHeight - blockHeight) {
        block.speedY = -spacing;
        colorVal = random;
    }
     
    if (block.y == 0) {
        block.speedY = spacing;
        colorVal = random;
    }
    if (block.x == canvasWidth + blockWidth) {
        block.speedX = -spacing;
        colorVal = random;
        reset = true;
        aiScoreVal += 1;
    }
    if (block.x == (0 - blockWidth)) {
        block.speedX = spacing;
        colorVal = random;
        reset = true;
        playerScoreVal += 1;
    }
    if ((block.x + blockWidth) == paddle.x) {
        if ((block.y + blockHeight) >= paddle.y) {
            if (block.y < (paddle.y + paddleHeight)) {
                block.speedX = -spacing;
                colorVal = random;
            }
        }
    }
    if (block.x == (paddle2X)) {
        if ((block.y + blockHeight) >= paddle2.y) {
            if (block.y < (paddle2.y + paddleHeight)) {
                block.speedX = spacing;
                colorVal = random;
            }
        }
    }
    if (upPressed) {
        paddle.speedY = -paddleSpeed
    } else if (downPressed) {
            paddle.speedY = paddleSpeed
    } else {
        paddle.speedY = 0;
    }
    if (paddle.y > (canvasHeight - paddleHeight)) {
        paddle.y = (canvasHeight - paddleHeight)
    }
    if (paddle.y < 0) {
        paddle.y = 0;
    }
    if (mode == 0) {
         if ((paddle2.y + (0.5 * paddleHeight)) < (block.y + (0.5 * blockHeight))) {
            paddle2.speedY = paddle2Speed;
        }
        if ((paddle2.y + (0.5 * paddleHeight)) > (block.y + (0.5 * blockHeight))) {
            paddle2.speedY = -paddle2Speed;
        }
    } else {
        paddle2.speedY = 0;
        if (upPressed2) {
            paddle2.speedY = -paddleSpeed
        } else if (downPressed2) {
            paddle2.speedY = paddleSpeed
        } else {
            paddle2.speedY = 0;
        }
    }
    if (paddle2.y < 0) {
        paddle2.y = 0;
    }
    if (paddle2.y > (canvasHeight - paddleHeight)) {
        paddle2.y = (canvasHeight - paddleHeight)
    }
    if (block.y < 0) {
        block.y = 0;
        block.speedY = spacing;
        colorVal = random;
    }
    if (block.y > (canvasHeight - blockHeight)) {
        block.y = (canvasHeight - blockHeight)
        block.speedY = -spacing;
        colorVal = random;
    }
}   
function speed(n) {
    paddleSpeed = n;
}
function enemySpeed(n) {
    paddle2Speed = n;
}
function modeChange(n) {
    aiScoreVal = 0;
    playerScoreVal = 0;
    paddle.y = Math.floor((canvasHeight * 0.5) - (paddleHeight * 0.5));
    paddle2.y = Math.floor((canvasHeight * 0.5) - (paddleHeight * 0.5));
    reset = true;
    mode = n;
}
function resetBoard() {
    aiScoreVal = 0;
    playerScoreVal = 0;
    paddle.y = Math.floor((canvasHeight * 0.5) - (paddleHeight * 0.5));
    paddle2.y = Math.floor((canvasHeight * 0.5) - (paddleHeight * 0.5));
    reset = true;
}
function player1Controller(n) {
    if (n == 0) {
	upPressed = false;
	downPressed = false;
    }
    if (n == 1) {
	downPressed = false;
	upPressed = true;
    }
    if (n == 2) {
	upPressed = false;
	downPressed = true;
    }
}
