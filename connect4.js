/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game{
  constructor(width, height, p1, p2){
    this.width = width;
    this.height = height;
    this.player1 = p1;
    this.player2 = p2;
    this.currPlayer = p1;
    this.board = [];
    this.stillPlaying = true;
  }

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */
  makeBoard(){
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    if(this.stillPlaying){
      // get x from ID of clicked cell
      const x = +evt.target.id;
    
      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }

      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer.number;
      this.placeInTable(y, x);
      
      // check for win
      if (this.checkForWin()) {
        this.stillPlaying = false;
        return this.endGame(`Player ${this.currPlayer.number} won!`);
      }
      
      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        this.stillPlaying = false;
        return this.endGame('Tie!');
      }
        
      // switch players
      if(this.currPlayer == this.player1){
        this.currPlayer = this.player2;
      }else{
        this.currPlayer = this.player1;
      }
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  endGame(msg) {
    alert(msg);
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    //convert win to arrow function to pass this as the Game class
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer.number
      );
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player{
  constructor(num,color){
    this.number = num;
    this.color = color;
  }
}

const body = document.querySelector('body');
const p1 = document.createElement("input");
p1.setAttribute("type", "text");
p1.setAttribute("name", "p1Color");
p1.setAttribute("placeholder", "Player 1 Color");
const p2 = document.createElement("input");
p2.setAttribute("type", "text");
p2.setAttribute("name", "p2Color");
p2.setAttribute("placeholder", "Player 2 Color");
const button = document.createElement("button");
button.innerText = 'Start Game!';
button.addEventListener("click", startGame);
body.prepend(button);
body.prepend(p2);
body.prepend(p1);


function startGame(){
  const game = new Game(7,6, new Player(1, p1.value), new Player(2, p2.value));
  game.makeBoard();
  game.makeHtmlBoard();
}