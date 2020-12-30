import { weapon1, weapon2, obstacle } from "./assets";

class Game {
  constructor(players) {
    this.players = players;
    this.tiles = document.querySelectorAll(".board > div");
    this.currentPlayer = null;
  }

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

    document.querySelector("#gameover-modal").classList.remove("open");

    this.players.map((player) => {
      this.placeObject(player, "player");
    });

    for (let i = 0; i < 10; i++) {
      this.placeObject(`<img src="${obstacle}" />`, "obstacle");
    }

    this.placeObject(`<img src="${weapon1}" data-damage="20" />`, "weapon");
    this.placeObject(`<img src="${weapon2}" data-damage="30"  />`, "weapon");

    this.currentPlayer = this.players[
      Math.floor(Math.random() * this.players.length)
    ];

    this.detectTurn();
  };

  //Reset Game

  reset = () => {
    // for (const tile of this.tiles) {
    //   tile.innerHTML = "";
    //   tile.removeAttribute("class");
    // }

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

  //Detect Player Turn

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
