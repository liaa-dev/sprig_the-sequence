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
const melody = tune`
600: B5/600,
600: E4^600 + E5/600,
1200,
600: D4/600 + B4/600 + G4-600,
600: A4-600,
600: G4-600,
600,
600: E4-600 + C5^600,
600,
600: A4-600,
600: B4-600,
600: G4-600,
600: E4-600,
600,
600: B5/600,
600: E4~600 + E5^600,
600,
600: B4^600 + G4~600,
600: A4~600,
600: G4~600,
600,
600: E4~600 + C5^600,
600,
600: A4~600,
600: B4~600,
600: G4~600,
600: E4~600,
600: F4~600 + D5/600,
600: G4~600 + E5/600,
600: G5/600 + C5^600 + G4^600,
600`
const hurray = tune`
379.746835443038: B5-379.746835443038 + A5-379.746835443038 + G5-379.746835443038 + C5-379.746835443038 + A4/379.746835443038,
379.746835443038: B5-379.746835443038 + D5/379.746835443038 + E5/379.746835443038 + C5^379.746835443038,
11392.405063291139`
const bub = tune `
500: E4-500,
15500`

let playback;

let score = 0;
let highscore = 0;
let round = 1;
let speed = 1;
var tiles_chosen = 0;
var inSequence = true;
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
  map`
...
...
...`,
]
setMap(levels[level])

onInput("j", () => {
  if(level == 0) {
    level = 1;
    setMap(levels[level]);
    startSequence();
    playback = playTune(melody, Infinity);
  }else if(level == 2) {
    clearText();
    level = 0;
    setMap(levels[level]);
  }
  
  if (!inSequence) {
    if (cursor_pos.x == sequence[tiles_chosen].x && cursor_pos.y == sequence[tiles_chosen].y) {
      tiles_chosen += 1;
      setTileFor(cursor_pos.x, cursor_pos.y, happy, 1000/speed);
      if(tiles_chosen == sequence.length) startNewRound();
    }else {
      playback.end();
      setTileFor(cursor_pos.x, cursor_pos.y, sad, 1000);
      setTimeout(() => {
        resetVars();
        level = 2;
        setMap(levels[2]);
        playTune(bub);
        addText("Score: " + score, { x: 5, y: 6, color: color`0` });
        setTimeout(() => {
          playTune(bub);
          addText("High Score: " + highscore, { x: 3, y: 8, color: color`3` });
        }, 1000);
  
        setTimeout(() => {
          playTune(bub);
          addText("Press j... ", { x: 5, y: 13, color: color`9` });
        }, 2000);
      }, 1000);
    }
    return;
  }
})

onInput("w", () => {
  if (inSequence || level == 2) return;
  moveCursor(cursor_pos.x, cursor_pos.y - 1);
})

onInput("a", () => {
  if (inSequence || level == 2) return;
  moveCursor(cursor_pos.x - 1, cursor_pos.y);
})

onInput("s", () => {
  if (inSequence || level == 2) return;
  moveCursor(cursor_pos.x, cursor_pos.y + 1);
})

onInput("d", () => {
  if (inSequence || level == 2) return;
  moveCursor(cursor_pos.x + 1, cursor_pos.y);
})

afterInput(() => {
  console.log("length:" + sequence.length);
})

function startNewRound() {
  playback.end();
  playTune(hurray);
  if(speed < 4) speed += 0.2;
  sequence = [];
  tiles_chosen = 0;
  setAllTilesFor(happy, 2000);
  score++;
  inSequence = true;
  setTimeout(() => {
    setMap(levels[1]);
    startSequence();
    playback = playTune(melody, Infinity);
  }, 1500);
}

async function startSequence() {
  await sleep(1000/speed);
  for (let i = 1; i <= frequence; i++) {
    let randomX = Math.floor(Math.random() * 2);
    let randomY = Math.floor(Math.random() * 2);
    setTile(randomX, randomY, highlighted_tile);
    storeSequenceCoord(randomX, randomY);
    await sleep(1000/speed);
    setTile(randomX, randomY, tile);
    await sleep(1000/speed);
  }
  frequence += 1;
  moveCursor(1, 1);
  inSequence = false;
  pauseTune(playback);
}

function moveCursor(x, y) {
  if (x > width() - 1 || x < 0 || y > height() - 1 || y < 0) return;

  setTile(cursor_pos.x, cursor_pos.y, tile);

  cursor_pos.x = x;
  cursor_pos.y = y;

  setTile(x, y, selected_tile);
}

function setTile(x, y, spriteType) {
  clearTile(x, y);
  addSprite(x, y, spriteType);
}

function setAllTilesFor(spriteType, ms) {
  let oldTileTypes = [];
  setTimeout(() => {
    for(let x = 0; x <= 2; x++) {
      for(let y = 0; y <= 2; y++) {
        setTile(x, y, tile);
      }
    }
  }, 1000);
  for(let x = 0; x <= 2; x++) {
    for(let y = 0; y <= 2; y++) {
      oldTileTypes.push(getTile(x, y)[0].type);
      setTile(x, y, spriteType);
    }
  }
}

function setTileFor(x, y, spriteType, ms) {
  let tile = getTile(x, y)[0];
  let oldTileType = tile.type;

  setTile(x, y, spriteType);

  setTimeout(() => setTile(x, y, oldTileType), ms);
}

function storeSequenceCoord(xVal, yVal) {
  sequence.push({ x: xVal, y: yVal });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function resetVars() {
  if(score > highscore) {
    highscore = score;
  }

  speed = 1;
  round = 1;
  tiles_chosen = 0;
  inSequence = true;
  frequence = 2;
  sequence = [];
  cursor_pos = {
    x: 1,
    y: 1
  };
}