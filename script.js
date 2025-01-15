const sudokuGrid = document.getElementById("sudoku-grid");
const checkSolutionButton = document.getElementById("check-solution");
const resetButton = document.getElementById("reset");
const numberButtonsContainer = document.getElementById("number-buttons");
let selectedCell = null;

// Example puzzle (0 represents empty cells)
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

// Generate the Sudoku grid
function generateGrid() {
    sudokuGrid.innerHTML = "";
    for (let row = 0; row < 9; row++) {
        const tr = document.createElement("tr");
        for (let col = 0; col < 9; col++) {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.min = 1;
            input.max = 9;
            input.value = puzzle[row][col] !== 0 ? puzzle[row][col] : "";
            input.disabled = puzzle[row][col] !== 0; // Disable pre-filled cells
            td.appendChild(input);
            tr.appendChild(td);
        }
        sudokuGrid.appendChild(tr);
    }
}

// Check if the solution is correct
function checkSolution() {
    const inputs = sudokuGrid.querySelectorAll("input");
    const solution = Array.from(inputs).map(
        (input) => Number(input.value) || 0
    );
    const isValid = validateSolution(solution);
    alert(isValid ? "Correct Solution!" : "Solution is incorrect. Try again.");
}

// Validate the solution
function validateSolution(solution) {
    // Check rows, columns, and 3x3 boxes for duplicates
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

// Check if an array has unique numbers (1-9)
function isUnique(arr) {
    const nums = arr.filter((num) => num > 0);
    return new Set(nums).size === nums.length;
}

// Reset the grid
function resetGrid() {
    generateGrid();
}

// Event listeners
checkSolutionButton.addEventListener("click", checkSolution);
resetButton.addEventListener("click", resetGrid);

// Generate number buttons (1-9)
function generateNumberButtons() {
    numberButtonsContainer.innerHTML = ""; // Clear existing buttons
    for (let i = 1; i <= 9; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.addEventListener("click", () => fillSelectedCell(i));
        numberButtonsContainer.appendChild(button);
    }
}

// Fill the selected cell with the chosen number
function fillSelectedCell(number) {
    if (selectedCell && !selectedCell.disabled) {
        selectedCell.value = number;
    }
}

// Highlight the currently selected cell
sudokuGrid.addEventListener("click", (event) => {
    const input = event.target.closest("input");
    if (input) {
        selectedCell = input;
    }
});

// Initialize the game
generateGrid();
generateNumberButtons();