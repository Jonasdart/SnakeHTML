const lines = 8;
const columns = 8;
var autoMove;
var lastCommand = "d";
var snakeHead = [lines / 2, columns / 2];
var snakeSize = 2;
var snakeBodySymbol = "l";
var snakeBodyElements = [];


function boardCreate() {
    let tabuleiro = "";
    for (i = 0; i < lines; i++) {
        tabuleiro += `
                        <div class="row line-2"  id=row-${i}>
                    `
        for (c = 0; c < columns; c++) {
            tabuleiro += `
                            <div id="column-${c}"></div>
                        `
        }
        tabuleiro += '</div>';
    }
    document.getElementById("tabuleiro").innerHTML = tabuleiro;
}

// function clearBoard() {
//     boardItems = document.getElementById("tabuleiro").children
//     for (indexItem = 0; indexItem < boardItems.length; indexItem++) {
//         cells = boardItems[indexItem].children;
//         for (cellIndex = 0; cellIndex < cells.length; cellIndex++) {
//             coord = [indexItem, cellIndex];
//             if(_.isEqual(coord, snakeHead)){
//                 cells[cellIndex].innerHTML = ".";
//             }else {
//                 cells[cellIndex].innerHTML = "";
//                 for(x=0; x<snakeBody.length; x++){
//                     console.log(_.isEqual(snakeBody[x], coord));
//                     if (_.isEqual(snakeBody[x], coord)){
//                         cells[cellIndex].innerHTML = ".";
//                     }
//                 }
//             }
//         }
//     }
// }

function clearBoard() {
    if (snakeBodyElements.length > snakeSize) {
        snakeBodyElements[snakeBodyElements.length - 1].innerHTML = "";
        snakeBodyElements[snakeBodyElements.length - 1].classList.remove("body");
        snakeBodyElements.pop()
    }
}

function game() {
    childrens = document.getElementById(`row-${snakeHead[0]}`).children;
    children = childrens[snakeHead[1]]
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
    while (true) {
        x = Math.floor(Math.random() * columns);
        y = Math.floor(Math.random() * lines);

        boardItems = document.getElementById("tabuleiro").children
        cell = boardItems[x].children[y]
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
    generateFood();
}

function colide() {
    stopAutoMove();
    board = document.getElementById("tabuleiro")
    board.innerHTML = "GAME OVER!";
    board.innerHTML += `<br>Sua Pontuacao: ${snakeSize - 2}`;
    board.classList.add("gameover")

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
                snakeHead[0] -= 1;
                return true;
            }
            return false;
        }
        if (goTo === "s") {
            if (lastCommand !== "w") {
                snakeHead[0] += 1;
                return true;
            }
            return false;
        }
        if (goTo === "a") {
            if (lastCommand !== "d") {
                snakeHead[1] -= 1;
                return true;
            }
            return false;
        }
        if (goTo === "d") {
            if (lastCommand !== "a") {
                snakeHead[1] += 1;
                return true;
            }
            return false;
        }
    }

    function valideWall() {
        if (snakeHead[0] >= lines) {
            snakeHead[0] = 0;
        }
        if (snakeHead[0] < 0) {
            snakeHead[0] = lines;
        }
        if (snakeHead[1] >= columns) {
            snakeHead[1] = 0;
        }
        if (snakeHead[1] < 0) {
            snakeHead[1] = columns;
        }
    }
    return true;
}


function toControl() {
    command = control.value.toLowerCase();
    if (["w", "a", "s", "d"].includes(command)) {
        if (move(command)) {
            lastCommand = command;
        }
    }
    control.value = "";
}

function startAutoMove() {
    autoMove = setInterval(move, (1000 / (snakeSize / 2)));
}
function stopAutoMove() {
    clearInterval(autoMove);
}

control = document.getElementById("control")
control.addEventListener('input', toControl)

boardCreate();
game()

generateFood();