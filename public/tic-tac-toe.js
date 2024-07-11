// Your code here
let currentPlayer = "X";
let gameBoard = [null, null, null, null, null, null, null, null, null];
let players = {
	X: 0,
	O: 0,
};
let gameOver = false;
let gamestate = {
	players: players,
	currentPlayer: currentPlayer,
	gameBoard: gameBoard,
	gameOver: gameOver,
};
// let currentPlayer = gamestate.currentPlayer;
// let gameBoard = gamestate.gameBoard;
// let players = gamestate.players;
const squares = document.getElementsByClassName("square");

const updateLocal = () => {
	gamestate.currentPlayer = currentPlayer;
	gamestate.gameOver = gameOver;
	updateScore();
	localStorage.setItem("gamestate", JSON.stringify(gamestate));
};

const getLocal = () => {
	if (localStorage.getItem("gamestate")) {
		gamestate = JSON.parse(localStorage.getItem("gamestate"));
	}
};

const removeClick = () => {
	for (let square of squares) {
		square.removeEventListener("click", playTurn);
	}
};

const checkwinner = () => {
	const winning = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let combos of winning) {
		const [x, y, z] = combos;

		if (!gameBoard[x] || !gameBoard[y] || !gameBoard[z]) {
			continue;
		} else if (gameBoard[x] === gameBoard[y] && gameBoard[y] === gameBoard[z]) {
			return true;
		}
	}

	return false;
};

const checkTie = () => {
	for (let i = 0; i < 9; i++) {
		if (!gameBoard[i]) return false;
	}
	h1.innerText = "TIE GAME";
	giveUpButton.removeEventListener("click", giveUp);
	newButton.addEventListener("click", newGame);
	gameOver = true;
	updateLocal();
};

const addToBoard = (coordinates) => {
	let [x] = coordinates;
	gameBoard[x] = currentPlayer;
	return checkwinner();
};

const declare = () => {
	h1.innerText = `${currentPlayer} has WON!`;
	players[currentPlayer]++;
	newButton.addEventListener("click", newGame);
	giveUpButton.removeEventListener("click", giveUp);
	removeClick();
	console.log(gamestate);
	console.log(currentPlayer);
	gameOver = true;
	updateLocal();
};

const playTurn = (event) => {
	if (currentPlayer === "X") {
		event.target.style.backgroundImage = "url('https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-x.svg')";
		let coordinates = event.target.id;
		event.target.removeEventListener("click", playTurn);
		if (addToBoard(coordinates)) {
			declare();
		} else {
			checkTie();
		}
		currentPlayer = "O";
	} else {
		event.target.style.backgroundImage = "url('https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-o.svg')";
		let coordinates = event.target.id;
		event.target.removeEventListener("click", playTurn);
		if (addToBoard(coordinates)) {
			declare();
		} else {
			checkTie();
		}
		currentPlayer = "X";
	}
	updateLocal();
	console.log("current", currentPlayer);
	console.log("gamecurrent", gamestate.currentPlayer);
};

const clickSquare = () => {
	giveUpButton.addEventListener("click", giveUp);

	for (let square of squares) {
		square.addEventListener("click", playTurn);
		square.style.backgroundImage = "none";
	}
};

const newGame = () => {
	clickSquare();
	gameBoard.fill(null);
	console.log(players);
	currentPlayer = "X";
	h1.innerText = "";
	newButton.removeEventListener("click", newGame);
	gameOver = false;
	updateLocal();
	console.log(gamestate);
	console.log(currentPlayer);
};

const giveUp = () => {
	currentPlayer = currentPlayer === "X" ? "O" : "X";
	declare();
	giveUpButton.removeEventListener("click", giveUp);
	gameOver = true;
	updateLocal();
};

const renderGameState = () => {
	console.log(gamestate);

	gameBoard = gamestate.gameBoard;
	players = gamestate.players;
	currentPlayer = gamestate.currentPlayer;
	gameOver = gamestate.gameOver;
	console.log(gameBoard);
	if (gameOver === true) {
		newGame();
	} else {
		for (let square of squares) {
			if (gameBoard[square.id] === null) {
				square.addEventListener("click", playTurn);
			} else {
				if (gameBoard[square.id] === "X") {
					square.style.backgroundImage = "url('https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-x.svg')";
				} else {
					square.style.backgroundImage = "url('https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-o.svg')";
				}
			}
		}
	}
};
const updateScore = () => {
	let x = gamestate.players["X"];
	let o = gamestate.players["O"];
	oScoreArea.innerText = `O: ${o}`;
	xScoreArea.innerText = `X: ${x}`;
};

document.addEventListener("DOMContentLoaded", () => {
	giveUpButton = document.getElementById("giveUpButton");
	newButton = document.getElementById("newGameButton");
	winner = document.getElementById("winnerArea");
	oScoreArea = document.getElementById("o-score");
	xScoreArea = document.getElementById("x-score");
	h1 = winner.children[0];

	getLocal();
	updateScore();
	if (!localStorage.getItem("gamestate")) {
		clickSquare();
	} else {
		renderGameState();
	}

	document.addEventListener("click", updateLocal);
});
