import { Map } from 'immutable';

const board = Map();
// Action Types
const MOVE = 'MOVE';

export default function reducer(state = { board, turn: 'X' }, action) {
  // Check for errors first
  const isBad = bad(state, action);
  if (isBad) return { ...state, error: isBad };
  // Object.assign({}, state, {error})

  // Check for the action type
  switch (action.type) {
    // Update the board state with the player's move
    case MOVE: {
      return {
        board: boardReducer(state.board, action),
        turn: turnReducer(state.turn, action),
        winner: winnerReducer(state.board, action),
      };
    }
    default:
      return state;
  }
}

export function turnReducer(turn = 'X', action) {
  if (action.type === MOVE) {
    return turn === 'X' ? 'O' : 'X';
  }
  return turn;
}

export function boardReducer(board = Map(), action) {
  if (action.type === MOVE) {
    return board.setIn(action.position, action.turn);
  }
  return board;
}

export function winnerReducer(board = Map(), action) {
  if (action.type === MOVE) {
    return winner(board.setIn(action.position, action.turn));
  }
}

// Returns a MOVE Action
export function move(turn, position) {
  return { type: MOVE, position, turn };
}

export function bad(state, action) {
  // console.log("In bad fn. state:", state, " action:", action);
  if (action.type !== MOVE) return;   // Start action and INIT action are ok to ignore

  // If action.player isn't state.turn, bad should return a message telling the player it's not their turn.
  if (action.turn !== state.turn) return "It's not your turn";
  // If action.coord isn't an array containing two integers between 0 and 2, bad should return a message saying the position is invalid.
  if (!Array.isArray(action.position)) return 'action.position is not an array';
  // Check each coordinate to see if it's valid
  const coord = action.position;
  if (
    !coord.length === 2 ||
    !isWithinBounds(coord[0]) ||
    !isWithinBounds(coord[1])
  ) {
    return `Invalid coordinate: ${coord}`;
  }
  // If the board already has action.coord, bad should return a message saying that square is already taken.
  if (state.board.hasIn(coord)) return `${coord} already has a value in it`;

  // Action is valid, return null
  return null;
}

function isWithinBounds(num) {
  return num >= 0 && num <= 2;
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
  return 'draw';
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
