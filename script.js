// ДЗ №2
// 1. Поставити const rowTetro = -2; прописати код щоб працювало коректно
// 2. Зверстати поле для розрахунку балів гри     +
// 3. Реалізувати самостійний рух фігур до низу    +
// 4. Прописати логіку і код розрахунку балів гри (1 ряд = 10; 2 ряди = 30; 3 ряди = 50; 4 = 100)   +

"use strict"
const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TimeTetrominoDownAlways = 1500;
const scoreArr= [0, 10, 30, 50, 100]
const TETROMINO_NAMES = ['O', "J",'I','L','S','T','Z'];
const TETROMINOES = {
    'O': [
        [1, 1],
        [1, 1]
    ],
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0]
    ],
    'L': [
        [1,0,0],
        [1,0,0],
        [1,1,0],
    ],
    'I':[
        [1,0,0,0],
        [1,0,0,0],
        [1,0,0,0],
        [1,0,0,0],        
    ],
    'S':[
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    'T':[
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],
    'Z':[
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ]
}

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

let playField;
let tetromino;

function generatePlayField() {
    for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
        const div = document.createElement('div');
        document.querySelector('.grid').append(div);
    }
    playField = new Array(PLAYFIELD_ROWS).fill()
        .map( ()=> new Array(PLAYFIELD_COLUMNS).fill(0) );
}

function getRandomElement(array){
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex];
}


function generateTetromino(){
    const name   = getRandomElement(TETROMINO_NAMES);
    const matrix = TETROMINOES[name];
    const column = PLAYFIELD_COLUMNS / 2 - Math.floor(matrix.length / 2);
    const rowTetro = 0;
    tetromino = {
        name,
        matrix,
        row: rowTetro,
        column: column
    }
}

function giv_score(){
    function cheak_line(ind){
         for (let i = 0; i<PLAYFIELD_COLUMNS; i++) {
            if (playField[ind][i] === 0) {return false}}
         return true;

    }

    let count = 0;
    let i =  PLAYFIELD_ROWS-1;
    while (i>=0){
        if (cheak_line(i)) {
            count++;
            for (let ind = i; ind>0; ind--){
                for (let k=0; k< PLAYFIELD_COLUMNS;k++){
                    playField[ind][k] = playField[ind-1][k];
                }
            }

        }
        else {i--;}
    }
    score.textContent = (Number(score.textContent)+scoreArr[count]).toString()
}


function placeTetromino(){
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if(tetromino.matrix[row][column]){
                playField[tetromino.row+row][tetromino.column+column] = tetromino.name;
            }
        }
    }
    giv_score();
    generateTetromino();
}

generatePlayField();
generateTetromino();

const cells = document.querySelectorAll('.grid div');
const score = document.querySelector('.scoreDiv #score');

let moveTetrominoDownAlways = setInterval(()=> {moveTetrominoDown();draw();}, TimeTetrominoDownAlways);

function drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (playField[row][column] === 0) continue;

            const name = playField[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        }
    }

}

function drawTetromino() {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (!tetromino.matrix[row][column]) continue;
            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
            );
            cells[cellIndex].classList.add(name);

        }
    }
}

// clearInterval(moveTetrominoDownAlways);
// moveTetrominoDownAlways = setInterval(()=> {moveTetrominoDown();draw();}, TimeTetrominoDownAlways-1000);

function draw() {
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayField();
    drawTetromino();
}

draw();
document.addEventListener('keydown', onKeyDown);
function onKeyDown(e) {
    switch (e.key) {
        case 'ArrowUp':
            rotate();
            break;
        case 'ArrowDown':
            moveTetrominoDown();
            break;
        case 'ArrowLeft':
            moveTetrominoLeft();
            break;
        case 'ArrowRight':
            moveTetrominoRight();
            break;

    }  
    draw();
}

function rotate(){
    rotateTetromino();
    draw();
}


function rotateTetromino(){
    const oldMatrix = tetromino.matrix;
    tetromino.matrix = rotateMatrix(tetromino.matrix);
    if(!isValid()){
        tetromino.matrix = oldMatrix;
    }

}

function rotateMatrix(matrixTetromino){
    const N = matrixTetromino.length;
    const rotateMatrix = [];
    for(let i = 0; i < N; i++){
        rotateMatrix[i] = [];
        for(let j = 0; j < N; j++){
            rotateMatrix[i][j] = matrixTetromino[N-j-1][i];
        }
    }
    return rotateMatrix;
}

function moveTetrominoDown() {
    tetromino.row += 1;
    if(!isValid()){
        tetromino.row -= 1;
        placeTetromino();    
    }
}

function moveTetrominoLeft() {
    tetromino.column -= 1;
    if(!isValid()){
        tetromino.column += 1;
    }
}

function moveTetrominoRight() {
    tetromino.column += 1;
    if(!isValid()){
        tetromino.column -= 1;
    }
}

function isValid(){
    const matrixSize  = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
                if(isOutsideOfGameBoard(row, column)){return false}
                if(hasCollisions(row, column)) {return false}
        }
    }
    return true;
}

function isOutsideOfGameBoard(row, column){
    return tetromino.matrix[row][column] && (tetromino.column + column < 0 
        || tetromino.column + column >= PLAYFIELD_COLUMNS 
        || tetromino.row + row >= PLAYFIELD_ROWS); 
}

function hasCollisions(row, column){
    return tetromino.matrix[row][column] && 
    playField[tetromino.row+row][tetromino.column+column];
}