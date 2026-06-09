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

const reconstructPath = (parents, endKey) => {
  const path = [];
  let current = endKey;
  while (current) {
    const [r, c] = current.split(',').map(Number);
    path.unshift([r, c]);
    current = parents.get(current);
  }
  return path;
};

const reconstructBidirectionalPath = (meetKey, frontParents, backParents) => {
  const frontPath = reconstructPath(frontParents, meetKey);
  const backPath = reconstructPath(backParents, meetKey);
  backPath.shift(); // avoid duplicate meeting node
  return [...frontPath, ...backPath.reverse()];
};

export const solveMaze = (grid, start, goal, algorithm) => {
  const startR = start[0], startC = start[1];
  const goalR = goal[0], goalC = goal[1];
  
  let nodesExpanded = 0;
  const startTime = performance.now();
  const history = []; // To animate explored nodes

  const serializeKey = (r, c) => serialize(r, c);

  if (algorithm === 'bidirectional') {
    const startKey = serializeKey(startR, startC);
    const goalKey = serializeKey(goalR, goalC);

    if (startKey === goalKey) {
      return { success: true, path: [[startR, startC]], history, nodesExpanded, time: 0, depth: 0 };
    }

    const frontQueue = [{ r: startR, c: startC }];
    const backQueue = [{ r: goalR, c: goalC }];
    const frontParents = new Map([[startKey, null]]);
    const backParents = new Map([[goalKey, null]]);
    const frontVisited = new Set([startKey]);
    const backVisited = new Set([goalKey]);

    while (frontQueue.length > 0 && backQueue.length > 0) {
      const expand = (queue, visited, oppositeVisited, parents, oppositeParents) => {
        const current = queue.shift();
        const { r, c } = current;
        const currentKey = serializeKey(r, c);

        nodesExpanded++;
        if (currentKey !== startKey && currentKey !== goalKey) {
          history.push({ r, c, type: 'visited' });
        }

        const neighbors = getNeighbors(grid, r, c);
        for (const [nr, nc] of neighbors) {
          const nextKey = serializeKey(nr, nc);
          if (visited.has(nextKey)) continue;
          visited.add(nextKey);
          parents.set(nextKey, currentKey);
          history.push({ r: nr, c: nc, type: 'frontier' });
          queue.push({ r: nr, c: nc });

          if (oppositeVisited.has(nextKey)) {
            const time = performance.now() - startTime;
            const path = reconstructBidirectionalPath(nextKey, frontParents, backParents);
            return { success: true, path, history, nodesExpanded, time, depth: path.length - 1 };
          }
        }
        return null;
      };

      const frontResult = expand(frontQueue, frontVisited, backVisited, frontParents, backParents);
      if (frontResult) return frontResult;

      const backResult = expand(backQueue, backVisited, frontVisited, backParents, frontParents);
      if (backResult) return backResult;

      if (nodesExpanded > 5000) break;
    }

    return { success: false, history, reason: 'No path found.' };
  }

  const pq = new PriorityQueue();
  pq.enqueue({ r: startR, c: startC, path: [[startR, startC]], cost: 0 }, 0);
  
  const explored = new Map();
  explored.set(serializeKey(startR, startC), 0);

  // DFS uses a stack (LIFO) to explore deeply first.
  const stack = [{ r: startR, c: startC, path: [[startR, startC]], cost: 0 }];
  // BFS uses a queue (FIFO) to explore breadth-first.
  const queue = [{ r: startR, c: startC, path: [[startR, startC]], cost: 0 }];

  while (true) {
    let current;
    
    if (algorithm === 'dfs') {
      // Depth First Search: pop from stack
      if(stack.length === 0) break;
      current = stack.pop();
    } else if (algorithm === 'bfs') {
      // Breadth First Search: shift from queue
      if(queue.length === 0) break;
      current = queue.shift();
    } else {
      // A* / UCS / Greedy use priority queue
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
      const key = serializeKey(nr, nc);
      
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
        
        if (algorithm === 'dfs') {
          // Add neighbor to DFS stack
          stack.push(nextState);
        } else if (algorithm === 'bfs') {
          // Add neighbor to BFS queue
          queue.push(nextState);
        } else if (algorithm === 'ucs') {
          // Uniform Cost Search: priority by path cost
          pq.enqueue(nextState, newCost);
        } else if (algorithm === 'greedy') {
          // Greedy best-first: priority by heuristic distance to goal
          pq.enqueue(nextState, manhattan(nr, nc, goalR, goalC));
        } else if (algorithm === 'astar') {
          // A* Search: priority by cost + heuristic
          pq.enqueue(nextState, newCost + manhattan(nr, nc, goalR, goalC));
        }
      }
    }
    
    if(nodesExpanded > 5000) break; // Hard limit for safety
  }
  
  return { success: false, history, reason: "No path found." };
};
