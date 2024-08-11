/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: The Sequence
@author: 
@tags: []
@addedOn: 2024-00-00
*/

const unrevealed = "b";
const happy = "h";
const sad = "s";
const pressed = "p";
const tile = "t";
const highlighted_tile = "g";
const play = "d";

let score = 0;
let round = 1;
var s;
var sequence = [];

setLegend(
  [unrevealed, bitmap`
................
......00000.....
....000...000...
...00.......00..
...0...000...0..
..00..0...0..00.
..0...0...0...0.
..0.....00....0.
..0.....0.....0.
..00.........00.
...0....0....0..
...00.......00..
....000...000...
......00000.....
................
................`],
  [happy, bitmap`
................
......00000.....
....000...000...
...00.......00..
...0.........0..
..00...4.4...00.
..0....4.4....0.
..0....D.D....0.
..0...........0.
..00..4...4..00.
...0...444...0..
...00.......00..
....000...000...
......00000.....
................
................`],
  [sad, bitmap`
................
......00000.....
....000...000...
...00.......00..
...0.........0..
..00...3.3...00.
..0....3.3....0.
..0....3.3....0.
..0...........0.
..00...333...00.
...0..3...3..0..
...00.......00..
....000...000...
......00000.....
................
................`],
  [pressed, bitmap`
................
......00000.....
....000111000...
...00111111100..
...01111111110..
..0011111111100.
..0111111111110.
..0111111111110.
..0111111111110.
..0011111111100.
...01111111110..
...00111111100..
....000111000...
......00000.....
................
................`],
  [tile, bitmap`
FFFFFFFFFFFFFFFF
F66666666666666F
F66666666666666F
F66666666666666F
F66666666666666F
F66666666666666F
F66666666666666F
F66666666666666F
F66666666666666F
F66666666666666F
F66666666666666F
F66666666666666F
F66666666666666F
F66666666666666F
F66666666666666F
FFFFFFFFFFFFFFFF`],
  [highlighted_tile, bitmap`
CCCCCCCCCCCCCCCC
C33333333333333C
C33333333333333C
C33333333333333C
C33333333333333C
C33333333333333C
C33333333333333C
C33333333333333C
C33333333333333C
C33333333333333C
C33333333333333C
C33333333333333C
C33333333333333C
C33333333333333C
C33333333333333C
CCCCCCCCCCCCCCCC`],
  [play, bitmap`
DDDDDDDDDDDDDDDD
D44444444444444D
D44444444444444D
D44444444444444D
D44444LL4444444D
D44444L2LL44444D
D44444L22L44444D
D44444L222L4444D
D44444L22L44444D
D44444L2LL44444D
D44444LL4444444D
D44444444444444D
D44444444444444D
D44444444444444D
D44444444444444D
DDDDDDDDDDDDDDDD`],
)

setSolids([])

let level = 0
const levels = [
  map`
...
.d.
...`
]

setMap(levels[level])

onInput("j", () => {
  startSequence();
})

afterInput(() => {

})

function startSequence() {
  for(let i = 1; i <= round; i++) {
    let randomX = Math.floor(Math.random() * 2);
    let randomY = Math.floor(Math.random() * 2);
    clearTile(randomX, randomY)[0];
    addSprite(randomX, randomY, highlighted_tile);
    storeSequenceCoord(i, randomX, randomY);
    setTimeout(() => {
      clearTile(randomX, randomY)[0];
      addSprite(randomX, randomY, tile);
    }, 1000);
  }
}

function storeSequenceCoord(num, xVal, yVal) {
    sequence.push({n: num, x: xVal, y: yVal});
}