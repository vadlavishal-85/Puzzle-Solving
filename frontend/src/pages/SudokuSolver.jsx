import { useState } from 'react';
import { Play, CheckCircle2, AlertTriangle, FastForward } from 'lucide-react';
import { solveSudoku } from '../csp/sudokuBacktracking';

const INITIAL_EASY = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

const INITIAL_MEDIUM = [
  [0, 2, 0, 6, 0, 8, 0, 0, 0],
  [5, 8, 0, 0, 0, 9, 7, 0, 0],
  [0, 0, 0, 0, 4, 0, 0, 0, 0],
  [3, 7, 0, 0, 0, 0, 5, 0, 0],
  [6, 0, 0, 0, 0, 0, 0, 0, 4],
  [0, 0, 8, 0, 0, 0, 0, 1, 3],
  [0, 0, 0, 0, 2, 0, 0, 0, 0],
  [0, 0, 9, 8, 0, 0, 0, 3, 6],
  [0, 0, 0, 3, 0, 6, 0, 9, 0]
];

const INITIAL_HARD = [
  [0, 0, 0, 6, 0, 0, 4, 0, 0],
  [7, 0, 0, 0, 0, 3, 6, 0, 0],
  [0, 0, 0, 0, 9, 1, 0, 8, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 5, 0, 1, 8, 0, 0, 0, 3],
  [0, 0, 0, 3, 0, 6, 0, 4, 5],
  [0, 4, 0, 2, 0, 0, 0, 6, 0],
  [9, 0, 3, 0, 0, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 0, 1, 0, 0]
];

const INITIAL_EMPTY = Array.from({length: 9}, () => Array(9).fill(0));

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const isSafeSudoku = (board, row, col, num) => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[startRow + r][startCol + c] === num) return false;
    }
  }
  return true;
};

const fillRandomSudoku = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const candidates = shuffleArray([1,2,3,4,5,6,7,8,9]);
        for (const num of candidates) {
          if (isSafeSudoku(board, row, col, num)) {
            board[row][col] = num;
            if (fillRandomSudoku(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const generateRandomBoard = () => {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillRandomSudoku(board);
  const holes = 46;
  const result = board.map(row => [...row]);
  let removed = 0;
  while (removed < holes) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (result[row][col] !== 0) {
      result[row][col] = 0;
      removed += 1;
    }
  }
  return result;
};

function SudokuSolver() {
  const [originalBoard, setOriginalBoard] = useState(INITIAL_EASY);
  const [board, setBoard] = useState(INITIAL_EASY);
  const [isSolving, setIsSolving] = useState(false);
  const [activeCell, setActiveCell] = useState(null);
  
  const [stats, setStats] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSolved, setIsSolved] = useState(false);

  const handleCellChange = (r, c, value) => {
    if (isSolving) return;
    const num = value === '' ? 0 : parseInt(value);
    if (isNaN(num) || num < 0 || num > 9) return;
    
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = num;
    setBoard(newBoard);
    
    // Update originalBoard to match so it locks this cell for the solver
    const newOrig = originalBoard.map(row => [...row]);
    newOrig[r][c] = num;
    setOriginalBoard(newOrig);
    
    setIsSolved(false);
    setStats(null);
  };

  const loadDifficulty = (levelArray) => {
    setOriginalBoard(levelArray);
    setBoard(levelArray);
    setIsSolved(false);
    setStats(null);
    setErrorMsg("");
    setActiveCell(null);
  };

  const clearBoard = () => {
    loadDifficulty(INITIAL_EMPTY);
  };

  const handleSolve = () => {
    setIsSolving(true);
    setStats(null);
    setErrorMsg("");
    setIsSolved(false);

    const currentBoard = board.map(row => [...row]);

    setTimeout(() => {
      const result = solveSudoku(currentBoard);

      if (!result.history || result.history.length === 0) {
        if(result.success) {
           setBoard(result.solvedBoard);
           setIsSolved(true);
           setStats({ assignments: result.assignments, backtracks: result.backtracks, time: result.time.toFixed(2) });
        } else {
           setErrorMsg("This Sudoku puzzle is unsolvable!");
        }
        setIsSolving(false);
        return;
      }

      let i = 0;
      const animationSpeed = 80; 
      
      const animate = setInterval(() => {
        if (i < result.history.length) {
          const step = result.history[i];
          setBoard(prevBoard => {
            const nb = prevBoard.map(row => [...row]);
            nb[step.row][step.col] = step.val;
            return nb;
          });
          setActiveCell({ row: step.row, col: step.col, status: step.type });
          i++;
        } else {
          clearInterval(animate);
          setIsSolving(false);
          setActiveCell(null);
          
          if (result.success) {
            setIsSolved(true);
            setStats({ assignments: result.assignments, backtracks: result.backtracks, time: result.time.toFixed(2) });
          } else {
            setErrorMsg("This Sudoku puzzle is unsolvable!");
          }
        }
      }, animationSpeed);
    }, 50);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-accent mb-2">
            Sudoku Solver (CSP)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Watch the Constraint Satisfaction Problem (CSP) solver use Backtracking search to assign values and backtrack on violations.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center border border-red-200 dark:border-red-800">
          <AlertTriangle className="mr-2" /> {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Board */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="glass-card p-4 md:p-6 rounded-3xl shadow-2xl relative w-full max-w-md aspect-square bg-gradient-to-br from-slate-200 to-slate-300 dark:from-card-bg dark:to-slate-900">
            <div className="grid grid-cols-9 gap-[1px] w-full h-full bg-slate-300 dark:bg-slate-600 border-[3px] border-slate-400 dark:border-slate-400">
              {board.map((row, r) => 
                row.map((val, c) => {
                  const isBoldBottom = r === 2 || r === 5;
                  const isBoldRight = c === 2 || c === 5;
                  
                  const isActive = activeCell && activeCell.row === r && activeCell.col === c;
                  let bgClass = "bg-white dark:bg-slate-800";
                  
                  const isOriginal = originalBoard[r][c] !== 0;

                  if (isActive) {
                    bgClass = activeCell.status === 'assign' ? 'bg-success/50 transition-colors' : 'bg-red-400/50 transition-colors';
                  } else if (isOriginal) {
                    bgClass = "bg-slate-100 dark:bg-slate-700 font-bold";
                  }

                  return (
                    <input
                      key={`${r}-${c}`}
                      type="text"
                      maxLength={1}
                      value={val === 0 ? '' : val}
                      onChange={(e) => handleCellChange(r, c, e.target.value)}
                      disabled={isSolving || isOriginal}
                      className={`
                        w-full h-full text-center text-base md:text-xl outline-none focus:bg-accent/20 text-slate-800 dark:text-slate-100
                        ${bgClass}
                        ${isBoldBottom ? 'border-b-[3px] border-b-slate-500 dark:border-b-slate-400' : ''}
                        ${isBoldRight ? 'border-r-[3px] border-r-slate-500 dark:border-r-slate-400' : ''}
                      `}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Controls & Stats */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6">
             <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-4 uppercase tracking-wider text-sm text-slate-500">Board Controls</h2>
             <div className="grid grid-cols-2 gap-3 mb-4">
                <button onClick={() => loadDifficulty(INITIAL_EASY)} disabled={isSolving} className="btn-secondary text-sm py-2">
                  Easy
                </button>
                <button onClick={() => loadDifficulty(INITIAL_MEDIUM)} disabled={isSolving} className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 rounded-xl transition-all shadow-md active:scale-95 text-sm">
                  Medium
                </button>
                <button onClick={() => loadDifficulty(INITIAL_HARD)} disabled={isSolving} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-xl transition-all shadow-md active:scale-95 text-sm">
                  Hard
                </button>
                <button onClick={() => {
                  const randomBoard = generateRandomBoard();
                  setOriginalBoard(randomBoard);
                  setBoard(randomBoard);
                  setIsSolved(false);
                  setStats(null);
                  setErrorMsg("");
                  setActiveCell(null);
                }} disabled={isSolving} className="bg-slate-900 text-white hover:bg-slate-700 py-2 rounded-xl transition-colors font-semibold text-sm">
                  Random Puzzle
                </button>
                <button onClick={clearBoard} disabled={isSolving} className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 py-2 rounded-xl transition-colors font-semibold text-sm">
                  Clear Board
                </button>
             </div>
             
             <button 
              onClick={handleSolve} 
              disabled={isSolving}
              className="w-full btn-accent py-4 text-lg flex items-center justify-center disabled:opacity-50 mt-6"
            >
              {isSolving ? (
                <>
                 <FastForward className="mr-2 animate-spin" /> Visualizing Backtracking...
                </>
              ) : (
                <>
                  <Play className="mr-2" /> Start CSP Solver
                </>
              )}
            </button>
          </div>

          {(stats || isSolved) && (
            <div className="glass-card p-6 bg-gradient-to-br from-accent/20 to-transparent border border-accent/30">
              <h3 className="font-bold mb-4 uppercase tracking-wider text-sm text-slate-800 dark:text-slate-200 flex items-center">
                {isSolved ? <CheckCircle2 className="text-success mr-2 w-5 h-5" /> : null}
                CSP Statistics
              </h3>
              {stats && (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Variable Assignments</div>
                    <div className="text-2xl font-bold">{stats.assignments}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Backtracks (Violations)</div>
                    <div className="text-2xl font-bold text-primary">{stats.backtracks}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Execution Time</div>
                    <div className="text-2xl font-bold text-blue-400">{stats.time} ms</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SudokuSolver;
