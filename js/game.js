import { weapon1, weapon2, obstacle } from "./assets";

class Game {
  constructor(players) {
    this.players = players;
    this.tiles = document.querySelectorAll(".board > div");
    this.currentPlayer = null;
  }

  //Create game board on start up
  static createBoard = () => {
    let column = 0;
    let row = 1;

    let output = "";

    for (let i = 0; i < 81; i++) {
      column++;
      output += `<div id="tile-${
        i + 1
      }"  data-row="${row}"  data-column="${column}"></div>`;

      if (column === 9) {
        column = 0;
        row++;
      }
    }

    document.querySelector(".board").innerHTML = output;
  };

  //Creating New Game

  new = () => {
    this.reset();

    //Close gameover modal window when click on newgame button inside modal.
    document.querySelector("#gameover-modal").classList.remove("open");

    //Place obstacles to game board (default obstacle number is 10)
    for (let i = 0; i < 10; i++) {
      this.placeObject(`<img src="${obstacle}" />`, "obstacle");
    }

    //Place players to game board
    this.players.map((player) => {
      this.placeObject(player, "player");
    });

    //Place weapons to game board
    this.placeObject(`<img src="${weapon1}" data-damage="20" />`, "weapon");
    this.placeObject(`<img src="${weapon2}" data-damage="30"  />`, "weapon");

    //Define current player on startup
    this.currentPlayer = this.players[
      Math.floor(Math.random() * this.players.length)
    ];

    this.detectTurn();
  };

  //Reset Player panel data for each player
  reset = () => {
    this.players.map((player) => {
      const protection = document.querySelector(`#protection-p${player.id}`);

      protection.innerHTML = "UNPROTECTED";
      protection.classList.remove("protecting");

      document.querySelector(`#panel-p${player.id} h2`).innerHTML = player.name;
      document.querySelector(`#health-p${player.id}`).innerHTML = player.health;
      document.querySelector(`#damage-p${player.id}`).innerHTML =
        player.weapon.damage;
      document.querySelector(`#weapon-p${player.id}`).innerHTML =
        player.weapon.image;
    });
  };

  //Place Players and Weapons on Tiles

  placeObject = (item, type) => {
    const randomTile = Math.floor(Math.random() * this.tiles.length);
    const { row, column } = this.tiles[randomTile].dataset;

    // Check whether obstacles are placed horizontally
    const detectObstacle = (row, column) => {
      const r1 = document.querySelector(
        `[data-row="${row - 1}"][data-column="${column}"]`
      );
      const r2 = document.querySelector(
        `[data-row="${row - 2}"][data-column="${column}"]`
      );
      const r3 = document.querySelector(
        `[data-row="${row + 1}"][data-column="${column}"]`
      );
      const r4 = document.querySelector(
        `[data-row="${row + 2}"][data-column="${column}"]`
      );

      // Check whether obstacles are placed vertically
      const c1 = document.querySelector(
        `[data-column="${column - 1}"][data-row="${row}"]`
      );
      const c2 = document.querySelector(
        `[data-column="${column - 2}"][data-row="${row}"]`
      );
      const c3 = document.querySelector(
        `[data-column="${column + 1}"][data-row="${row}"]`
      );
      const c4 = document.querySelector(
        `[data-column="${column + 2}"][data-row="${row}"]`
      );

      if (r1 && r1.classList.contains("obstacle")) return true;
      if (r2 && r2.classList.contains("obstacle")) return true;
      if (r3 && r3.classList.contains("obstacle")) return true;
      if (r4 && r4.classList.contains("obstacle")) return true;

      if (c1 && c1.classList.contains("obstacle")) return true;
      if (c2 && c2.classList.contains("obstacle")) return true;
      if (c3 && c3.classList.contains("obstacle")) return true;
      if (c4 && c4.classList.contains("obstacle")) return true;

      // Check whether obstacles are placed diagonally
      const r1c1 = document.querySelector(
        `[data-row="${row + 1}"][data-column="${column + 1}"]`
      );

      const r2c2 = document.querySelector(
        `[data-row="${row - 1}"][data-column="${column - 1}"]`
      );

      const r3c3 = document.querySelector(
        `[data-row="${row - 1}"][data-column="${column + 1}"]`
      );

      const r4c4 = document.querySelector(
        `[data-row="${row + 1}"][data-column="${column - 1}"]`
      );

      if (r1c1 && r1c1.classList.contains("obstacle")) return true;
      if (r2c2 && r2c2.classList.contains("obstacle")) return true;
      if (r3c3 && r3c3.classList.contains("obstacle")) return true;
      if (r4c4 && r4c4.classList.contains("obstacle")) return true;
    };

    const detectPlayer = (r, c) => {
      if (this.players[0].location.row > 0) {
        const p1c = +this.players[0].location.column;
        const p1r = +this.players[0].location.row;

        const yDistance = Math.abs(p1r - row);
        const xDistance = Math.abs(p1c - column);

        // Check if P1 is in same column and less than 4 steps away from P2
        if (p1c === column && yDistance <= 4) {
          // Check if there's a barrier between two players
          for (let i = 1; i <= yDistance; i++) {
            if (p1r > row) {
              const y = document.querySelector(
                `[data-row="${p1r - i}"][data-column="${p1c}"]`
              );
              if (y && y.classList.contains("obstacle")) return false;
            } else {
              const y = document.querySelector(
                `[data-row="${p1r + i}"][data-column="${p1c}"]`
              );
              if (y && y.classList.contains("obstacle")) return false;
            }
          }

          return true;
        }

        // Check if P1 is in same row and less than 4 steps away from P2
        if (p1r === row && xDistance <= 4) {
          // Check if there's a obstacle between two players
          for (let i = 1; i <= xDistance; i++) {
            if (p1c > column) {
              const x = document.querySelector(
                `[data-row="${p1r}"][data-column="${p1c - i}"]`
              );
              if (x && x.classList.contains("obstacle")) return false;
            } else {
              const x = document.querySelector(
                `[data-row="${p1r}"][data-column="${p1c + i}"]`
              );
              if (x && x.classList.contains("obstacle")) return false;
            }
          }

          return true;
        }

        if (
          (xDistance === 1 && yDistance <= 4) ||
          (yDistance === 1 && xDistance <= 4)
        )
          return true;
      }
    };

    if (this.tiles[randomTile].classList.contains("occupied"))
      return this.placeObject(item, type);

    if (type === "player") {
      if (detectPlayer(+row, +column)) {
        return this.placeObject(item, type);
      }

      this.players[item.id - 1].location = { row, column };

      this.tiles[randomTile].innerHTML = item.avatar;
    } else {
      if (type === "obstacle" && detectObstacle(+row, +column)) {
        return this.placeObject(item, type);
      }
      this.tiles[randomTile].innerHTML = item;
    }
    this.tiles[randomTile].classList.add(type);
    this.tiles[randomTile].classList.add("occupied");
  };

  //Highlight current player panel and show available tiles to move.

  detectTurn = () => {
    for (const panel of document.querySelectorAll(".panel")) {
      panel.classList.remove("current");
    }

    document
      .querySelector(`#panel-p${this.currentPlayer.id}`)
      .classList.add("current");

    this.showPlayerMoves();
  };

  //Change Player Turn

  changeTurn = () => {
    if (this.currentPlayer.id === 1) {
      this.currentPlayer = this.players[1];
    } else {
      this.currentPlayer = this.players[0];
    }

    this.detectTurn();
  };

  // Player Moves

  movePlayer = (e) => {
    const oldPos = document.querySelector(
      `[data-row="${this.currentPlayer.location.row}"][data-column="${this.currentPlayer.location.column}"]`
    );

    const newPos = e.target.nodeName === "IMG" ? e.path[1] : e.target;

    if (this.currentPlayer.weapon.old) {
      oldPos.innerHTML = this.currentPlayer.weapon.old;
      oldPos.classList.add("weapon");
      oldPos.classList.remove("player");
      this.players[this.currentPlayer.id - 1].weapon.old = null;
    } else {
      oldPos.innerHTML = "";
      oldPos.classList = "";
    }

    if (newPos.classList.contains("weapon")) {
      this.players[
        this.currentPlayer.id - 1
      ].weapon.old = this.currentPlayer.weapon.image;

      this.players[this.currentPlayer.id - 1].weapon.image = newPos.innerHTML;

      this.players[this.currentPlayer.id - 1].weapon.damage =
        e.target.dataset.damage;

      document.querySelector(`#weapon-p${this.currentPlayer.id}`).innerHTML =
        newPos.innerHTML;

      document.querySelector(`#damage-p${this.currentPlayer.id}`).innerHTML =
        e.target.dataset.damage;

      let weaponSound = document.querySelector("#weapon-sound");
      weaponSound.play();
    }

    newPos.innerHTML = this.currentPlayer.avatar;
    newPos.classList.add("player", "occupied");

    this.players[this.currentPlayer.id - 1].location = {
      row: newPos.dataset.row,
      column: newPos.dataset.column,
    };

    for (const tile of document.querySelectorAll(".highlight")) {
      tile.classList.remove("highlight");
      tile.removeEventListener("click", this.movePlayer);
    }

    if (this.detectFight()) {
      this.retaliation();
    } else {
      this.changeTurn();
    }
  };

  // Detect Fight

  detectFight = () => {
    const row = Number(this.currentPlayer.location.row);
    const column = Number(this.currentPlayer.location.column);

    const north = document.querySelector(
      `[data-row="${row - 1}"][data-column="${column}"]`
    );

    const south = document.querySelector(
      `[data-row="${row + 1}"][data-column="${column}"]`
    );

    const east = document.querySelector(
      `[data-row="${row}"][data-column="${column + 1}"]`
    );

    const west = document.querySelector(
      `[data-row="${row}"][data-column="${column - 1}"]`
    );

    if (north && north.classList.contains("player")) return true;
    if (south && south.classList.contains("player")) return true;
    if (east && east.classList.contains("player")) return true;
    if (west && west.classList.contains("player")) return true;
  };

  retaliation = () => {
    const attacker = this.currentPlayer;
    this.currentPlayer = attacker.id === 1 ? this.players[1] : this.players[0];
    const opponent = this.currentPlayer;

    document
      .querySelector(`#panel-p${attacker.id}`)
      .classList.remove("current");
    document.querySelector(`#panel-p${opponent.id}`).classList.add("current");

    // 1. Display modal window with attack information
    const fightModal = document.querySelector("#fight-modal");
    document.querySelector("#avatar").innerHTML = opponent.avatar;

    setTimeout(() => {
      fightModal.classList.add("open");
    }, 500);

    const attack = () => {
      document.querySelector("#protect").removeEventListener("click", protect);
      document.querySelector("#run").removeEventListener("click", run);

      fightModal.classList.remove("open");

      const health = opponent.health - attacker.weapon.damage;
      document.querySelector(`#health-p${opponent.id}`).innerHTML = health;
      this.players[opponent.id - 1].health = health;
      const protection = document.querySelector(`#protection-p${opponent.id}`);
      protection.innerHTML = "UNPROTECTED";
      protection.classList.remove("protecting");

      if (this.gameOver(attacker, opponent)) return;

      this.retaliation();
    };

    const protect = () => {
      document.querySelector("#attack").removeEventListener("click", attack);
      document.querySelector("#run").removeEventListener("click", run);

      fightModal.classList.remove("open");

      const health = opponent.health - attacker.weapon.damage / 2;
      document.querySelector(`#health-p${opponent.id}`).innerHTML = health;
      this.players[opponent.id - 1].health = health;
      const protection = document.querySelector(`#protection-p${opponent.id}`);
      protection.innerHTML = "PROTECTED";
      protection.classList.add("protecting");

      if (this.gameOver(attacker, opponent)) return;

      this.retaliation();
    };

    const run = () => {
      document.querySelector("#attack").removeEventListener("click", attack);
      document.querySelector("#protect").removeEventListener("click", protect);

      fightModal.classList.remove("open");

      const health = opponent.health - attacker.weapon.damage / 2;
      document.querySelector(`#health-p${opponent.id}`).innerHTML = health;
      this.players[opponent.id - 1].health = health;
      const protection = document.querySelector(`#protection-p${opponent.id}`);
      protection.innerHTML = "PROTECTED";
      protection.classList.add("protecting");

      if (this.gameOver(attacker, opponent)) return;

      this.showPlayerMoves();
    };

    document
      .querySelector("#protect")
      .addEventListener("click", protect, { once: true });

    document
      .querySelector("#attack")
      .addEventListener("click", attack, { once: true });

    document
      .querySelector("#run")
      .addEventListener("click", run, { once: true });
  };

  //Game Over Case

  gameOver = (attacker, opponent) => {
    if (this.players[opponent.id - 1].health <= 0) {
      const gameOverModal = document.querySelector("#gameover-modal");

      gameOverModal.classList.add("open");

      document.querySelector(
        "#gameover-modal p:first-of-type"
      ).innerHTML = `${attacker.name}, you are the winner! :)`;

      document.querySelector(
        "#gameover-modal p:last-of-type"
      ).innerHTML = `${opponent.name}, you are the loser! :(`;

      return true;
    }
  };

  //Highlight Player Moves

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
