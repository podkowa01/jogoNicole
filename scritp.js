const words = ['JAVA', 'PYTHON', 'HTML', 'CSS', 'JAVASCRIPT', 'NODE', 'REACT'];
let grid = [];
let selectedWord = '';
let selectedCells = [];

const startButton = document.getElementById('start-game');
const messageDiv = document.getElementById('message');
const wordSearchDiv = document.getElementById('word-search');

startButton.addEventListener('click', startGame);

function startGame() {
    grid = createGrid(10, 10);
    selectedWord = words[Math.floor(Math.random() * words.length)];
    selectedCells = [];
    messageDiv.innerHTML = `Palavra para encontrar: <b>${selectedWord}</b>`;
    generateGrid(grid);
}

function createGrid(rows, cols) {
    let grid = [];
    for (let r = 0; r < rows; r++) {
        grid.push([]);
        for (let c = 0; c < cols; c++) {
            grid[r].push('');
        }
    }
    return grid;
}

function generateGrid(grid) {
    const gridDiv = document.createElement('div');
    gridDiv.classList.add('grid');

    // Adiciona a palavra na grade (horizontal ou vertical)
    placeWordInGrid(grid, selectedWord);

    // Preenche as células vazias com letras aleatórias
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] === '') {
                grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Letras aleatórias de A-Z
            }
        }
    }

    // Exibe a grade na tela
    grid.forEach((row, rIndex) => {
        row.forEach((cell, cIndex) => {
            const cellSpan = document.createElement('span');
            cellSpan.textContent = cell;
            cellSpan.addEventListener('click', () => selectCell(rIndex, cIndex, cellSpan));
            gridDiv.appendChild(cellSpan);
        });
    });

    wordSearchDiv.innerHTML = '';
    wordSearchDiv.appendChild(gridDiv);
}

function placeWordInGrid(grid, word) {
    let placed = false;
    while (!placed) {
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const startRow = Math.floor(Math.random() * grid.length);
        const startCol = Math.floor(Math.random() * grid[0].length);

        if (canPlaceWord(grid, word, startRow, startCol, direction)) {
            for (let i = 0; i < word.length; i++) {
                if (direction === 'horizontal') {
                    grid[startRow][startCol + i] = word[i];
                } else {
                    grid[startRow + i][startCol] = word[i];
                }
            }
            placed = true;
        }
    }
}

function canPlaceWord(grid, word, row, col, direction) {
    if (direction === 'horizontal') {
        if (col + word.length > grid[0].length) return false;
        for (let i = 0; i < word.length; i++) {
            if (grid[row][col + i] !== '') return false;
        }
    } else {
        if (row + word.length > grid.length) return false;
        for (let i = 0; i < word.length; i++) {
            if (grid[row + i][col] !== '') return false;
        }
    }
    return true;
}

function selectCell(row, col, cellSpan) {
    // Marca a célula como selecionada
    if (selectedCells.some(cell => cell.row === row && cell.col === col)) {
        cellSpan.classList.remove('selected');
        selectedCells = selectedCells.filter(cell => cell.row !== row || cell.col !== col);
    } else {
        cellSpan.classList.add('selected');
        selectedCells.push({ row, col, letter: cellSpan.textContent });
    }

    checkWordSelection();
}

function checkWordSelection() {
    const selectedLetters = selectedCells.map(cell => cell.letter).join('');
    if (selectedLetters === selectedWord) {
        messageDiv.innerHTML = `Parabéns! Você encontrou a palavra: <b>${selectedWord}</b>`;
    } else {
        messageDiv.innerHTML = `Palavra para encontrar: <b>${selectedWord}</b>`;
    }
}
