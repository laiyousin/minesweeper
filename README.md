# Minesweeper
A web-based minesweeper game implemented using Typescript.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Gameplay](#gameplay)

## Installation

1. Clone the repository:
   ```sh
   git clone 
   cd minesweeper
   ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Build the project:
   ```sh
   npm run build
   ```

4. Start the development server:
   ```sh
   npm start
   ```

## Usage

### Running the Game
Once the development server is running, you can access the game in your web browser:
1. Enter the desired board size and number of mines.
2. Click the "Start Game" button to initialize the board.
3. The game board will be generated based on your input.

### Restarting the Game
To restart the game.
1. Click the "Restart" button.
2. Enter new values for board size and number of mines if desired.
3. Click the "Start Game" button again.

## Gameplay
### How to Play
- **Left-Click on a Cell**: Reveals the content of the cell.
  - If the cell contains a mine, the game ends.
  - If the cell does not contain a mine, it will show the number of adjacent mines.
  - If the cell has no adjacent mines, it will recursively reveal its neighboring cells.
- **Right-Click on a Cell**: Places or removes a flag on the cell.
  - Use flags to mark cells you suspect contain mines.
  - The flag counter ar the top shows how many flags you have remaining.

### Winning the Game
You win the game by successfully flagging all the mines and revealing all the non-min cells.

### Losing the Game
You lose the game if you click on a cell containing a mine.


