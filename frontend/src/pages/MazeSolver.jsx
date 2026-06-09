import { useState } from 'react';
import { Play, AlertTriangle, RefreshCw, Info } from 'lucide-react';
import { solveMaze } from '../algorithms/mazeAlgorithms';

const ROWS = 15;
const COLS = 20;

const createEmptyGrid = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const ALGORITHM_COMPLEXITY = {
  bfs: {
    name: 'Breadth First Search',
    time: 'O(V + E)',
    space: 'O(V)',
    description: 'Explores all nodes at current depth before moving deeper. Guarantees shortest path.',
    bestFor: 'Unweighted graphs, shortest path'
  },
  dfs: {
    name: 'Depth First Search',
    time: 'O(V + E)',
    space: 'O(V)',
    description: 'Explores as far as possible along each branch before backtracking.',
    bestFor: 'Memory-limited scenarios, general search'
  },
  ucs: {
    name: 'Uniform Cost Search',
    time: 'O((V + E) log V)',
    space: 'O(V)',
    description: 'Explores nodes in order of their path cost. Guarantees optimal path with non-negative costs.',
    bestFor: 'Weighted graphs, optimal path'
  },
  greedy: {
    name: 'Greedy Best-First',
    time: 'O((V + E) log V)',
    space: 'O(V)',
    description: 'Uses heuristic to estimate distance to goal. Fast but may not find optimal path.',
    bestFor: 'Speed-prioritized search'
  },
  astar: {
    name: 'A* Search',
    time: 'O((V + E) log V)',
    space: 'O(V)',
    description: 'Combines actual cost and heuristic estimate. Optimal and efficient with good heuristic.',
    bestFor: 'Balanced optimal and fast search'
  },
  bidirectional: {
    name: 'Bidirectional Search',
    time: 'O(b^(d/2))',
    space: 'O(b^(d/2))',
    description: 'Searches from both start and goal simultaneously, meeting in the middle.',
    bestFor: 'Significantly faster on large spaces'
  }
};

function MazeSolver() {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [start, setStart] = useState([1, 1]);
  const [goal, setGoal] = useState([ROWS - 2, COLS - 2]);
  
  // Modes: 'draw_wall', 'erase_wall', 'set_start', 'set_goal'
  const [mode, setMode] = useState('draw_wall');
  const [isMouseDown, setIsMouseDown] = useState(false);
  
  const [algorithm, setAlgorithm] = useState('bfs');
  const [isSolving, setIsSolving] = useState(false);
  
  const [visited, setVisited] = useState(new Set());
  const [frontier, setFrontier] = useState(new Set());
  const [path, setPath] = useState(new Set());
  const [stats, setStats] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [speed, setSpeed] = useState(1);

  const clearVisualization = () => {
    setVisited(new Set());
    setFrontier(new Set());
    setPath(new Set());
    setStats(null);
    setErrorMsg('');
  };

  const handleClearBoard = () => {
    setGrid(createEmptyGrid());
    clearVisualization();
  };

  const generateRandomMaze = () => {
    clearVisualization();
    const newGrid = createEmptyGrid();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        // Leave start and goal clear
        if ((r === start[0] && c === start[1]) || (r === goal[0] && c === goal[1])) continue;
        if (Math.random() < 0.25) newGrid[r][c] = 1;
      }
    }
    setGrid(newGrid);
  };

  const interact = (r, c) => {
    if (isSolving) return;
    if (mode === 'set_start') {
      if (grid[r][c] !== 1 && (r !== goal[0] || c !== goal[1])) setStart([r, c]);
    } else if (mode === 'set_goal') {
      if (grid[r][c] !== 1 && (r !== start[0] || c !== start[1])) setGoal([r, c]);
    } else {
      if ((r === start[0] && c === start[1]) || (r === goal[0] && c === goal[1])) return;
      const newGrid = [...grid];
      newGrid[r][c] = mode === 'draw_wall' ? 1 : 0;
      setGrid(newGrid);
    }
  };

  const handleSolve = () => {
    clearVisualization();
    setIsSolving(true);
    
    setTimeout(() => {
      const result = solveMaze(grid, start, goal, algorithm);
      
      if (!result.success && !result.history) {
        setErrorMsg(result.reason);
        setIsSolving(false);
        return;
      }

      const { history, path: finalPath, nodesExpanded, time, depth } = result;
      
      // Animate search with speed control
      let i = 0;
      const animationDelay = Math.max(10, 40 / speed);
      const pathDelay = Math.max(10, 30 / speed);
      const animate = setInterval(() => {
        if (i < history.length) {
          const step = history[i];
          const key = `${step.r},${step.c}`;
          if (step.type === 'frontier') {
            setFrontier(prev => new Set(prev).add(key));
          } else {
            setVisited(prev => new Set(prev).add(key));
          }
          i++;
        } else {
          clearInterval(animate);
          
          if (result.success) {
            // Animate final path
            let j = 0;
            const pathAnim = setInterval(() => {
              if(j < finalPath.length) {
                const node = finalPath[j];
                setPath(prev => new Set(prev).add(`${node[0]},${node[1]}`));
                j++;
              } else {
                clearInterval(pathAnim);
                setIsSolving(false);
                setStats({ nodesExpanded, time: time.toFixed(2), depth });
              }
            }, pathDelay);
          } else {
            setErrorMsg("No path exists to the goal.");
            setIsSolving(false);
          }
        }
      }, animationDelay);
    }, 50);
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-secondary mb-2">
            Maze Solver
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Draw walls, move the start and goal, and watch graph search algorithms find a path through the grid!
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center">
          <AlertTriangle className="mr-2" /> {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 uppercase tracking-wider text-sm text-slate-500">Draw Mode</h3>
            <div className="space-y-2">
              <button onClick={() => setMode('draw_wall')} className={`w-full py-2 px-3 rounded-lg flex items-center ${mode === 'draw_wall' ? 'bg-secondary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'}`}>
                Draw Walls
              </button>
              <button onClick={() => setMode('erase_wall')} className={`w-full py-2 px-3 rounded-lg flex items-center ${mode === 'erase_wall' ? 'bg-secondary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'}`}>
                Erase Walls
              </button>
              <button onClick={() => setMode('set_start')} className={`w-full py-2 px-3 rounded-lg flex items-center ${mode === 'set_start' ? 'bg-primary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'}`}>
                Move Start Node
              </button>
              <button onClick={() => setMode('set_goal')} className={`w-full py-2 px-3 rounded-lg flex items-center ${mode === 'set_goal' ? 'bg-success text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'}`}>
                Move Goal Node
              </button>
            </div>
            
            <div className="mt-6 space-y-2">
              <button onClick={handleClearBoard} className="w-full py-2 btn-secondary text-sm flex justify-center items-center">
                Clear Board
              </button>
              <button onClick={generateRandomMaze} className="w-full py-2 btn-accent text-sm flex justify-center items-center">
                <RefreshCw className="w-4 h-4 mr-2" /> Random Maze
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 uppercase tracking-wider text-sm text-slate-500">Algorithm</h3>
            <select 
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 mb-4"
              disabled={isSolving}
            >
              <option value="bfs">Breadth First Search</option>
              <option value="dfs">Depth First Search</option>
              <option value="ucs">Uniform Cost Search</option>
              <option value="greedy">Greedy Best-First</option>
              <option value="astar">A* Search</option>
              <option value="bidirectional">Bidirectional Search</option>
            </select>
            
            {/* Speed Slider */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase block mb-2">
                Visualization Speed: {speed.toFixed(1)}x
              </label>
              <input 
                type="range" 
                min="0.25" 
                max="2" 
                step="0.25" 
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                disabled={isSolving}
                className="w-full cursor-pointer accent-secondary"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0.25x</span>
                <span>2x</span>
              </div>
            </div>
            
            {/* Complexity Info */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 mb-4 text-xs">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{ALGORITHM_COMPLEXITY[algorithm].name}</span>
              </div>
              <div className="space-y-1 text-slate-600 dark:text-slate-400">
                <div><span className="font-medium">Time:</span> {ALGORITHM_COMPLEXITY[algorithm].time}</div>
                <div><span className="font-medium">Space:</span> {ALGORITHM_COMPLEXITY[algorithm].space}</div>
                <div className="mt-2 italic">{ALGORITHM_COMPLEXITY[algorithm].description}</div>
              </div>
            </div>
            
            <button 
              onClick={handleSolve} 
              disabled={isSolving}
              className="w-full btn-primary py-3 flex justify-center items-center disabled:opacity-50"
            >
              <Play className="mr-2" /> {isSolving ? 'Searching...' : 'Find Path'}
            </button>
          </div>

          {stats && (
            <div className="glass-card p-4 bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 rounded-xl shadow-lg">
              <h3 className="font-bold uppercase tracking-widest text-xs text-slate-300 mb-3 px-1">Results</h3>
              
              {/* Main Metrics Grid - 3 Equal Cards */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {/* Nodes Expanded */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/40 rounded-lg p-3 text-center">
                  <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-1">Nodes</div>
                  <div className="text-xl font-bold text-cyan-300">{stats.nodesExpanded}</div>
                </div>
                
                {/* Path Length */}
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/40 rounded-lg p-3 text-center">
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1">Path</div>
                  <div className="text-xl font-bold text-emerald-300">{stats.depth}</div>
                </div>
                
                {/* Execution Time */}
                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 rounded-lg p-3 text-center">
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-1">Time</div>
                  <div className="text-xl font-bold text-amber-300">{stats.time}ms</div>
                </div>
              </div>
              
              {/* Complexity Info - 2 Equal Cards */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-700/40 border border-slate-600/50 rounded-lg p-2.5 text-center">
                  <div className="text-xs text-slate-400 mb-1">Time Complexity</div>
                  <div className="font-bold text-slate-200 text-sm">{ALGORITHM_COMPLEXITY[algorithm].time}</div>
                </div>
                <div className="bg-slate-700/40 border border-slate-600/50 rounded-lg p-2.5 text-center">
                  <div className="text-xs text-slate-400 mb-1">Space Complexity</div>
                  <div className="font-bold text-slate-200 text-sm">{ALGORITHM_COMPLEXITY[algorithm].space}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Grid Area */}
        <div className="lg:col-span-3 flex justify-center">
          <div 
            className="glass-card p-4 inline-block select-none shadow-2xl"
            onMouseLeave={() => setIsMouseDown(false)}
            onMouseUp={() => setIsMouseDown(false)}
          >
            <div 
              className="grid gap-[2px] bg-slate-300 dark:bg-slate-700 p-[2px] rounded-lg"
              style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
            >
              {grid.map((row, r) => 
                row.map((val, c) => {
                  const key = `${r},${c}`;
                  const isStart = r === start[0] && c === start[1];
                  const isGoalPos = r === goal[0] && c === goal[1];
                  const isWall = val === 1;
                  const isPath = path.has(key);
                  const isVisited = visited.has(key);
                  const isFrontier = frontier.has(key);
                  
                  let bgColor = 'bg-white dark:bg-slate-800';
                  if (isWall) bgColor = 'bg-slate-800 dark:bg-slate-200 shadow-inner scale-105';
                  else if (isStart) bgColor = 'bg-primary z-10 animate-pulse ring-4 ring-primary/30 rounded-md';
                  else if (isGoalPos) bgColor = 'bg-success z-10 ring-4 ring-success/30 rounded-md';
                  else if (isPath) bgColor = 'bg-emerald-500 dark:bg-emerald-400 transition-all duration-300 scale-90 rounded-sm';
                  else if (isVisited) bgColor = 'bg-sky-500 dark:bg-sky-400 transition-all duration-500 scale-95';
                  else if (isFrontier) bgColor = 'bg-sky-300 dark:bg-sky-200 transition-all duration-100 scale-95';

                  return (
                    <div
                      key={key}
                      onMouseDown={() => { setIsMouseDown(true); interact(r, c); }}
                      onMouseEnter={() => { if(isMouseDown) interact(r, c); }}
                      className={`w-5 h-5 sm:w-8 sm:h-8 ${bgColor} cursor-crosshair transition-colors`}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MazeSolver;
