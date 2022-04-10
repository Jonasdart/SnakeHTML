const columns = 14;
const lines = 8;
var autoMove;
var lastCommand = "";
var snakeHead = [columns / 2, lines / 2];
var snakeSize = 2;
// var snakeBodySymbol = "&#128013;";
var snakeBodySymbol = "";
var snakeBodyElements = [];
var gameStatus = "playing";


function boardCreate() {
    let board = "";
    for (i = 0; i < lines; i++) {
        board += `
                        <div class="row line-2"  id=row-${i}>
                    `
        for (c = 0; c < columns; c++) {
            board += `
                            <div id="column-${c}"></div>
                        `
        }
        board += '</div>';
    }
    document.getElementById("board").innerHTML = board;
}


function clearBoard() {
    if (snakeBodyElements.length > snakeSize) {
        snakeBodyElements[snakeBodyElements.length - 1].innerHTML = "";
        snakeBodyElements[snakeBodyElements.length - 1].classList.remove("body");
        snakeBodyElements.pop()
    }
}

function game() {
    childrens = document.getElementById(`row-${snakeHead[1]}`).children;
    children = childrens[snakeHead[0]]
    if (children.classList.contains("body")) {
        colide();
    }
    snakeBodyElements.unshift(children);
    if (children.classList.contains("food")) {
        consumeFood();
    }
    children.classList.add(`body`);
    children.innerHTML = snakeBodySymbol;
    clearBoard();
}

function generateFood() {
    boardItems = document.getElementById("board").children
    while (true) {
        y = Math.floor(Math.random() * lines);
        x = Math.floor(Math.random() * columns);

        cell = boardItems[y].children[x]
        if (cell.classList.contains("body")) {
            console.log("Generating food again...");
        } else {
            cell.classList.add("food");
            break;
        }

    }
}

function consumeFood() {
    snakeSize += 1;
    food = document.getElementsByClassName("food");
    food[0].classList.remove("food");
    document.getElementById("score").innerHTML = `Pontuação: ${snakeSize - 2}`
    generateFood();
}

function colide() {
    stopAutoMove();
    board = document.getElementById("board")
    board.innerHTML = "GAME OVER!";
    board.innerHTML += '<br><button id="play-again" onClick="window.location.reload(); autofocus">Jogar novamente</button>'
    document.getElementById("container").classList.add("gameover")
}

function move(goTo) {
    if (goTo === undefined) {
        goTo = lastCommand;
        direct();
        valideWall();
        game();
    } else {
        if (goTo !== lastCommand) {
            if (direct()) {
                stopAutoMove();
                valideWall();
                game();
                startAutoMove();
            } else {
                return false;
            }
        }
    }

    function direct() {
        if (goTo === "w") {
            if (lastCommand !== "s") {
                snakeHead[1] -= 1;
                return true;
            }
            return false;
        }
        if (goTo === "s") {
            if (lastCommand !== "w") {
                snakeHead[1] += 1;
                return true;
            }
            return false;
        }
        if (goTo === "a") {
            if (lastCommand !== "d") {
                snakeHead[0] -= 1;
                return true;
            }
            return false;
        }
        if (goTo === "d") {
            if (lastCommand !== "a") {
                snakeHead[0] += 1;
                return true;
            }
            return false;
        }
    }

    function valideWall() {
        if (snakeHead[1] >= lines) {
            snakeHead[1] = 0;
        }
        if (snakeHead[1] < 0) {
            snakeHead[1] = lines - 1;
        }
        if (snakeHead[0] >= columns) {
            snakeHead[0] = 0;
        }
        if (snakeHead[0] < 0) {
            snakeHead[0] = columns - 1;
        }
    }
    return true;
}


function toControl(command) {
    command = command.key

    if (command === "Escape" || command === " ") {
        pause()
    }

    command = command.replace('ArrowUp', 'w');
    command = command.replace('ArrowDown', 's');
    command = command.replace('ArrowLeft', 'a');
    command = command.replace('ArrowRight', 'd');
    if (["w", "a", "s", "d"].includes(command)) {
        if (move(command)) {
            lastCommand = command;
        }
    }
}

function startAutoMove() {
    gameStatus = "playing";
    autoMove = setInterval(move, (1000 / (snakeSize / 3)));
}
function stopAutoMove() {
    gameStatus = "paused";
    clearInterval(autoMove);
}

document.onkeydown = toControl;

function pause() {
    if (lastCommand) {
        if (gameStatus !== "paused") {
            stopAutoMove();
            alert("Jogo pausado! Retomar?")
            startAutoMove()
        }
    }
}

boardCreate();
game()
generateFood();