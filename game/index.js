import { Map } from "immutable";

const board = Map();
// Action Types
const MOVE = "MOVE";

export default function reducer(state = { board, turn: "X" }, action) {
  // Check for the action type
  switch (action.type) {
    // Update the board state with the player's move
    case MOVE: {
      return {
        board: boardReducer(state.board, action),
        turn: turnReducer(state.turn, action),
        winner: winnerReducer(state.board, action)
      };
    }
    default:
      return state;
  }
}

export function turnReducer(turn = "X", action) {
  if (action.type === MOVE) {
    return turn === "X" ? "O" : "X";
  }
  return turn;
}

export function boardReducer(board = Map(), action) {
  if (action.type === MOVE) {
    return board.setIn(action.position, action.player);
  }
  return board;
}

export function winnerReducer(board = Map(), action) {
  if (action.type === MOVE) {
    return winner(board.setIn(action.position, action.player));
  }
}

// Returns a MOVE Action
export function move(player, position) {
  return { type: MOVE, position, player };
}

export function bad() {
  console.log("bad not implemented");
}

export function winner(board) {
  const row1 = [[0, 0], [0, 1], [0, 2]];
  const row2 = [[1, 0], [1, 1], [1, 2]];
  const row3 = [[2, 0], [2, 1], [2, 2]];
  const col1 = [[0, 0], [1, 0], [2, 0]];
  const col2 = [[0, 1], [1, 1], [2, 1]];
  const col3 = [[0, 2], [1, 2], [2, 2]];
  const diag1 = [[0, 0], [1, 1], [2, 2]];
  const diag2 = [[0, 2], [1, 1], [2, 0]];
  const coordinates = [row1, row2, row3, col1, col2, col3, diag1, diag2];

  for (let i = 0; i < coordinates.length; i++) {
    let value = streak(board, ...coordinates[i]);
    if (value) return value;
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let hasValue = board.hasIn([i, j]);
      if (!hasValue) return null;
    }
  }
  return "draw";
}

export function streak(board, firstCoord, ...remainingCoords) {
  const coord = board.getIn(firstCoord);
  if (!coord) return undefined;

  for (let i = 0; i < remainingCoords.length; i++) {
    let value = board.getIn(remainingCoords[i]);
    if (value !== coord) return undefined;
  }

  return coord;
}
