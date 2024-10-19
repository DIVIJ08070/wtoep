document.addEventListener('DOMContentLoaded', function () {
    const AI_PLAYER = 1;
    const HUMAN_PLAYER = -1;
    const EMPTY = 0;
    const ROWS = 6;
    const COLS = 7;
    let board;
    let currentPlayer;
    let gameOver = false;
    const MAX_DEPTH = 7;

    function createBoard() {
        board = [];
        const gameBoard = document.getElementById('gameboard');
        gameBoard.innerHTML = '';

        for (let row = 0; row < ROWS; row++) {
            const newRow = [];
            for (let col = 0; col < COLS; col++) {
                newRow.push(EMPTY);
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.dataset.row = row;
                tile.dataset.col = col;
                tile.addEventListener('click', handleTileClick);
                gameBoard.appendChild(tile);
            }
            board.push(newRow);
        }

        currentPlayer = HUMAN_PLAYER;
        gameOver = false;
        document.getElementById('status').textContent = 'Your turn!';
    }

    function handleTileClick(event) {
        if (gameOver || currentPlayer !== HUMAN_PLAYER) return;

        const col = event.target.dataset.col;
        if (makeMove(board, col, HUMAN_PLAYER)) {
            updateBoard();
            if (checkWin(board, HUMAN_PLAYER)) {
                gameOver = true;
                document.getElementById('status').textContent = 'You win!';
            } else {
                currentPlayer = AI_PLAYER;
                document.getElementById('status').textContent = 'AI thinking...';
                setTimeout(() => {
                    aiMove();
                }, 500);
            }
        }
    }

    function aiMove() {
        const bestMove = getBestMove(board);
        makeMove(board, bestMove, AI_PLAYER);
        updateBoard();

        if (checkWin(board, AI_PLAYER)) {
            gameOver = true;
            document.getElementById('status').textContent = 'AI wins!';
        } else {
            currentPlayer = HUMAN_PLAYER;
            document.getElementById('status').textContent = 'Your turn!';
        }
    }

    function updateBoard() {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => {
            const row = tile.dataset.row;
            const col = tile.dataset.col;
            const player = board[row][col];
            if (player === AI_PLAYER) {
                tile.dataset.player = AI_PLAYER;
            } else if (player === HUMAN_PLAYER) {
                tile.dataset.player = HUMAN_PLAYER;
            } else {
                tile.removeAttribute('data-player');
            }
        });
    }

    function makeMove(board, col, player) {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row][col] === EMPTY) {
                board[row][col] = player;
                return true;
            }
        }
        return false;
    }

    function undoMove(board, col) {
        for (let row = 0; row < ROWS; row++) {
            if (board[row][col] !== EMPTY) {
                board[row][col] = EMPTY;
                break;
            }
        }
    }

    function getAvailableMoves(board) {
        const moves = [];
        for (let col = 0; col < COLS; col++) {
            if (board[0][col] === EMPTY) {
                moves.push(col);
            }
        }
        return moves;
    }

    function checkWin(board, player) {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                if (board[row][col] === player &&
                    board[row][col + 1] === player &&
                    board[row][col + 2] === player &&
                    board[row][col + 3] === player) {
                    return true;
                }
            }
        }

        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS - 3; row++) {
                if (board[row][col] === player &&
                    board[row + 1][col] === player &&
                    board[row + 2][col] === player &&
                    board[row + 3][col] === player) {
                    return true;
                }
            }
        }

        for (let row = 3; row < ROWS; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                if (board[row][col] === player &&
                    board[row - 1][col + 1] === player &&
                    board[row - 2][col + 2] === player &&
                    board[row - 3][col + 3] === player) {
                    return true;
                }
            }
        }

        for (let row = 0; row < ROWS - 3; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                if (board[row][col] === player &&
                    board[row + 1][col + 1] === player &&
                    board[row + 2][col + 2] === player &&
                    board[row + 3][col + 3] === player) {
                    return true;
                }
            }
        }

        return false;
    }

    function getBestMove(board) {
        let bestValue = -Infinity;
        let bestMove = -1;

        for (let col of getAvailableMoves(board)) {
            makeMove(board, col, AI_PLAYER);
            let moveValue = minimax(board, MAX_DEPTH, false);
            undoMove(board, col);

            if (moveValue > bestValue) {
                bestValue = moveValue;
                bestMove = col;
            }
        }

        return bestMove;
    }

    function minimax(board, depth, isMaximizing) {
        if (checkWin(board, AI_PLAYER)) {
            return 10;
        }
        if (checkWin(board, HUMAN_PLAYER)) {
            return -10;
        }
        if (getAvailableMoves(board).length === 0) {
            return 0;
        }
        if (depth === 0) {
            return 0;
        }

        if (isMaximizing) {
            let bestValue = -Infinity;
            for (let col of getAvailableMoves(board)) {
                makeMove(board, col, AI_PLAYER);
                bestValue = Math.max(bestValue, minimax(board, depth - 1, false) - 1);
                undoMove(board, col);
            }
            return bestValue;
        } else {
            let bestValue = Infinity;
            for (let col of getAvailableMoves(board)) {
                makeMove(board, col, HUMAN_PLAYER);
                bestValue = Math.min(bestValue, minimax(board, depth - 1, true) - 1);
                undoMove(board, col);
            }
            return bestValue;
        }
    }

    document.getElementById('restart-btn').addEventListener('click', createBoard);

    createBoard();
});
