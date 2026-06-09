// Sudoku Backtracking CSP with Forward Checking

const getBoxIndex = (row, col) => Math.floor(row / 3) * 3 + Math.floor(col / 3);

const buildDomains = (board, rows, cols, boxes) => {
  const domains = Array.from({ length: 9 }, () => Array(9).fill(null));

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const domain = [];
        for (let num = 1; num <= 9; num++) {
          if (!rows[row].has(num) && !cols[col].has(num) && !boxes[getBoxIndex(row, col)].has(num)) {
            domain.push(num);
          }
        }
        if (domain.length === 0) return null;
        domains[row][col] = domain;
      }
    }
  }

  return domains;
};

const cloneDomains = (domains) => domains.map(row => row.map(domain => domain ? [...domain] : null));

const selectNextCell = (board, domains) => {
  let bestCell = null;
  let bestSize = 10;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const domain = domains[row][col] || [];
        if (domain.length < bestSize) {
          bestSize = domain.length;
          bestCell = { row, col };
          if (bestSize <= 1) return bestCell;
        }
      }
    }
  }

  return bestCell;
};

const forwardCheck = (row, col, value, board, domains) => {
  const boxStartRow = Math.floor(row / 3) * 3;
  const boxStartCol = Math.floor(col / 3) * 3;

  const neighbors = [];
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === 0 && domains[row][i]) neighbors.push([row, i]);
    if (board[i][col] === 0 && domains[i][col]) neighbors.push([i, col]);
  }

  for (let r = boxStartRow; r < boxStartRow + 3; r++) {
    for (let c = boxStartCol; c < boxStartCol + 3; c++) {
      if (board[r][c] === 0 && domains[r][c]) neighbors.push([r, c]);
    }
  }

  for (const [nr, nc] of neighbors) {
    if (nr === row && nc === col) continue;
    const domain = domains[nr][nc];
    if (!domain) continue;
    const filtered = domain.filter((num) => num !== value);
    if (filtered.length === 0) return false;
    domains[nr][nc] = filtered;
  }

  return true;
};

export const solveSudoku = (initialBoard) => {
  const history = []; // To animate assignments and backtracks
  const board = initialBoard.map((row) => [...row]);
  let assignments = 0;
  let backtracks = 0;
  const startTime = performance.now();

  const rows = Array.from({ length: 9 }, () => new Set());
  const cols = Array.from({ length: 9 }, () => new Set());
  const boxes = Array.from({ length: 9 }, () => new Set());

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = board[row][col];
      if (value !== 0) {
        const boxIndex = getBoxIndex(row, col);
        if (rows[row].has(value) || cols[col].has(value) || boxes[boxIndex].has(value)) {
          const time = performance.now() - startTime;
          return { success: false, history, assignments, backtracks, time, solvedBoard: board };
        }
        rows[row].add(value);
        cols[col].add(value);
        boxes[boxIndex].add(value);
      }
    }
  }

  let domains = buildDomains(board, rows, cols, boxes);
  if (!domains) {
    const time = performance.now() - startTime;
    return { success: false, history, assignments, backtracks, time, solvedBoard: board };
  }

  const solve = () => {
    const nextCell = selectNextCell(board, domains);
    if (!nextCell) return true;

    const { row, col } = nextCell;
    const domain = domains[row][col] || [];

    for (const value of domain) {
      const savedDomains = cloneDomains(domains);
      board[row][col] = value;
      rows[row].add(value);
      cols[col].add(value);
      boxes[getBoxIndex(row, col)].add(value);
      assignments++;
      history.push({ row, col, val: value, type: 'assign' });

      domains[row][col] = [value];
      if (forwardCheck(row, col, value, board, domains) && solve()) {
        return true;
      }

      board[row][col] = 0;
      rows[row].delete(value);
      cols[col].delete(value);
      boxes[getBoxIndex(row, col)].delete(value);
      domains = savedDomains;
      backtracks++;
      history.push({ row, col, val: 0, type: 'backtrack' });
    }

    return false;
  };

  const success = solve();
  const time = performance.now() - startTime;
  return { success, history, assignments, backtracks, time, solvedBoard: board };
};
