const cells = document.querySelectorAll('.cell');
const messageEl = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn');
const btnPvp = document.getElementById('btn-pvp');
const btnPva = document.getElementById('btn-pva');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let isAiMode = false;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize Game
function initGame() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    resetBtn.addEventListener('click', resetGame);
    btnPvp.addEventListener('click', () => setMode(false));
    btnPva.addEventListener('click', () => setMode(true));
}

function setMode(aiMode) {
    isAiMode = aiMode;
    if (aiMode) {
        btnPva.classList.add('active');
        btnPvp.classList.remove('active');
    } else {
        btnPvp.classList.add('active');
        btnPva.classList.remove('active');
    }
    resetGame();
}

function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || !gameActive) {
        return;
    }

    makeMove(cell, index);

    if (isAiMode && gameActive && currentPlayer === 'O') {
        setTimeout(makeAiMove, 500); // Small delay for realism
    }
}

function makeMove(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    
    checkResult();

    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateMessage();
    }
}

function makeAiMove() {
    // 1. Try to win
    let move = findBestMove('O');
    if (move === -1) {
        // 2. Block player from winning
        move = findBestMove('X');
    }
    if (move === -1) {
        // 3. Take center if available
        if (board[4] === '') {
            move = 4;
        }
    }
    if (move === -1) {
        // 4. Take random available corner
        const corners = [0, 2, 6, 8].filter(i => board[i] === '');
        if (corners.length > 0) {
            move = corners[Math.floor(Math.random() * corners.length)];
        }
    }
    if (move === -1) {
        // 5. Take random available edge
        const edges = [1, 3, 5, 7].filter(i => board[i] === '');
        if (edges.length > 0) {
            move = edges[Math.floor(Math.random() * edges.length)];
        }
    }

    if (move !== -1) {
        const cell = document.querySelector(`.cell[data-index="${move}"]`);
        makeMove(cell, move);
    }
}

function findBestMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === player && board[b] === player && board[c] === '') return c;
        if (board[a] === player && board[c] === player && board[b] === '') return b;
        if (board[b] === player && board[c] === player && board[a] === '') return a;
    }
    return -1;
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            highlightWinningCells([a, b, c]);
            break;
        }
    }

    if (roundWon) {
        messageEl.textContent = `Player ${currentPlayer} Wins! 🎉`;
        messageEl.style.color = currentPlayer === 'X' ? 'var(--x-color)' : 'var(--o-color)';
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        messageEl.textContent = "It's a Draw! 🤝";
        messageEl.style.color = 'var(--text-color)';
        gameActive = false;
        return;
    }
}

function highlightWinningCells(indices) {
    indices.forEach(index => {
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.style.background = 'rgba(255, 255, 255, 0.2)';
        cell.style.transform = 'scale(1.05)';
    });
}

function updateMessage() {
    messageEl.textContent = `Player ${currentPlayer}'s Turn`;
    messageEl.style.color = currentPlayer === 'X' ? 'var(--x-color)' : 'var(--o-color)';
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
        cell.style.background = '';
        cell.style.transform = '';
    });

    updateMessage();
}

initGame();
updateMessage();
