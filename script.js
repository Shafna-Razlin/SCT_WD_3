document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const currentPlayerDisplay = document.getElementById('currentPlayer');
    const messageDisplay = document.getElementById('message');
    const pvpBtn = document.getElementById('pvpBtn');
    const pvcBtn = document.getElementById('pvcBtn');
    const resetBtn = document.getElementById('resetBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    const xScoreDisplay = document.getElementById('xScore');
    const oScoreDisplay = document.getElementById('oScore');
    const tiesDisplay = document.getElementById('ties');

    // Game Variables
    let boardState = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let gameMode = 'pvp'; // 'pvp' or 'pvc'
    let scores = { X: 0, O: 0, ties: 0 };
    
    // Winning Conditions
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    // Initialize Game
    function initGame() {
        boardState = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        messageDisplay.textContent = '';
        
        currentPlayerDisplay.textContent = currentPlayer;
        currentPlayerDisplay.style.color = currentPlayer === 'X' ? 'var(--x-color)' : 'var(--o-color)';
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'win');
        });
    }

    // Handle Cell Click
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // If cell is already filled or game is not active, ignore click
        if (boardState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        // Update board state and UI
        boardState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        // Check for win or draw
        checkResult();
        
        // If playing against computer and game is still active
        if (gameMode === 'pvc' && gameActive && currentPlayer === 'O') {
            setTimeout(makeComputerMove, 500);
        }
    }

    // Check Game Result
    function checkResult() {
        let roundWon = false;
        
        // Check all winning conditions
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (boardState[a] === '' || boardState[b] === '' || boardState[c] === '') {
                continue;
            }
            
            if (boardState[a] === boardState[b] && boardState[b] === boardState[c]) {
                roundWon = true;
                
                // Highlight winning cells
                cells[a].classList.add('win');
                cells[b].classList.add('win');
                cells[c].classList.add('win');
                break;
            }
        }
        
        // If won
        if (roundWon) {
            messageDisplay.textContent = `Player ${currentPlayer} wins!`;
            scores[currentPlayer]++;
            updateScoreboard();
            gameActive = false;
            return;
        }
        
        // If draw
        if (!boardState.includes('')) {
            messageDisplay.textContent = "Game ended in a draw!";
            scores.ties++;
            updateScoreboard();
            gameActive = false;
            return;
        }
        
        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        currentPlayerDisplay.textContent = currentPlayer;
        currentPlayerDisplay.style.color = currentPlayer === 'X' ? 'var(--x-color)' : 'var(--o-color)';
    }

    // Computer Move (Simple AI)
    function makeComputerMove() {
        if (!gameActive) return;
        
        // Try to win first
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (boardState[a] === 'O' && boardState[b] === 'O' && boardState[c] === '') {
                makeMove(c);
                return;
            }
            if (boardState[a] === 'O' && boardState[c] === 'O' && boardState[b] === '') {
                makeMove(b);
                return;
            }
            if (boardState[b] === 'O' && boardState[c] === 'O' && boardState[a] === '') {
                makeMove(a);
                return;
            }
        }
        
        // Block player from winning
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (boardState[a] === 'X' && boardState[b] === 'X' && boardState[c] === '') {
                makeMove(c);
                return;
            }
            if (boardState[a] === 'X' && boardState[c] === 'X' && boardState[b] === '') {
                makeMove(b);
                return;
            }
            if (boardState[b] === 'X' && boardState[c] === 'X' && boardState[a] === '') {
                makeMove(a);
                return;
            }
        }
        
        // Take center if available
        if (boardState[4] === '') {
            makeMove(4);
            return;
        }
        
        // Take a random available spot
        const availableSpots = boardState.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        if (availableSpots.length > 0) {
            const randomSpot = availableSpots[Math.floor(Math.random() * availableSpots.length)];
            makeMove(randomSpot);
        }
    }

    // Helper function for computer move
    function makeMove(index) {
        boardState[index] = 'O';
        cells[index].textContent = 'O';
        cells[index].classList.add('o');
        checkResult();
    }

    // Update Scoreboard
    function updateScoreboard() {
        xScoreDisplay.textContent = `X: ${scores.X}`;
        oScoreDisplay.textContent = `O: ${scores.O}`;
        tiesDisplay.textContent = `Ties: ${scores.ties}`;
    }

    // Reset Scores
    function resetScores() {
        scores = { X: 0, O: 0, ties: 0 };
        updateScoreboard();
    }

    // Event Listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    pvpBtn.addEventListener('click', () => {
        gameMode = 'pvp';
        pvpBtn.classList.add('active');
        pvcBtn.classList.remove('active');
        initGame();
    });

    pvcBtn.addEventListener('click', () => {
        gameMode = 'pvc';
        pvcBtn.classList.add('active');
        pvpBtn.classList.remove('active');
        initGame();
    });

    resetBtn.addEventListener('click', initGame);

    newGameBtn.addEventListener('click', () => {
        resetScores();
        initGame();
    });

    // Initialize the game
    initGame();
});