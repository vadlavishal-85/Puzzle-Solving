import { getNeighbors, isGoal, manhattanDistance, misplacedTiles } from '../utils/puzzleUtils';

class Node {
  constructor(state, parent = null, action = null, pathCost = 0, depth = 0) {
    this.state = state;
    this.parent = parent;
    this.action = action; // Just the state to transition to
    this.pathCost = pathCost;
    this.depth = depth;
  }
}

// Convert state array to string for easy set storage
const stateToString = (state) => state.join(',');

const buildPath = (node) => {
  const path = [];
  let curr = node;
  while (curr !== null) {
    path.unshift(curr.state);
    curr = curr.parent;
  }
  return path;
};

// Priority Queue implementation for UCS, Greedy, A*
class PriorityQueue {
  constructor() {
    this.items = [];
  }
  enqueue(element, priority) {
    const qElement = { element, priority };
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > qElement.priority) {
        this.items.splice(i, 0, qElement);
        added = true;
        break;
      }
    }
    if (!added) this.items.push(qElement);
  }
  dequeue() { return this.items.shift(); }
  isEmpty() { return this.items.length === 0; }
}

export const solveBFS = (initialState, goalState) => {
  let nodesExpanded = 0;
  const startTime = performance.now();
  
  const frontier = [new Node(initialState)];
  const explored = new Set();
  explored.add(stateToString(initialState));

  while (frontier.length > 0) {
    const node = frontier.shift(); // Dequeue
    nodesExpanded++;

    if (isGoal(node.state, goalState)) {
      const time = performance.now() - startTime;
      return { path: buildPath(node), nodesExpanded, depth: node.depth, time, success: true };
    }

    const neighbors = getNeighbors(node.state);
    for (const neighbor of neighbors) {
      const neighborStr = stateToString(neighbor);
      if (!explored.has(neighborStr)) {
        explored.add(neighborStr);
        frontier.push(new Node(neighbor, node, neighbor, node.pathCost + 1, node.depth + 1));
      }
    }
    
    // Safety check to prevent infinite loops in browser
    if (nodesExpanded > 50000) return { success: false, reason: "Expanded too many nodes (Time Limit)" };
  }
  return { success: false, reason: "No solution found" };
};

export const solveDFS = (initialState, goalState) => {
  let nodesExpanded = 0;
  const startTime = performance.now();
  
  const frontier = [new Node(initialState)];
  const explored = new Set();
  explored.add(stateToString(initialState)); // Prevent immediate cycling

  while (frontier.length > 0) {
    const node = frontier.pop(); // Stack Pop
    nodesExpanded++;
    
    // In strict DFS, explored is marked upon expansion, not generation, but for 8-puzzle graphs marking on generation/expansion both need cycle checking.
    // We mark on expansion to allow deeper paths if reached differently, but we must prevent infinite loops.
    explored.add(stateToString(node.state));

    if (isGoal(node.state, goalState)) {
      const time = performance.now() - startTime;
      return { path: buildPath(node), nodesExpanded, depth: node.depth, time, success: true };
    }

    const neighbors = getNeighbors(node.state);
    // Reverse neighbors to explore in a consistent order
    for (const neighbor of neighbors.reverse()) {
      const neighborStr = stateToString(neighbor);
      // To prevent infinite loops in DFS, check if it's in the current path
      let inPath = false;
      let curr = node;
      while (curr) {
        if (stateToString(curr.state) === neighborStr) {
          inPath = true;
          break;
        }
        curr = curr.parent;
      }
      
      if (!inPath && !explored.has(neighborStr)) {
        frontier.push(new Node(neighbor, node, neighbor, node.pathCost + 1, node.depth + 1));
      }
    }
    
    if (nodesExpanded > 100000) return { success: false, reason: "Expanded too many nodes (Time Limit)" };
  }
  return { success: false, reason: "No solution found" };
};

export const solveUCS = (initialState, goalState) => {
  let nodesExpanded = 0;
  const startTime = performance.now();
  
  const pq = new PriorityQueue();
  pq.enqueue(new Node(initialState), 0);
  
  const explored = new Set();

  while (!pq.isEmpty()) {
    const { element: node } = pq.dequeue();
    const stateStr = stateToString(node.state);

    if (explored.has(stateStr)) continue;
    explored.add(stateStr);
    nodesExpanded++;

    if (isGoal(node.state, goalState)) {
      const time = performance.now() - startTime;
      return { path: buildPath(node), nodesExpanded, depth: node.depth, time, success: true };
    }

    const neighbors = getNeighbors(node.state);
    for (const neighbor of neighbors) {
      if (!explored.has(stateToString(neighbor))) {
        pq.enqueue(new Node(neighbor, node, neighbor, node.pathCost + 1, node.depth + 1), node.pathCost + 1);
      }
    }
    if (nodesExpanded > 50000) return { success: false, reason: "Time Limit Exceeded" };
  }
  return { success: false, reason: "No solution found" };
};

export const solveAStar = (initialState, goalState, heuristicType = 'manhattan') => {
  let nodesExpanded = 0;
  const startTime = performance.now();
  
  const pq = new PriorityQueue();
  const heuristic = heuristicType === 'manhattan' ? manhattanDistance : misplacedTiles;
  
  const startNode = new Node(initialState);
  pq.enqueue(startNode, heuristic(initialState, goalState));
  
  const explored = new Map(); // Store state and best cost (g)
  explored.set(stateToString(initialState), 0);

  while (!pq.isEmpty()) {
    const { element: node } = pq.dequeue();
    const stateStr = stateToString(node.state);
    nodesExpanded++;

    if (isGoal(node.state, goalState)) {
      const time = performance.now() - startTime;
      return { path: buildPath(node), nodesExpanded, depth: node.depth, time, success: true };
    }

    const neighbors = getNeighbors(node.state);
    for (const neighbor of neighbors) {
      const nStr = stateToString(neighbor);
      const newCost = node.pathCost + 1;
      
      if (!explored.has(nStr) || newCost < explored.get(nStr)) {
        explored.set(nStr, newCost);
        const fCost = newCost + heuristic(neighbor, goalState);
        pq.enqueue(new Node(neighbor, node, neighbor, newCost, node.depth + 1), fCost);
      }
    }
    if (nodesExpanded > 50000) return { success: false, reason: "Time Limit Exceeded" };
  }
  return { success: false, reason: "No solution found" };
};

export const solveGreedy = (initialState, goalState, heuristicType = 'manhattan') => {
  let nodesExpanded = 0;
  const startTime = performance.now();
  
  const pq = new PriorityQueue();
  const heuristic = heuristicType === 'manhattan' ? manhattanDistance : misplacedTiles;
  
  const startNode = new Node(initialState);
  pq.enqueue(startNode, heuristic(initialState, goalState));
  
  const explored = new Set();
  
  while (!pq.isEmpty()) {
    const { element: node } = pq.dequeue();
    const stateStr = stateToString(node.state);

    if (explored.has(stateStr)) continue;
    explored.add(stateStr);
    nodesExpanded++;

    if (isGoal(node.state, goalState)) {
      const time = performance.now() - startTime;
      return { path: buildPath(node), nodesExpanded, depth: node.depth, time, success: true };
    }

    const neighbors = getNeighbors(node.state);
    for (const neighbor of neighbors) {
      if (!explored.has(stateToString(neighbor))) {
        const hCost = heuristic(neighbor, goalState); // Only consider heuristic
        pq.enqueue(new Node(neighbor, node, neighbor, node.pathCost + 1, node.depth + 1), hCost);
      }
    }
    if (nodesExpanded > 50000) return { success: false, reason: "Time Limit Exceeded" };
  }
  return { success: false, reason: "No solution found" };
};

const dls = (node, goalState, limit, explored, meta) => {
  meta.nodesExpanded++;
  if (isGoal(node.state, goalState)) return node;
  if (limit <= 0) return 'cutoff';
  
  let cutoff_occurred = false;
  const neighbors = getNeighbors(node.state);
  
  for (const neighbor of neighbors) {
    const nStr = stateToString(neighbor);
    
    // Prevent immediate cycles in current path
    let inPath = false;
    let curr = node;
    while(curr) {
      if(stateToString(curr.state) === nStr) {
        inPath = true; break;
      }
      curr = curr.parent;
    }
    
    if(!inPath) {
      const result = dls(new Node(neighbor, node, neighbor, node.pathCost + 1, node.depth + 1), goalState, limit - 1, explored, meta);
      if (result === 'cutoff') cutoff_occurred = true;
      else if (result !== null) return result;
    }
  }
  return cutoff_occurred ? 'cutoff' : null;
};

export const solveIDDFS = (initialState, goalState) => {
  const startTime = performance.now();
  let meta = { nodesExpanded: 0 };
  
  for (let depth = 0; depth < 31; depth++) { // Max depth for 8-puzzle is 31
    const result = dls(new Node(initialState), goalState, depth, new Set(), meta);
    if (result !== 'cutoff' && result !== null) {
       const time = performance.now() - startTime;
       return { path: buildPath(result), nodesExpanded: meta.nodesExpanded, depth: result.depth, time, success: true };
    }
    if (meta.nodesExpanded > 200000) break; // Hard limit
  }
  return { success: false, reason: "No solution found or limit reached" };
};
