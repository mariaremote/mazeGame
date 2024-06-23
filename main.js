const prompt = require("prompt-sync")({ sigint: true });

// todo: extract as game configurations
const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";
const fieldHeight = 10;
const fieldWidth = 13;
const holeCoverage = 0.2;
const textDisplayTime = 3000;

class Field {
  constructor(field) {
    this.field = field;
    this.gameOver = false;
    this.currentLocation = this.getStartLocation();
    this.nextLocation = { ...this.currentLocation };
  }
  play() {
    while (!this.gameOver) {
      this.print();
      this.moveCharacter();
    }
  }
  static generateField(height, width, percentage) {
    const field = new Array(height).fill(0).map(() => new Array(width).fill(0));
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        field[i][j] = Math.random() < percentage ? hole : fieldCharacter;
      }
    }
    const hatLocation = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };
    const startLocation = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    }; // avoid overlap hat and start location
    if (
      hatLocation.x === startLocation.x &&
      hatLocation.y === startLocation.y
    ) {
      return placeHatAndStartLocation(field);
    }
    field[hatLocation.y][hatLocation.x] = hat; // todo: avoid hat or start location placed on hole
    field[startLocation.y][startLocation.x] = pathCharacter;
    return field;
  }
  print() {
    console.clear();
    this.field.forEach((row) => {
      console.log(row.join(""));
    });
  }
  moveCharacter() {
    this.getNextLocation();
    if (this.checkLocationOutOfBounds()) {
      this.nextLocation = { ...this.currentLocation }; // resets next location
      this.moveCharacter();
    } else if (this.checkLocationHatOrHole()) {
      this.gameOver = true;
      process.exit();
    }
    this.currentLocation = { ...this.nextLocation };
    this.field[this.currentLocation.y][this.currentLocation.x] = pathCharacter;
  }
  getStartLocation() {
    for (let y = 0; y < this.field.length; y++) {
      for (let x = 0; x < this.field[y].length; x++) {
        if (this.field[y][x] === pathCharacter) {
          return { x, y };
        }
      }
    }
  }
  getNextLocation() {
    // todo: refactor to use arrow keys (no need to press enter)
    const move = prompt("Which way?").toUpperCase();
    switch (move) {
      case "D":
        this.nextLocation.y += 1;
        break;
      // return { x: 0, y: 1 };
      case "U":
        this.nextLocation.y -= 1;
        break;
      // return { x: 0, y: -1 };
      case "L":
        this.nextLocation.x -= 1;
        break;
      // return { x: -1, y: 0 };
      case "R":
        this.nextLocation.x += 1;
        break;
      // return { x: 1, y: 0 };
      default:
        console.log("Enter D(down), L(left), U(up), or R(right)");
        return this.getNextLocation();
    }
  }
  checkLocationOutOfBounds() {
    if (
      this.nextLocation.x < 0 ||
      this.nextLocation.y < 0 ||
      this.nextLocation.y >= this.field.length ||
      this.nextLocation.x >= this.field[0].length
    ) {
      console.log("Out of bounds!");
      return true;
    }
  }
  checkLocationHatOrHole() {
    const currentLocation =
      this.field[this.nextLocation.y][this.nextLocation.x];
    if (currentLocation === hat) {
      console.log("Congrats! You found your hat!");
      return true;
    } else if (currentLocation === hole) {
      console.log("You fell into a hole! Game Over!");
      return true;
    }
  }
}

// Main Game Loop
const game = new Field(
  Field.generateField(fieldHeight, fieldWidth, holeCoverage)
);
game.play();

// Tests
// todo: write proper test files

// console.log(generateField(4, 4, 0.2));

// console.log(getStartLocation(dummyField)); // { x: 0, y: 0 }
// console.log(
//     getStartLocation([
//         ['░', '░', 'O'],
//         ['░', 'O', '*'],
//         ['░', '░', '░']
//     ])
// ); // { x: 1, y: 2 }
// console.log(
//     getStartLocation([
//         ['░', '░', 'O'],
//         ['░', 'O', '░'],
//         ['░', '░', '░']
//     ])
// ); // undefined

// console.log(checkLocationOutOfBounds({ x: 0, y: 4 }, dummyField)); // true
// console.log(checkLocationOutOfBounds({ x: -1, y: 0 }, dummyField)); // true
// console.log(checkLocationOutOfBounds({ x: 0, y: 2 }, dummyField)); // false
// console.log(checkLocationOutOfBounds({ x: 3, y: 0 }, dummyField)); // false

// console.log(checkLocationHatOrHole({ x: 1, y: 2 }, dummyField)); // Congrats! You found your hat!
// console.log(checkLocationHatOrHole({ x: 1, y: 1 }, dummyField)); // You fell into a hole! Game Over!
