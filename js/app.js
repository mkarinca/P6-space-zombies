import Player from "./player";
import { player1, player2, weapon1, weapon2 } from "./assets";
import Game from "./game";

const playerOne = new Player("Player1", player1, weapon1).generate();
const playerTwo = new Player("Player2", player2, weapon2).generate();

Game.createBoard();

const game = new Game([playerOne, playerTwo]);

//Pop-up Rules Modal Window
const rulesBtn = document.querySelector("#rules-btn");

rulesBtn.addEventListener("click", () => {
  const modal = document.querySelector("#rules-modal");
  modal.style.display = "flex";
  modal.classList.remove("fade-out");
  modal.classList.add("fade-in");
  document
    .querySelector("#rules-modal button")
    .addEventListener("click", () => {
      modal.classList.remove("fade-in");
      modal.classList.add("fade-out");
      setTimeout(() => {
        modal.style.display = "none";
      }, 700);
    });
});
document.querySelector("#new-game-btn").addEventListener("click", game.new);
