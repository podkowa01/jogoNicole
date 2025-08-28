document.addEventListener('DOMContentLoaded', () => {
    // Referências para os elementos do HTML
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    const winModal = document.getElementById('win-modal');
    const finalTimeElement = document.getElementById('final-time');

    // Array de pares de ícones. Você pode usar emojis, letras, ou imagens.
    const cardIcons = ['🍎', '🍌', '🍓', '🍇', '🍉', '🍍', '🍋', '🍑'];
    const cards = [...cardIcons, ...cardIcons]; // Duplica para formar os pares

    // Variáveis do jogo
    let flippedCards = [];
    let matchedPairs = 0;
    let isWaiting = false;
    let timerInterval;
    let seconds = 0;

    // --- Funções do Jogo ---

    // Função para embaralhar o array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Cria o tabuleiro do jogo
    function createBoard() {
        gameBoard.innerHTML = '';
        shuffle(cards);

        cards.forEach(icon => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.icon = icon;

            const cardInner = document.createElement('div');
            cardInner.classList.add('card-inner');

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            cardFront.textContent = icon;

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');
            cardBack.textContent = '?';

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);
            gameBoard.appendChild(card);

            card.addEventListener('click', flipCard);
        });
    }

    // Vira a carta quando clicada
    function flipCard() {
        // Não faz nada se já está esperando ou se a carta já está virada
        if (isWaiting || this.classList.contains('flipped') || this.classList.contains('matched')) {
            return;
        }

        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            isWaiting = true;
            setTimeout(checkMatch, 1000);
        }
    }

    // Verifica se as duas cartas viradas são um par
    function checkMatch() {
        const [card1, card2] = flippedCards;
        const icon1 = card1.dataset.icon;
        const icon2 = card2.dataset.icon;

        if (icon1 === icon2) {
            // Se for um par, marca como "matched"
            card1.classList.add('matched');
            card2.classList.add('matched');
            card1.removeEventListener('click', flipCard);
            card2.removeEventListener('click', flipCard);
            matchedPairs++;
            scoreElement.textContent = `Pares encontrados: ${matchedPairs}`;
        } else {
            // Se não for, desvira as cartas
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }

        flippedCards = [];
        isWaiting = false;

        // Verifica se o jogo terminou
        if (matchedPairs === cardIcons.length) {
            endGame();
        }
    }

    // Inicia o temporizador
    function startTimer() {
        seconds = 0;
        timerElement.textContent = `Tempo: 0s`;
        timerInterval = setInterval(() => {
            seconds++;
            timerElement.textContent = `Tempo: ${seconds}s`;
        }, 1000);
    }

    // Finaliza o jogo
    function endGame() {
        clearInterval(timerInterval);
        finalTimeElement.textContent = `Seu tempo: ${seconds} segundos`;
        winModal.style.display = 'flex';
    }

    // Função para reiniciar o jogo
    window.startGame = () => {
        winModal.style.display = 'none';
        flippedCards = [];
        matchedPairs = 0;
        scoreElement.textContent = `Pares encontrados: 0`;
        clearInterval(timerInterval);
        startTimer();
        createBoard();
    };

    // Inicia o jogo quando a página carrega
    startGame();
});