import inquirer from "inquirer";
import gameReducer, { move, winner } from "./game";
import { createStore } from "redux";
// import { }

// map.setIn([1,1], 'X');
// board = {
//   [0]: { // array of cols }
//   [1]: {
//     [1]: 'X';
//   }
//   [2]: { // array of cols}
// }

const printBoard = () => {
  const { board } = game.getState();
  for (let r = 0; r != 3; ++r) {
    for (let c = 0; c != 3; ++c) {
      process.stdout.write(board.getIn([r, c], "_"));
    }
    process.stdout.write("\n");
  }
};

const getInput = player => async () => {
  // console.log('getInput called');
  const { turn } = game.getState();
  if (turn !== player) return;
  const ans = await inquirer.prompt([
    {
      type: "input",
      name: "coord",
      message: `${turn}'s move (row,col):`
    }
  ]);
  const [row = 0, col = 0] = ans.coord.split(/[,\s]+/).map(x => +x);
  // console.log("input (row, col): ", row, col);
  game.dispatch(move(turn, [row, col]));
};

// Create the store
const game = createStore(gameReducer);

// Debug: Print the state
// game.subscribe(() => console.log(game.getState()));

game.subscribe(printBoard);
game.subscribe(getInput("X"));
game.subscribe(getInput("O"));
game.subscribe(() => {
  // console.log('In our main subscribe fn');
  if (game.getState().error) {
    console.log('Error:', game.getState().error);
  }
  if (game.getState().winner) {
    console.log(`Yay! ${game.getState().winner} won!`);
    process.exit(0);
  }
});

// We dispatch a dummy START action to call all our
// subscribers the first time.
game.dispatch({ type: "START" });
