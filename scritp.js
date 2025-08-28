document.addEventListener('DOMContentLoaded', () => {
    // --- Referências para os elementos HTML ---
    const gridContainer = document.getElementById('word-search-grid');
    const wordListElement = document.getElementById('word-list');
    
    // --- Configuração do Jogo ---
    const words = ['JAVASCRIPT', 'HTML', 'CSS', 'PROGRAMA', 'CODIGO', 'WEB', 'GOOGLE'];
    const gridSize = 10; // A grade terá 10x10
    let grid = []; // A matriz que armazena as letras
    const foundWords = new Set();
    
    let isSelecting = false;
    let selectedCells = [];

    // --- Funções de Ajuda ---
    function getRandomLetter() {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    // --- Lógica Principal do Jogo ---
    function initializeGame() {
        // Inicializa a grade vazia
        grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));

        // Coloca as palavras na grade em posições aleatórias
        words.sort((a, b) => b.length - a.length).forEach(word => placeWord(word));

        // Preenche o resto da grade com letras aleatórias
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (grid[row][col] === '') {
                    grid[row][col] = getRandomLetter();
                }
            }
        }

        // Renderiza a grade e a lista de palavras no HTML
        renderGrid();
        renderWordList();
    }
    
    // Tenta colocar uma palavra na grade
    function placeWord(word) {
        const directions = [
            { dr: 0, dc: 1 }, // Horizontal
            { dr: 1, dc: 0 }  // Vertical
        ];
        
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;

        while (!placed && attempts < maxAttempts) {
            attempts++;
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const rowStart = Math.floor(Math.random() * gridSize);
            const colStart = Math.floor(Math.random() * gridSize);

            // Verifica se a palavra cabe e se não colide com outras letras
            let canFit = true;
            for (let i = 0; i < word.length; i++) {
                const newRow = rowStart + i * direction.dr;
                const newCol = colStart + i * direction.dc;

                if (newRow >= gridSize || newCol >= gridSize || (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i])) {
                    canFit = false;
                    break;
                }
            }

            if (canFit) {
                // Coloca a palavra na grade
                for (let i = 0; i < word.length; i++) {
                    const newRow = rowStart + i * direction.dr;
                    const newCol = colStart + i * direction.dc;
                    grid[newRow][newCol] = word[i];
                }
                placed = true;
            }
        }
    }

    // Cria os elementos HTML da grade
    function renderGrid() {
        gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        gridContainer.innerHTML = '';
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.textContent = grid[row][col];
                gridContainer.appendChild(cell);
            }
        }
    }

    // Cria a lista de palavras
    function renderWordList() {
        wordListElement.innerHTML = '';
        words.forEach(word => {
            const li = document.createElement('li');
            li.id = `word-${word}`;
            li.textContent = word;
            wordListElement.appendChild(li);
        });
    }

    // Verifica se a seleção do jogador é uma palavra válida
    function checkSelection() {
        if (selectedCells.length === 0) return;

        const selectedWord = selectedCells.map(cell => cell.textContent).join('');
        const reversedWord = selectedCells.map(cell => cell.textContent).reverse().join('');
        
        const found = words.find(word => word === selectedWord || word === reversedWord);

        if (found && !foundWords.has(found)) {
            foundWords.add(found);
            selectedCells.forEach(cell => cell.classList.add('found'));
            
            const listItem = document.getElementById(`word-${found}`);
            if (listItem) {
                listItem.classList.add('found');
            }

            alert(`Parabéns! Você encontrou a palavra: ${found}`);

            if (foundWords.size === words.length) {
                setTimeout(() => alert('Você encontrou todas as palavras!'), 500);
            }
        } else {
            selectedCells.forEach(cell => cell.classList.remove('highlight'));
        }
        selectedCells = [];
    }

    // --- Eventos do Mouse ---
    gridContainer.addEventListener('mousedown', (e) => {
        isSelecting = true;
        selectedCells = [];
        const cell = e.target.closest('.grid-cell');
        if (cell && !cell.classList.contains('found')) {
            cell.classList.add('highlight');
            selectedCells.push(cell);
        }
    });

    gridContainer.addEventListener('mousemove', (e) => {
        if (!isSelecting) return;
        const cell = e.target.closest('.grid-cell');
        if (cell && !selectedCells.includes(cell) && !cell.classList.contains('found')) {
            cell.classList.add('highlight');
            selectedCells.push(cell);
        }
    });

    gridContainer.addEventListener('mouseup', () => {
        isSelecting = false;
        checkSelection();
    });

    // Inicia o jogo
    initializeGame();
});