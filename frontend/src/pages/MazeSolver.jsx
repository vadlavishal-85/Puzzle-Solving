import { useState } from 'react';
import { Play, AlertTriangle, RefreshCw } from 'lucide-react';
import { solveMaze } from '../algorithms/mazeAlgorithms';

const ROWS = 15;
const COLS = 20;

const createEmptyGrid = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

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
      
      // Animate search
      let i = 0;
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
            }, 30);
          } else {
            setErrorMsg("No path exists to the goal.");
            setIsSolving(false);
          }
        }
      }, 40); // Average animation for maze
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
              <option value="greedy">Greedy Search</option>
            </select>
            
            <button 
              onClick={handleSolve} 
              disabled={isSolving}
              className="w-full btn-primary py-3 flex justify-center items-center disabled:opacity-50"
            >
              <Play className="mr-2" /> {isSolving ? 'Searching...' : 'Find Path'}
            </button>
          </div>

          {stats && (
            <div className="glass-card p-6 bg-gradient-to-br from-secondary/20 to-transparent border border-secondary/30">
              <h3 className="font-bold mb-3 uppercase tracking-wider text-sm text-slate-800 dark:text-slate-200">Results</h3>
              <div className="flex justify-between mb-2"><span className="opacity-70">Nodes Expanded:</span> <strong>{stats.nodesExpanded}</strong></div>
              <div className="flex justify-between mb-2"><span className="opacity-70">Path Length:</span> <strong>{stats.depth}</strong></div>
              <div className="flex justify-between"><span className="opacity-70">Time:</span> <strong>{stats.time} ms</strong></div>
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
