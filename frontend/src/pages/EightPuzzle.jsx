import { useState, useEffect } from 'react';
import { Play, RotateCcw, FastForward, CheckCircle2, AlertTriangle, Settings2, Move } from 'lucide-react';
import { getNeighbors, isGoal, isSolvable, getBlankIndex, swap, generateRandomState } from '../utils/puzzleUtils';
import { solveBFS, solveDFS, solveUCS, solveAStar, solveGreedy, solveIDDFS } from '../algorithms/puzzleAlgorithms';

const GOAL_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 0];

function EightPuzzle() {
  const [initialState, setInitialState] = useState([1, 2, 3, 4, 0, 6, 7, 5, 8]);
  const [currentState, setCurrentState] = useState(initialState);
  const [goalState, setGoalState] = useState(GOAL_STATE);
  
  const [algorithm, setAlgorithm] = useState('astar');
  const [heuristic, setHeuristic] = useState('manhattan');
  const [stats, setStats] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [isSolving, setIsSolving] = useState(false);
  const [path, setPath] = useState([]);
  const [pathIndex, setPathIndex] = useState(0);
  const [manualMoves, setManualMoves] = useState(0);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editInitial, setEditInitial] = useState(initialState.join(','));
  const [editGoal, setEditGoal] = useState(goalState.join(','));

  // Reset to initial
  const handleReset = () => {
    setCurrentState(initialState);
    setPath([]);
    setStats(null);
    setErrorMsg("");
    setManualMoves(0);
  };

  // Generate solvable random state
  const handleRandomize = () => {
    const randomState = generateRandomState(goalState);
    setInitialState(randomState);
    setCurrentState(randomState);
    setPath([]);
    setStats(null);
    setErrorMsg("");
    setManualMoves(0);
  };

  // Handle manual clicking
  const handleTileClick = (index) => {
    if (isSolving || path.length > 0) return; // Prevent manual moves while animating
    const blankIdx = getBlankIndex(currentState);
    
    // Check if clicked tile is adjacent to blank
    const row = Math.floor(index / 3);
    const col = index % 3;
    const bRow = Math.floor(blankIdx / 3);
    const bCol = blankIdx % 3;
    
    if (Math.abs(row - bRow) + Math.abs(col - bCol) === 1) {
      setCurrentState(swap(currentState, index, blankIdx));
      setManualMoves(prev => prev + 1);
    }
  };

  const handleSolve = () => {
    if (!isSolvable(initialState)) {
      setErrorMsg("This initial state is unsolvable!");
      return;
    }
    
    setErrorMsg("");
    setStats(null);
    setIsSolving(true);
    setPath([]);
    
    // Use setTimeout so UI can render "Solving..." state
    setTimeout(() => {
      let result;
      switch(algorithm) {
        case 'bfs': result = solveBFS(initialState, goalState); break;
        case 'dfs': result = solveDFS(initialState, goalState); break;
        case 'ucs': result = solveUCS(initialState, goalState); break;
        case 'iddfs': result = solveIDDFS(initialState, goalState); break;
        case 'greedy': result = solveGreedy(initialState, goalState, heuristic); break;
        case 'astar': result = solveAStar(initialState, goalState, heuristic); break;
        default: result = solveAStar(initialState, goalState, heuristic);
      }
      
      setIsSolving(false);
      if (result.success) {
        setStats({
          nodesExpanded: result.nodesExpanded,
          depth: result.depth,
          time: result.time.toFixed(2),
          totalMoves: result.path.length - 1
        });
        setPath(result.path);
        setPathIndex(0);
      } else {
        setErrorMsg(result.reason);
      }
    }, 50);
  };

  // Animate Path
  useEffect(() => {
    if (path.length > 0 && pathIndex < path.length) {
      const timer = setTimeout(() => {
        setCurrentState(path[pathIndex]);
        setPathIndex(prev => prev + 1);
      }, 400); // 400ms per step
      return () => clearTimeout(timer);
    }
  }, [path, pathIndex]);

  const saveEdit = () => {
    const parseArray = (str) => str.split(',').map(n => parseInt(n.trim()));
    const newInit = parseArray(editInitial);
    const newGoal = parseArray(editGoal);
    
    // Basic validation
    const isValid = (arr) => arr.length === 9 && [...arr].sort().join('') === "012345678";
    
    if (isValid(newInit) && isValid(newGoal)) {
      setInitialState(newInit);
      setGoalState(newGoal);
      setCurrentState(newInit);
      setIsEditing(false);
      setErrorMsg("");
      setPath([]);
      setStats(null);
    } else {
      setErrorMsg("Invalid board configuration. Must contain 0-8 exactly once.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-primary mb-2">
            <Move className="mr-3 w-8 h-8" />
            8-Puzzle Solver
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Explore state space search by interacting with this classic sliding tile puzzle. Solve it manually or visualize how AI algorithms find the optimal path.
          </p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="mt-4 md:mt-0 flex items-center bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 px-4 py-2 rounded-xl transition-colors font-semibold"
        >
          <Settings2 className="mr-2 w-5 h-5" />
          {isEditing ? 'Close Editor' : 'Custom Board Editor'}
        </button>
      </div>

      {isEditing && (
        <div className="glass-card p-6 mb-8 border-l-4 border-primary">
          <h3 className="text-xl font-bold mb-4">Edit Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Initial State (comma separated 0-8)</label>
              <input 
                type="text" 
                value={editInitial} 
                onChange={(e) => setEditInitial(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Goal State (comma separated 0-8)</label>
              <input 
                type="text" 
                value={editGoal} 
                onChange={(e) => setEditGoal(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={saveEdit} className="btn-primary">Save Configuration</button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center border border-red-200 dark:border-red-800">
          <AlertTriangle className="mr-2" /> {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: The Board */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="glass-card p-8 rounded-3xl mb-6 shadow-2xl relative w-full max-w-sm aspect-square bg-gradient-to-br from-slate-200 to-slate-300 dark:from-card-bg dark:to-slate-900">
            <div className="grid grid-cols-3 gap-3 w-full h-full p-2">
              {currentState.map((num, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleTileClick(idx)}
                  className={`
                    flex items-center justify-center text-4xl font-black rounded-xl shadow-md transition-all duration-300
                    ${num === 0 
                      ? 'bg-transparent shadow-none outline-dashed outline-2 outline-slate-300 dark:outline-slate-700' 
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white cursor-pointer hover:scale-105 hover:bg-slate-50 dark:hover:bg-slate-600'}
                  `}
                >
                  {num !== 0 ? num : ''}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4 mb-4">
            <button onClick={handleReset} className="btn-secondary flex items-center text-sm py-2">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </button>
            <button onClick={handleRandomize} className="btn-accent flex items-center text-sm py-2">
              Randomize
            </button>
          </div>
          <p className="text-sm font-semibold opacity-70">
            Manual Moves: {manualMoves}
          </p>
          {isGoal(currentState, goalState) && !isSolving && (
            <p className="mt-4 text-success font-bold flex items-center text-lg animate-pulse">
              <CheckCircle2 className="mr-2" /> Goal Reached!
            </p>
          )}
        </div>

        {/* Right Column: Controls & Stats */}
        <div className="lg:col-span-7">
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">AI Solver</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Algorithm</label>
                <select 
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none"
                  disabled={isSolving || path.length > 0}
                >
                  <option value="bfs">Breadth First Search (BFS)</option>
                  <option value="dfs">Depth First Search (DFS)</option>
                  <option value="ucs">Uniform Cost Search (UCS)</option>
                  <option value="iddfs">Iterative Deepening DFS</option>
                  <option value="greedy">Greedy Best-First Search</option>
                  <option value="astar">A* Search</option>
                </select>
              </div>

              {(algorithm === 'astar' || algorithm === 'greedy') && (
                <div>
                  <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Heuristic Function</label>
                  <select 
                    value={heuristic}
                    onChange={(e) => setHeuristic(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none"
                    disabled={isSolving || path.length > 0}
                  >
                    <option value="manhattan">Manhattan Distance</option>
                    <option value="misplaced">Misplaced Tiles</option>
                  </select>
                </div>
              )}
            </div>

            <button 
              onClick={handleSolve} 
              disabled={isSolving || path.length > 0}
              className="w-full btn-primary py-4 text-lg flex items-center justify-center mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSolving ? (
                <span className="animate-pulse">Solving...</span>
              ) : (
                <>
                  <Play className="mr-2" /> Solve Puzzle
                </>
              )}
            </button>

            {/* Statistics Panel */}
            <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Execution Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-2xl font-black text-primary mb-1">{stats ? stats.totalMoves : '-'}</div>
                <div className="text-xs text-slate-500 font-semibold">Total Moves</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-2xl font-black text-secondary mb-1">{stats ? stats.nodesExpanded : '-'}</div>
                <div className="text-xs text-slate-500 font-semibold">Nodes Expanded</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-2xl font-black text-accent mb-1">{stats ? stats.depth : '-'}</div>
                <div className="text-xs text-slate-500 font-semibold">Search Depth</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-xl font-black text-blue-400 mb-1 mt-1">{stats ? `${stats.time}ms` : '-'}</div>
                <div className="text-xs text-slate-500 font-semibold">Execution Time</div>
              </div>
            </div>
            
            {path.length > 0 && (
               <div className="mt-6 flex items-center text-sm text-slate-500 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                 <FastForward className="mr-2 text-blue-500 w-5 h-5 animate-pulse" />
                 Visualizing solution: Step {Math.min(pathIndex, path.length)} of {path.length}
               </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default EightPuzzle;
