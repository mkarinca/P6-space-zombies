import { weapon3, weapon4, obstacle, weapon2 } from "./assets";

class Game {
  constructor(players) {
    this.players = players;
    this.tiles = document.querySelectorAll(".board > div");
    this.currentPlayer = null;
  }

  static createBoard = () => {
    let column = 0;
    let row = 1;

    for (let i = 0; i < 81; i++) {
      column++;
      document.querySelector(".board").innerHTML += `<div id="tile-${
        i + 1
      }"  data-row="${row}"  data-column="${column}"></div>`;

      if (column === 9) {
        column = 0;
        row++;
      }
    }
  };

  new = () => {
    this.reset();

    this.players.map((player) => {
      this.placeObject(player, "player");
    });

    for (let i = 0; i < 10; i++) {
      this.placeObject(`<img src="${obstacle}" />`, "obstacle");
    }

    this.placeObject(`<img src="${weapon3}" />`, "weapon");
    this.placeObject(`<img src="${weapon4}" />`, "weapon");

    this.currentPlayer = this.players[
      Math.floor(Math.random() * this.players.length)
    ];

    this.detectTurn();
  };

  reset = () => {
    for (const tile of this.tiles) {
      tile.innerHTML = "";
      tile.removeAttribute("class");
    }
  };

  placeObject = (item, type) => {
    const randomTile = Math.floor(Math.random() * this.tiles.length);
    if (this.tiles[randomTile].classList.contains("occupied")) {
      this.placeObject(item, type);
    } else {
      if (type === "player") {
        const { row, column } = document.querySelector(
          `#tile-${randomTile + 1}`
        ).dataset;
        this.players[item.id - 1].location = { row, column };

        this.tiles[randomTile].innerHTML = item.avatar;
      } else {
        this.tiles[randomTile].innerHTML = item;
      }
      this.tiles[randomTile].classList.add(type);
      this.tiles[randomTile].classList.add("occupied");
    }
  };

  detectTurn = () => {
    for (const panel of document.querySelectorAll(".panel")) {
      panel.classList.remove("current");
    }

    document
      .querySelector(`#panel-p${this.currentPlayer.id}`)
      .classList.add("current");

    this.showPlayerMoves();
  };

  changeTurn = () => {
    if (this.currentPlayer.id === 1) {
      this.currentPlayer = this.players[1];
    } else {
      this.currentPlayer = this.players[0];
    }

    this.detectTurn();
  };

  movePlayer = (e) => {
    console.log(e);
    const oldPos = document.querySelector(
      `[data-row="${this.currentPlayer.location.row}"][data-column="${this.currentPlayer.location.column}"]`
    );

    const newPos = e.target;

    oldPos.innerHTML = "";
    newPos.innerHTML = this.currentPlayer.avatar;

    this.players[this.currentPlayer.id - 1].location = {
      row: newPos.dataset.row,
      column: newPos.dataset.column,
    };

    for (const tile of document.querySelectorAll(".highlight")) {
      tile.classList.remove("highlight");
    }

    this.changeTurn();
  };

  showPlayerMoves = () => {
    const row = Number(this.currentPlayer.location.row);
    const column = Number(this.currentPlayer.location.column);

    const playerNorthMoves = (tile) => {
      return document.querySelector(
        `[data-row="${row - tile}"][data-column="${column}"]`
      );
    };

    const playerEastMoves = (tile) => {
      return document.querySelector(
        `[data-row="${row}"][data-column="${column + tile}"]`
      );
    };

    const playerSouthMoves = (tile) => {
      return document.querySelector(
        `[data-row="${row + tile}"][data-column="${column}"]`
      );
    };

    const playerWestMoves = (tile) => {
      return document.querySelector(
        `[data-row="${row}"][data-column="${column - tile}"]`
      );
    };

    //Highlight possible tiles NORTH(UP)
    for (let i = 1; i <= 3; i++) {
      if (playerNorthMoves(i)) {
        if (
          !playerNorthMoves(i).classList.contains("obstacle") &&
          !playerNorthMoves(i).classList.contains("player")
        ) {
          playerNorthMoves(i).classList.add("highlight");
          playerNorthMoves(i).addEventListener("click", this.movePlayer);
        } else {
          break;
        }
      }
    }

    //Highlight possible tiles EAST(RIGHT)
    for (let i = 1; i <= 3; i++) {
      if (playerEastMoves(i)) {
        if (
          !playerEastMoves(i).classList.contains("obstacle") &&
          !playerEastMoves(i).classList.contains("player")
        ) {
          playerEastMoves(i).classList.add("highlight");
          playerEastMoves(i).addEventListener("click", this.movePlayer);
        } else {
          break;
        }
      }
    }

    //Highlight possible tiles SOUTH(DOWN)
    for (let i = 1; i <= 3; i++) {
      if (playerSouthMoves(i)) {
        if (
          !playerSouthMoves(i).classList.contains("obstacle") &&
          !playerSouthMoves(i).classList.contains("player")
        ) {
          playerSouthMoves(i).classList.add("highlight");
          playerSouthMoves(i).addEventListener("click", this.movePlayer);
        } else {
          break;
        }
      }
    }

    //Highlight possible tiles WEST(LEFT)
    for (let i = 1; i <= 3; i++) {
      if (playerWestMoves(i)) {
        if (
          !playerWestMoves(i).classList.contains("obstacle") &&
          !playerWestMoves(i).classList.contains("player")
        ) {
          playerWestMoves(i).classList.add("highlight");
          playerWestMoves(i).addEventListener("click", this.movePlayer);
        } else {
          break;
        }
      }
    }
  };
}

export default Game;
