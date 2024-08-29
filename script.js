const gameboard = (() => {
    const board = Array(9).fill("");

    const getBoard = () => board;

    const updateBoard = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
        }
    }

    const resetBoard = () => board.fill("");

    return {
        getBoard,
        updateBoard,
        resetBoard 
    };
})();

const Player = (name, marker) => {
    let score = 0;
    let moves = [];
    const getMoves = () => moves;
    const addScore = () => score++;
    const getScore = () => score;
    const addMove = (num) => moves.push(num);
    const resetMoves = () => moves = []
    return { name, marker, addScore, getScore, getMoves, addMove, resetMoves}
}

const gameLogic = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let gameOver = false;
    let currentPlayer = player1;

    const winCon = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const getCurrentPlayer = () => currentPlayer;

    const switchPlayer = () => {
        if (currentPlayer == player1) currentPlayer = player2;
        else currentPlayer = player1;
    };

    const checkWinner = (player) => {
        for (const win of winCon) {
            if (win.every(num => player.getMoves().includes(num))) {
                return true;
            }
        }
        return false;
    }

    const resetGame = () => {
        gameOver = false;
        player1.resetMoves();
        player2.resetMoves();
        currentPlayer = player1;
        gameboard.resetBoard();
    }

    const playTurn = (index) => {
        if (gameOver || gameboard.getBoard()[index] !== "") return;

        gameboard.updateBoard(index, currentPlayer.marker);
        currentPlayer.addMove(index);

        if (checkWinner(currentPlayer)) {
            currentPlayer.addScore();
            gameOver = true;
            return;
        }

        switchPlayer();
    }


    return { player1, player2, getCurrentPlayer, switchPlayer, checkWinner, resetGame, playTurn }
})();

const displayController = (() => {
    const p1name = document.getElementById("p1-name");
    const p2name = document.getElementById("p2-name");
    const p1score = document.getElementById("p1-score");
    const p2score = document.getElementById("p2-score");
    const p1settings = document.getElementById("p1-settings");
    const p2settings = document.getElementById("p2-settings");
    const p1close = document.getElementById("p1-close");
    const p2close = document.getElementById("p2-close");
    const cells = document.querySelectorAll(".cell");
    const message = document.getElementById("message");
    const resetButton = document.getElementById("reset");

    const updateMessage = (text) => {
        message.textContent = text;
    }

    const displayBoard = () => {
        const board = gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
        p1name.textContent = gameLogic.player1.name;
        p2name.textContent = gameLogic.player2.name;
        p1score.textContent = gameLogic.player1.getScore();
        p2score.textContent = gameLogic.player2.getScore();
    };

    const clickCell = (index) => {
        gameLogic.playTurn(index);
        displayBoard();


        if (gameLogic.checkWinner(gameLogic.getCurrentPlayer())) {
            updateMessage(`${gameLogic.getCurrentPlayer().name} wins!`);
        } else if (gameboard.getBoard().every(cell => cell !== "")) {
            updateMessage(`It's a tie!`);
        } else {
            updateMessage(`${gameLogic.getCurrentPlayer().name}'s turn`);
        }

    };

    const init = () => {
        updateMessage(`${gameLogic.getCurrentPlayer().name} begins!`);

        cells.forEach((cell, index) => {
            cell.addEventListener("click", () => clickCell(index));
        });
        
        resetButton.addEventListener("click", () => {
            gameLogic.resetGame();
            displayBoard();
            updateMessage(`${gameLogic.getCurrentPlayer().name} begins!`);
        });

        p1settings.addEventListener("click", () => {
            document.getElementById("p1-modal").showModal();
        });

        p1close.addEventListener("click", () => {
            gameLogic.player1.name = document.getElementById("p1-newName").value;
            document.getElementById("p1-modal").close();
            displayBoard();
        });

        p2settings.addEventListener("click", () => {
            document.getElementById("p2-modal").showModal();
        });

        p2close.addEventListener("click", () => {
            gameLogic.player2.name = document.getElementById("p2-newName").value;
            document.getElementById("p2-modal").close();
            displayBoard();
        });

        displayBoard();
    }

    return { init };
})();

displayController.init();