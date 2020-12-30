import Player from "./player";
import { player1, player2, weapon3, weapon4 } from "./assets";
import Game from "./game";

Game.createBoard();

const newGame = () => {
  const playerOne = new Player(1, "Player 1", player1, weapon3).generate();
  const playerTwo = new Player(2, "Player 2", player2, weapon4).generate();

  Game.createBoard();

  new Game([playerOne, playerTwo]).new();
};

//Pop-up Rules Modal Window
const rulesBtn = document.querySelector(".rules-btn");
const rulesClose = document.querySelector("#rules-modal button");

rulesBtn.addEventListener("click", () =>
  document.querySelector("#rules-modal").classList.add("open")
);
rulesClose.addEventListener("click", () =>
  document.querySelector("#rules-modal").classList.remove("open")
);

document.querySelector(".new-game").addEventListener("click", newGame);
document
  .querySelector("#gameover-modal button")
  .addEventListener("click", newGame);
