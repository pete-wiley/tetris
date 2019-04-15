//setting globals
const canvas = document.getElementById("board")
const context = canvas.getContext("2d")
const scoreHTML = document.getElementById("score")
const reset = document.getElementById("reset")
let highScore = document.getElementById("high-score")
const row = 20
const col = 10
const sq = 20
const vacant = "#204362"




//-----------------------------------------------------------------------------
//draw a single square

function drawSquare (x, y, color){
    context.fillStyle = color
    context.fillRect(x*sq, y*sq, sq, sq)
    context.strokeStyle = "black"
    context.strokeRect(x*sq, y*sq, sq, sq)
}

//-----------------------------------------------------------------------------
//make board

let board = []
for (r = 0; r < row; r++) {
    board[r] = []
    for(c = 0; c < col; c++) {
        board[r][c] = vacant
    }
}

//draw board
function drawBoard () {
    for(r = 0; r < row; r++) {
        for(c = 0; c < col; c++){
            drawSquare(c, r, board[r][c])
        }
    }
}

drawBoard()

//-----------------------------------------------------------------------------
//Pieces
const pieces = [
    [Z, "red"],
    [S, "green"],
    [T, "purple"],
    [J, "blue"],
    [L, "orange"],
    [O, "yellow"],
    [I, "cyan"],
    /*[newA, "white"],
    [newB, "black"],
    [newC, "grey"],*/
]

//generate random piece
function randomPiece () {
    let rand = Math.floor(Math.random() * pieces.length)
    return new piece (pieces[rand][0], pieces[rand][1])
}

let p = randomPiece()

//-----------------------------------------------------------------------------
//The piece class

function piece (tetromino, color) {
    this.tetromino = tetromino
    this.color = color

    this.tetrominoPat = 0
    this.activeTetromino = this.tetromino[this.tetrominoPat]

    //control
    this.x = 3
    this.y = -2
}

//fill piece
piece.prototype.fill = function(color){
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            if(this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color)
            }
        }
    }
}

//draw piece
piece.prototype.draw = function(){
    this.fill(this.color)
}
//undraw piece
piece.prototype.undraw = function(){
    this.fill(vacant)
}

//-----------------------------------------------------------------------------
//piece movement
//move piece down
piece.prototype.moveDown = function () {
    if(!this.collision(0, 1, this.activeTetromino)){
        this.undraw()
        this.y++
        this.draw()
    } else {
        this.lock();
        p = randomPiece()
    }
}

//move piece right
piece.prototype.moveRight = function () {
    if(!this.collision(1, 0, this.activeTetromino)){
        this.undraw()
        this.x++
        this.draw()
    }
}

//move piece left
piece.prototype.moveLeft = function () {
    if(!this.collision(-1, 0, this.activeTetromino)){
        this.undraw()
        this.x--
        this.draw()
    }
}

//rotate piece
piece.prototype.rotate = function () {
    let nextPattern = this.tetromino[(this.tetrominoPat + 1) % this.tetromino.length]
    let kick = 0
    if (this.collision(0, 0, nextPattern)){
        if(this.x > col/2) { //its the right wall
            kick = -1 //move left
        } else { //its the left wall
            kick = 1 //move right
        }
    }
    if(!this.collision(0, 0, nextPattern)){
        this.undraw()
        this.x += kick
        this.tetrominoPat = (this.tetrominoPat + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoPat]
        this.draw()
    }
}

//-----------------------------------------------------------------------------
//gameplay
//lock piece
let score = 0
piece.prototype.lock = function () {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            if (!this.activeTetromino[r][c]) {
                continue
            }
            if (this.y + r < 0) {

                alert("Game Over")
                gameOver = true
                highScore.innerHTML = score
                break
            }
            board [this.y + r][this.x + c] = this.color
        }
    }
    //clear lines
    for (r = 0; r < row; r++) {
        let isRowFull = true
        for (c = 0; c < col; c++) {
            isRowFull = isRowFull && (board[r][c] != vacant)
        }
        if (isRowFull) {
            for (y = r; y > 1; y--) {
                for (c = 0; c < col; c++) {
                    board[y][c] = board[y - 1][c]
                }
            }
            for (c = 0; c < col; c++) {
                board[0][c] = vacant
            }
            score += 1
        }
    }
    drawBoard()
    scoreHTML.innerHTML = score
}

//collision function
piece.prototype.collision = function (x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c <piece.length; c++){
            if(!piece[r][c]){
                continue;
            }
            let newX = this.x + c + x
            let newY = this.y + r + y
            if (newX < 0 || newX >= col || newY >= row){
                return true;
            }
            if (newY < 0) {
                continue
            }
            if(board[newY][newX] != vacant){
                return true
            }
        }
    }
    return false;
}

//control piece
document.addEventListener("keydown", control)

function control (e) {
    if (score >= 10){
        dropTime = 600
    } if (score >= 20){
        dropTime = 300
    } if (score >= 30){
        dropTime = 150
    } if (score >= 40){
        dropTime = 50
    }

    if (e.keyCode == 65) {
        p.moveLeft()
        dropStart = Date.now()
    } else if (e.keyCode == 87) {
        p.rotate()
        dropStart = Date.now()
    } else if (e.keyCode == 68) {
        p.moveRight()
        dropStart = Date.now()
    } else if (e.keyCode == 83) {
        p.moveDown()
        dropStart = Date.now()
    }
console.log(dropTime)
}

//drop at interval
let dropStart = Date.now()
let gameOver = false
let dropTime = 1000
function drop(){
    let now = Date.now()
    let delta = now - dropStart
    if (delta > dropTime) {
        p.moveDown()
        dropStart= Date.now()
    }
    if (score >= 4) {
        droptime = 100
    }
    if (!gameOver) {
        requestAnimationFrame(drop)
    }
}

drop() 

highScore.innerHTML = 7