"use strict";
let boardSize = 10;
let numMine = 10;
let isMinePlaced = false;
let remainingFlags = numMine;
let gameEnded = false;
// define a board
let board;
// Initalize the game
function initializeGame() {
    const boardSizeInput = document.getElementById("board-size");
    const numMineInput = document.getElementById("mine-count");
    boardSize = parseInt(boardSizeInput.value || "10");
    numMine = parseInt(numMineInput.value || "10");
    isMinePlaced = false;
    remainingFlags = numMine;
    gameEnded = false;
    board = Array.from({ length: boardSize }, () => Array.from({ length: boardSize }, () => ({
        mine: false,
        revealed: false,
        flagged: false,
        adjecentMines: 0,
    })));
    createBoard();
}
function createBoard() {
    const web_board = document.getElementById('game-board');
    web_board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    web_board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    web_board.innerHTML = '';
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            cellDiv.dataset.row = row.toString();
            cellDiv.dataset.col = col.toString();
            cellDiv.addEventListener('click', handleCellClick);
            cellDiv.addEventListener('contextmenu', handleRightClick);
            web_board.appendChild(cellDiv);
        }
    }
    updateFlagCounter();
    document.getElementById("message").textContent = "";
    document.getElementById("restart-button").style.display = "none";
    gameEnded = false;
}
function handleCellClick(event) {
    if (gameEnded) {
        return;
    }
    const target = event.target;
    const row = parseInt(target.dataset.row);
    const col = parseInt(target.dataset.col);
    if (!board[row][col].revealed && !board[row][col].flagged) {
        if (!isMinePlaced) {
            placeMines(row, col);
            calculateAdjacentMines();
        }
        revealCell(row, col);
    }
}
function handleRightClick(event) {
    event.preventDefault();
    if (gameEnded) {
        return;
    }
    const target = event.target;
    const row = parseInt(target.dataset.row);
    const col = parseInt(target.dataset.col);
    if (!board[row][col].revealed) {
        toggleFlag(target, row, col);
        checkWin();
    }
}
function toggleFlag(target, row, col) {
    if (board[row][col].flagged) {
        board[row][col].flagged = false;
        target.classList.remove("flagged");
        target.textContent = "";
        remainingFlags += 1;
    }
    else if (remainingFlags > 0) {
        board[row][col].flagged = true;
        target.classList.add("flagged");
        target.textContent = "🚩";
        remainingFlags -= 1;
    }
    updateFlagCounter();
}
function updateFlagCounter() {
    const flagCounter = document.getElementById("flag-counter");
    flagCounter.textContent = `Flag: ${remainingFlags}`;
}
function checkWin() {
    let allMinesFlagged = true;
    let allFlagsCorrect = true;
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col].mine && !board[row][col].flagged) {
                allMinesFlagged = false;
            }
            if (!board[row][col].mine && board[row][col].flagged) {
                allFlagsCorrect = false;
            }
        }
    }
    if (allFlagsCorrect && allMinesFlagged) {
        endGame(true);
    }
}
function endGame(won) {
    gameEnded = true;
    const message = document.getElementById("message");
    const restartButton = document.getElementById("restart-button");
    restartButton.style.display = "block";
    if (won) {
        message.textContent = "YOU WIN!";
    }
    else {
        message.textContent = "GAME OVER!";
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const cellDiv = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                if (board[row][col].mine) {
                    cellDiv.textContent = "💣";
                    cellDiv.classList.add("revealed");
                }
                else if (board[row][col].flagged) {
                    cellDiv.textContent = "❌";
                    cellDiv.classList.add("wrong-flag");
                }
            }
        }
    }
}
function placeMines(firstROW, firstCOL) {
    // Initialize a flatten 
    let flatten = [];
    for (let i = 0; i < boardSize * boardSize; i++) {
        if (i < numMine) {
            flatten.push(1);
        }
        else {
            flatten.push(0);
        }
    }
    shuffle(flatten, firstROW * boardSize + firstCOL - 1);
    for (let i = 0; i < boardSize * boardSize; i++) {
        let row = Math.floor(i / boardSize);
        let col = i % boardSize;
        if (flatten[i] == 1) {
            board[row][col].mine = true;
            console.log(i, row, col);
        }
    }
    console.log(board[firstROW][firstCOL].mine);
    isMinePlaced = true;
}
function shuffle(flatten, first) {
    for (let i = 0; i < boardSize * boardSize; i++) {
        let j = Math.floor(Math.random() * flatten.length - 1);
        [flatten[i], flatten[j]] = [flatten[j], flatten[i]];
    }
    if (flatten[first] === 1) {
        [flatten[first], flatten[flatten.length - 1]] = [flatten[flatten.length - 1], flatten[first]];
    }
}
function calculateAdjacentMines() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (!board[row][col].mine) {
                let adjMines = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        const newRow = row + i;
                        const newCol = col + j;
                        if (newRow >= 0 && newRow < boardSize &&
                            newCol >= 0 && newCol < boardSize &&
                            board[newRow][newCol].mine) {
                            adjMines += 1;
                        }
                    }
                }
                board[row][col].adjecentMines = adjMines;
            }
        }
    }
}
function revealCell(row, col) {
    const cell = board[row][col];
    if (cell.revealed) {
        return;
    }
    cell.revealed = true;
    const cellDiv = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cellDiv.classList.add("revealed");
    // If this cell is placed mine, game over.
    if (cell.mine) {
        cellDiv.textContent = "💣";
        cellDiv.style.backgroundColor = "red";
        endGame(false);
    }
    else {
        if (cell.adjecentMines > 0) {
            cellDiv.textContent = cell.adjecentMines.toString();
        }
        else {
            cellDiv.textContent = "";
        }
        cellDiv.style.backgroundColor = "#bbb";
        if (cell.adjecentMines === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;
                    if (newRow >= 0 && newRow < boardSize &&
                        newCol >= 0 && newCol < boardSize) {
                        revealCell(newRow, newCol);
                    }
                }
            }
        }
    }
}
