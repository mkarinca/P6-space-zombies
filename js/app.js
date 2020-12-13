import Player from "./player";
import { player1, player2, weapon1, weapon2 } from "./assets";
import Game from "./game";

const playerOne = new Player("Player1", player1, weapon1).generate();
const playerTwo = new Player("Player2", player2, weapon2).generate();

Game.createBoard();

const game = new Game([playerOne, playerTwo]);

//Pop-up Rules Modal Window
const rulesBtn = document.querySelector("#rules-btn");
const rulesClose = document.querySelector("#rules-modal button");

rulesBtn.addEventListener("click", () =>
  document.querySelector("#rules-modal").classList.add("open")
);
rulesClose.addEventListener("click", () =>
  document.querySelector("#rules-modal").classList.remove("open")
);

document.querySelector("#new-game-btn").addEventListener("click", game.new);
