let playerId = 1;

class Player {
  constructor(name, avatar, weapon) {
    this.name = name;
    this.avatar = avatar;
    this.weapon = weapon;
  }

  generate = () => {
    return {
      id: playerId++,
      name: this.name,
      avatar: `<img src="${this.avatar}" />`,
      health: 100,
      shield: false,
      location: { row: 0, column: 0 },
      weapon: {
        damage: 10,
        image: `<img src="${this.weapon}" data-damage="10" />`,
        old: null,
      },
    };
  };
}

export default Player;
