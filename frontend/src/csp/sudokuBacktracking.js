// Sudoku Backtracking CSP

const isValid = (board, row, col, num) => {
  // Check row & col
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }
  
  // Check 3x3 block
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }
  
  return true;
};

export const solveSudoku = (initialBoard) => {
  const history = []; // To animate assignments and backtracks
  const board = initialBoard.map(row => [...row]);
  let assignments = 0;
  let backtracks = 0;
  const startTime = performance.now();

  const solve = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              assignments++;
              history.push({ row, col, val: num, type: 'assign' });
              
              if (solve()) return true;
              
              // Backtrack
              board[row][col] = 0;
              backtracks++;
              history.push({ row, col, val: 0, type: 'backtrack' });
            }
          }
          return false; // Trigger backtrack
        }
      }
    }
    return true; // Solved
  };

  const success = solve();
  const time = performance.now() - startTime;
  
  return { success, history, assignments, backtracks, time, solvedBoard: board };
};
