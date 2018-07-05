import {Map} from 'immutable'

const board = Map();
// Action Types
const MOVE = "MOVE";


export default function reducer(state = { board, turn:'X' }, action) {
  // Check for the action type
  switch (action.type) {
    // Update the board state with the player's move
    case MOVE: {
      const nextPlayer = (state.turn === 'X')? 'O' : 'X';
      return {
        board: state.board.setIn(action.position, action.player),
        turn: nextPlayer
      };
    }
    default: return state;
  }
}

// Returns a MOVE Action
export function move(player, position) {
  return { type: MOVE, position, player};
}

export function bad() {
  console.log("bad not implemented")
}
