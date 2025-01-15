const sudokuGrid = document.getElementById("sudoku-grid");
const checkSolutionButton = document.getElementById("check-solution");
const resetButton = document.getElementById("reset");
const numberButtonsContainer = document.getElementById("number-buttons");
const timerDisplay = document.querySelector("#timer");
const darkModeToggle = document.getElementById("dark-mode-toggle");
let selectedCell = null;
let timer, elapsedTime = 0;

document.addEventListener("DOMContentLoaded", () => {
    initGame();
});

darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    darkModeToggle.textContent = 
        document.body.classList.contains("dark-mode") 
        ? "Light Mode" 
        : "Dark Mode";
});

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.toggle("dark-mode");
}

function initGame() {
    generateGrid();
    generateNumberButtons();
    startTimer();
    checkSolutionButton.addEventListener("click", checkSolution);
    resetButton.addEventListener("click", resetGame);
}

function startTimer() {
    clearInterval(timer);
    elapsedTime = 0;
    updateTimer();
    timer = setInterval(() => {
        elapsedTime++;
        updateTimer();
    }, 1000);
}

function updateTimer() {
    const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, "0");
    const seconds = String(elapsedTime % 60).padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function generateGrid() {
    const puzzle = generateSudoku();
    sudokuGrid.innerHTML = "";
    puzzle.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");
        row.forEach((value, colIndex) => {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.type = "text";
            input.value = value || "";
            input.disabled = !!value;
            input.dataset.row = rowIndex;
            input.dataset.col = colIndex;
            td.appendChild(input);
            tr.appendChild(td);
        });
        sudokuGrid.appendChild(tr);
    });
    sudokuGrid.addEventListener("click", (e) => {
        const input = e.target.closest("input");
        if (input) selectedCell = input;
    });
}

function generateSudoku(blanks = 60) {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillGrid(grid);
    while (blanks > 0) {
        const r = Math.floor(Math.random() * 9);
        const c = Math.floor(Math.random() * 9);
        if (grid[r][c]) {
            grid[r][c] = 0;
            blanks--;
        }
    }
    return grid;
}

function fillGrid(grid) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                shuffle(nums);
                for (let num of nums) {
                    if (isValid(grid, row, col, num)) {
                        grid[row][col] = num;
                        if (fillGrid(grid)) return true;
                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValid(grid, row, col, num) {
    const boxRow = Math.floor(row / 3) * 3, boxCol = Math.floor(col / 3) * 3;
    return !grid[row].includes(num) &&
           !grid.some((r) => r[col] === num) &&
           !grid.slice(boxRow, boxRow + 3).some((r) => r.slice(boxCol, boxCol + 3).includes(num));
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateNumberButtons() {
    numberButtonsContainer.innerHTML = "";
    Array.from({ length: 9 }, (_, i) => i + 1).forEach((num) => {
        const button = document.createElement("button");
        button.textContent = num;
        button.addEventListener("click", () => {
            if (selectedCell && !selectedCell.disabled) selectedCell.value = num;
        });
        numberButtonsContainer.appendChild(button);
    });
}

function checkSolution() {
    const solution = Array.from(sudokuGrid.querySelectorAll("input")).map((input) => +input.value || 0);
    if (validateSolution(solution) && solution.every((num) => num > 0)) {
        clearInterval(timer);
        alert(`Puzzle solved in ${timerDisplay.textContent}!`);
    } else {
        alert("Incorrect solution. Try again.");
    }
}

function validateSolution(solution) {
    for (let i = 0; i < 9; i++) {
        const row = solution.slice(i * 9, (i + 1) * 9);
        const col = solution.filter((_, idx) => idx % 9 === i);
        const box = solution.filter((_, idx) =>
            Math.floor(idx / 27) === Math.floor(i / 3) &&
            Math.floor((idx % 9) / 3) === i % 3
        );
        if (!isUnique(row) || !isUnique(col) || !isUnique(box)) return false;
    }
    return true;
}

function isUnique(arr) {
    const nums = arr.filter((num) => num > 0);
    return new Set(nums).size === nums.length;
}

function resetGame() {
    generateGrid();
    startTimer();
}