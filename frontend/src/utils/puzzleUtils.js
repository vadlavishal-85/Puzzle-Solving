// Helper functions for 8-Puzzle

export const isGoal = (state, goalState) => {
  return state.every((val, index) => val === goalState[index]);
};

export const getBlankIndex = (state) => {
  return state.indexOf(0);
};

export const swap = (state, i, j) => {
  const newState = [...state];
  [newState[i], newState[j]] = [newState[j], newState[i]];
  return newState;
};

// Get valid neighbors (states) from current state
export const getNeighbors = (state) => {
  const neighbors = [];
  const blankIdx = getBlankIndex(state);
  const row = Math.floor(blankIdx / 3);
  const col = blankIdx % 3;

  // Directions: Up, Down, Left, Right
  const moves = [
    { r: -1, c: 0 }, // Up
    { r: 1, c: 0 },  // Down
    { r: 0, c: -1 }, // Left
    { r: 0, c: 1 }   // Right
  ];

  for (let move of moves) {
    const newRow = row + move.r;
    const newCol = col + move.c;
    if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
      const targetIdx = newRow * 3 + newCol;
      neighbors.push(swap(state, blankIdx, targetIdx));
    }
  }
  return neighbors;
};

// Check if a puzzle state is solvable
// An 8-puzzle is solvable if the number of inversions is even
export const isSolvable = (state) => {
  let inversions = 0;
  const filtered = state.filter(n => n !== 0);
  for (let i = 0; i < filtered.length - 1; i++) {
    for (let j = i + 1; j < filtered.length; j++) {
      if (filtered[i] > filtered[j]) inversions++;
    }
  }
  return inversions % 2 === 0;
};

// Heuristics
export const misplacedTiles = (state, goalState) => {
  let count = 0;
  for (let i = 0; i < state.length; i++) {
    if (state[i] !== 0 && state[i] !== goalState[i]) {
      count++;
    }
  }
  return count;
};

export const manhattanDistance = (state, goalState) => {
  let distance = 0;
  for (let i = 0; i < state.length; i++) {
    if (state[i] !== 0) {
      const targetIdx = goalState.indexOf(state[i]);
      const currRow = Math.floor(i / 3);
      const currCol = i % 3;
      const targetRow = Math.floor(targetIdx / 3);
      const targetCol = targetIdx % 3;
      distance += Math.abs(currRow - targetRow) + Math.abs(currCol - targetCol);
    }
  }
  return distance;
};

// Generate random solvable state
export const generateRandomState = (goalState) => {
  let state = [...goalState];
  // Make random valid moves backwards from goal to ensure solvability
  for(let i = 0; i < 100; i++) {
    const neighbors = getNeighbors(state);
    state = neighbors[Math.floor(Math.random() * neighbors.length)];
  }
  return state;
};
