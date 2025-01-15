const sudokuGrid = document.getElementById("sudoku-grid");
const checkSolutionButton = document.getElementById("check-solution");
const resetButton = document.getElementById("reset");
const numberButtonsContainer = document.getElementById("number-buttons");
let selectedCell = null;
let noteMode = false;
let mistakeCount = 0;
let timeInterval;
let elapsedTime = 0;

document.addEventListener("DOMContentLoaded", () => {
    startTimer();
});

function startTimer() {
    clearInterval(timeInterval);
    elapsedTime = 0;
    updateTimerDisplay(elapsedTime);

    timeInterval = setInterval(() => {
        elapsedTime++;
        updateTimerDisplay(elapsedTime);
    }, 1000);
}

function updateTimerDisplay(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, "0");
    const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    document.querySelector("#timer").textContent = `${minutes}:${seconds}`;
}

function stopTimer() {
    clearInterval(timeInterval);
}

const puzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

function generateCompleteGrid() {
    const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillGrid(grid);
    return grid;
}

function fillGrid(grid) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                shuffleArray(numbers);
                for (let num of numbers) {
                    if (isValidPlacement(grid, row, col, num)) {
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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generatePuzzle(grid, difficulty = 40) {
    const puzzle = grid.map((row) => row.slice());
    let attempts = difficulty;

    while (attempts > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (puzzle[row][col] !== 0) {
            const backup = puzzle[row][col];
            puzzle[row][col] = 0;

            // Check if the puzzle has a unique solution
            if (!hasUniqueSolution(puzzle)) {
                puzzle[row][col] = backup;
            } else {
                attempts--;
            }
        }
    }

    return puzzle;
}

function hasUniqueSolution(grid) {
    let solutions = 0;
    solve(grid, () => solutions++);
    return solutions === 1;
}

function solve(grid, onSolutionFound = () => {}) {
    const emptyCell = findEmptyCell(grid);
    if (!emptyCell) {
        onSolutionFound();
        return true;
    }

    const [row, col] = emptyCell;
    for (let num = 1; num <= 9; num++) {
        if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;
            if (solve(grid, onSolutionFound)) return true;
            grid[row][col] = 0;
        }
    }

    return false;
}

function findEmptyCell(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) return [row, col];
        }
    }
    return null;
}

function isValidPlacement(grid, row, col, num) {
    // Check row
    if (grid[row].includes(num)) return false;

    // Check column
    for (let i = 0; i < 9; i++) {
        if (grid[i][col] === num) return false;
    }

    // Check 3x3 grid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (grid[i][j] === num) return false;
        }
    }

    return true;
}

function generateGrid() {
    sudokuGrid.innerHTML = "";
    for (let row = 0; row < 9; row++) {
        const tr = document.createElement("tr");
        for (let col = 0; col < 9; col++) {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.type = "text";
            input.inputMode = "numeric";
            input.pattern = "[0-9]*";
            input.value = puzzle[row][col] !== 0 ? puzzle[row][col] : "";
            input.disabled = puzzle[row][col] !== 0;
            td.appendChild(input);
            tr.appendChild(td);
        }
        sudokuGrid.appendChild(tr);
    }
}

function checkSolution() {
    const inputs = sudokuGrid.querySelectorAll("input");
    const solution = Array.from(inputs).map(
        (input) => Number(input.value) || 0
    );
    const isValid = validateSolution(solution);
    if (isValid) stopTimer();
    alert(isValid ? `Congratulations, you solved the puzzle in ${document.querySelector("#timer".textContent)}` : "Solution is incorrect. Try again.");
}

function validateSolution(solution) {
    for (let i = 0; i < 9; i++) {
        const row = solution.slice(i * 9, (i + 1) * 9);
        const col = solution.filter((_, index) => index % 9 === i);
        const box = solution.filter(
            (_, index) =>
                Math.floor(index / 27) === Math.floor(i / 3) &&
                Math.floor((index % 9) / 3) === i % 3
        );
        if (!isUnique(row) || !isUnique(col) || !isUnique(box)) {
            return false;
        }
    }
    return true;
}

function isUnique(arr) {
    const nums = arr.filter((num) => num > 0);
    return new Set(nums).size === nums.length;
}

function resetGrid() {
    generateGrid();
    startTimer();
}

checkSolutionButton.addEventListener("click", checkSolution);
resetButton.addEventListener("click", resetGrid);

function generateNumberButtons() {
    numberButtonsContainer.innerHTML = "";
    for (let i = 1; i <= 9; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.addEventListener("click", () => fillSelectedCell(i));
        numberButtonsContainer.appendChild(button);
    }
}

function fillSelectedCell(number) {
    if (selectedCell && !selectedCell.disabled) {
        selectedCell.value = number;
    }
}

sudokuGrid.addEventListener("click", (event) => {
    const input = event.target.closest("input");
    if (input) {
        selectedCell = input;
    }
});

generateGrid();
generateNumberButtons();