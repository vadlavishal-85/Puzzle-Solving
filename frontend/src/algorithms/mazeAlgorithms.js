class PriorityQueue {
  constructor() { this.items = []; }
  enqueue(el, priority) {
    const qe = { el, priority };
    let added = false;
    for(let i=0; i<this.items.length; i++) {
      if(this.items[i].priority > qe.priority) {
        this.items.splice(i, 0, qe); added = true; break;
      }
    }
    if(!added) this.items.push(qe);
  }
  dequeue() { return this.items.shift(); }
  isEmpty() { return this.items.length === 0; }
}

const getNeighbors = (grid, r, c) => {
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  const res = [];
  for(let [dr, dc] of dirs) {
    const nr = r+dr, nc = c+dc;
    if(nr>=0 && nr<grid.length && nc>=0 && nc<grid[0].length && grid[nr][nc] !== 1) {
      res.push([nr, nc]);
    }
  }
  return res;
};

const serialize = (r, c) => `${r},${c}`;
const manhattan = (r1, c1, r2, c2) => Math.abs(r1-r2) + Math.abs(c1-c2);

export const solveMaze = (grid, start, goal, algorithm) => {
  const startR = start[0], startC = start[1];
  const goalR = goal[0], goalC = goal[1];
  
  let nodesExpanded = 0;
  const startTime = performance.now();
  const history = []; // To animate explored nodes
  
  const pq = new PriorityQueue();
  pq.enqueue({ r: startR, c: startC, path: [[startR, startC]], cost: 0 }, 0);
  
  const explored = new Map();
  explored.set(serialize(startR, startC), 0);

  // DFS Stack
  const stack = [{ r: startR, c: startC, path: [[startR, startC]], cost: 0 }];
  // BFS Queue
  const queue = [{ r: startR, c: startC, path: [[startR, startC]], cost: 0 }];

  while (true) {
    let current;
    
    if (algorithm === 'dfs') {
      if(stack.length === 0) break;
      current = stack.pop();
    } else if (algorithm === 'bfs') {
      if(queue.length === 0) break;
      current = queue.shift();
    } else {
      if(pq.isEmpty()) break;
      current = pq.dequeue().el;
    }

    const { r, c, path, cost } = current;
    nodesExpanded++;
    if(r !== startR || c !== startC) history.push({r, c, type: 'visited'});

    if (r === goalR && c === goalC) {
      const time = performance.now() - startTime;
      return { success: true, path, history, nodesExpanded, time, depth: path.length - 1 };
    }

    const neighbors = getNeighbors(grid, r, c);
    
    for (let [nr, nc] of neighbors) {
      const newCost = cost + 1;
      const key = serialize(nr, nc);
      
      let shouldExplore = false;
      if (algorithm === 'dfs' || algorithm === 'bfs') {
        if (!explored.has(key)) {
          explored.set(key, newCost);
          shouldExplore = true;
        }
      } else {
        if (!explored.has(key) || newCost < explored.get(key)) {
          explored.set(key, newCost);
          shouldExplore = true;
        }
      }

      if (shouldExplore) {
        history.push({r: nr, c: nc, type: 'frontier'});
        const nextState = { r: nr, c: nc, path: [...path, [nr, nc]], cost: newCost };
        
        if (algorithm === 'dfs') stack.push(nextState);
        else if (algorithm === 'bfs') queue.push(nextState);
        else if (algorithm === 'ucs') pq.enqueue(nextState, newCost);
        else if (algorithm === 'greedy') pq.enqueue(nextState, manhattan(nr, nc, goalR, goalC));
      }
    }
    
    if(nodesExpanded > 5000) break; // Hard limit for safety
  }
  
  return { success: false, history, reason: "No path found." };
};
