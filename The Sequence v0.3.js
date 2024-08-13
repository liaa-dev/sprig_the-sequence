/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: The Sequence
@author: 
@tags: []
@addedOn: 2024-00-00
*/

/*
TODO: Bug Fix the sleep function only works when using the async keyword in front of the function, as I cant use the await sleep() for the onInput function I have to find another way to do it, and I've got no plan right now...
*/

const unrevealed = "b";
const happy = "h";
const sad = "s";
const pressed = "p";
const tile = "t";
const highlighted_tile = "g";
const selected_tile = "k";
const play = "d";

let score = 0;
let round = 1;
var tiles_chosen = 0;
var inRound = true;
var frequence = 2;
var sequence = [];
let cursor_pos = {
  x: 1,
  y: 1
};

setLegend(
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
  [selected_tile, bitmap`
0000000000000000
0666666666666660
0666666666666660
0666666666666660
0666666666666660
0666666666666660
0666666666666660
0666666666666660
0666666666666660
0666666666666660
0666666666666660
0666666666666660
0666666666666660
0666666666666660
0666666666666660
0000000000000000`],
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
...`,
  map`
ttt
ttt
ttt`,
]

setMap(levels[level])

onInput("j", () => {
  if(!inRound) {
    if(tiles_chosen == sequence.length) {
      setBackground(happy);
      score++;
      inRound = true;
    }
    if(cursor_pos.x == sequence[tiles_chosen].x && cursor_pos.x == sequence[tiles_chosen].y) {
      tiles_chosen++;
      setTileFor(cursor_pos.x, cursor_pos.y, happy, 1000);
      addText("Pressed!", {x: 1+tiles_chosen, y: 1});
    }
  }
  else {
    level = 1;
    setMap(levels[level]);
    startSequence();
  }
})

onInput("w", () => {
  if(inRound) return;
  moveCursor(cursor_pos.x, cursor_pos.y-1);
})

onInput("a", () => {
  if(inRound) return;
  moveCursor(cursor_pos.x-1, cursor_pos.y);
})

onInput("s", () => {
  if(inRound) return;
  moveCursor(cursor_pos.x, cursor_pos.y+1);
})

onInput("d", () => {
  if(inRound) return;
  moveCursor(cursor_pos.x+1, cursor_pos.y);
})

afterInput(() => {
  
})

async function startSequence() {
  inRound = true;
  await sleep(1000);
  for(let i = 1; i <= frequence; i++) {
    let randomX = Math.floor(Math.random() * 2);
    let randomY = Math.floor(Math.random() * 2);
    setTile(randomX, randomY, highlighted_tile);
    storeSequenceCoord(randomX, randomY);
    await sleep(1000);
    setTile(randomX, randomY, tile);
    await sleep(1000);
  }
  frequence += 1;
  moveCursor(1, 1);
  inRound = false;
}

function moveCursor(x, y) {
  if(x > width()-1 || x < 0 || y > height()-1 || y < 0) return;
  
  setTile(cursor_pos.x, cursor_pos.y, tile);
  
  cursor_pos.x = x;
  cursor_pos.y = y;

  setTile(x, y, selected_tile);
}

function setTile(x, y, spriteType) {
  clearTile(x, y);
  addSprite(x, y, spriteType);
}

/**function setTileFor(x, y, spriteType, ms) {
  let oldTile = getFirst(getTile(x, y)[0].type);

  alert(oldTile);
  setTile(x, y, spriteType);
  setTimeout(() => setTile(x, y, oldTile), ms);
  console.log(oldTile);
}**/

function setTileFor(x, y, spriteType, ms) {
  let tile = getTile(x, y)[0];
  let oldTileType = tile.type;

  tile.type = spriteType

  setTimeout(() => tile.type = oldTileType, ms);
}

function storeSequenceCoord(xVal, yVal) {
    sequence.push({x: xVal, y: yVal});
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
