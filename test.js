import { Map } from "immutable";
import { winner, streak } from "./game/";

const row1 = [[0, 0], [0, 1], [0, 2]];
const row2 = [[1, 0], [1, 1], [1, 2]];
const row3 = [[2, 0], [2, 1], [2, 2]];
const col1 = [[0, 0], [1, 0], [2, 0]];
const col2 = [[0, 1], [1, 1], [2, 1]];
const col3 = [[0, 2], [1, 2], [2, 2]];
const diag1 = [[0, 0], [1, 1], [2, 2]];
const diag2 = [[0, 2], [1, 1], [2, 0]];

const ongoing = Map()
  .setIn([0, 0], "X")
  .setIn([1, 0], "O")
  .setIn([0, 1], "X")
  .setIn([1, 1], "O");

const xWins = ongoing.setIn([0, 2], "X");

const oWins = ongoing
  .setIn([0, 0], "O")
  .setIn([1, 1], "O")
  .setIn([2, 2], "O");

console.log("null?", winner(ongoing));
console.log("X?", winner(xWins));
console.log("O?", winner(oWins));

console.log("oWins", streak(oWins, ...diag1));
console.log("xWins", streak(xWins, ...row1));
