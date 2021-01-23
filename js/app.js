import Player from "./player";
import { player1, player2, weapon3, weapon4 } from "./assets";
import Game from "./game";

//Create board tiles on start up(even if new game button not be clicked)
Game.createBoard();

//Create game board
const newGame = () => {
  const playerOne = new Player(1, "Rick", player1, weapon3).generate();
  const playerTwo = new Player(2, "Lori", player2, weapon4).generate();

  Game.createBoard();

  new Game([playerOne, playerTwo]).new();
};

//Rules Modal Window
$(".rules-btn").click(() => $("#rules-modal").addClass("open"));
$("#rules-modal button").click(() => $("#rules-modal").removeClass("open"));

//Call New game function when click on new game button on startup and gameover modal.
$(".new-game").click(newGame);
$("#gameover-modal button").click(newGame);
