import { GraduationCap, BrainCircuit, Target, Code2, BookOpen } from 'lucide-react';

function LearningCenter() {
  const algorithms = [
    {
      name: 'Breadth First Search (BFS)',
      definition: 'Explores the search tree level by level. It expands all children of a node before moving deeper.',
      advantages: ['Complete', 'Optimal for unweighted graphs (finds shortest path)'],
      disadvantages: ['High Memory Usage (must store all nodes in memory)'],
      formula: 'No specific formula (Queue / FIFO)'
    },
    {
      name: 'Depth First Search (DFS)',
      definition: 'Explores the search tree by diving as deep as possible along each branch before backtracking.',
      advantages: ['Low Memory Usage', 'Simple to implement recursively'],
      disadvantages: ['Not guaranteed optimal', 'Can get stuck in infinite loops without cycle checking'],
      formula: 'No specific formula (Stack / LIFO)'
    },
    {
      name: 'Uniform Cost Search (UCS)',
      definition: 'Expands the node with the lowest path cost g(n) from the start node.',
      advantages: ['Complete', 'Optimal for any step-costs'],
      disadvantages: ['Can be slow if costs are identical (degenerates to BFS)'],
      formula: 'Cost Function: f(n) = g(n)'
    },
    {
      name: 'Greedy Best-First Search',
      definition: 'Expands the node that appears to be closest to the goal, according to a heuristic function.',
      advantages: ['Fast', 'Low Memory Usage relative to BFS'],
      disadvantages: ['Not optimal', 'Incomplete (can get stuck)'],
      formula: 'Cost Function: f(n) = h(n)'
    },
    {
      name: 'A* Search',
      definition: 'Combines UCS and Greedy Search by expanding nodes with the lowest total estimated cost.',
      advantages: ['Complete', 'Optimal (if heuristic is admissible)'],
      disadvantages: ['High Memory usage'],
      formula: 'Cost Function: f(n) = g(n) + h(n)'
    },
    {
      name: 'Backtracking Search',
      definition: 'A depth-first search strategy that assigns values to variables one by one and backtracks when constraints are violated.',
      advantages: ['Simple implementation', 'Will find a solution if one exists in CSPs'],
      disadvantages: ['Slow on very large search spaces without heuristics (like MRV or Forward Checking)'],
      formula: 'Recursive trial and error'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <div className="mb-8 border-b border-white/10 pb-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold flex items-center justify-center text-green-400 mb-4">
          <GraduationCap className="mr-3 w-10 h-10" />
          Learning Center
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Master the Foundations of Algorithms and Artificial Intelligence.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Section 1 */}
        <section className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-primary">
            <BrainCircuit className="mr-3" /> Problem Formulation
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Before an agent can solve a problem, the problem must be formally defined. This process is called <strong>Problem Formulation</strong>. It consists of five key components:
          </p>
          <ul className="space-y-3 text-slate-600 dark:text-slate-400 ml-4 border-l-2 border-slate-300 dark:border-slate-700 pl-4">
            <li><strong>1. Initial State:</strong> The starting configuration of the problem (e.g., the agent's start position in a maze).</li>
            <li><strong>2. Actions:</strong> The set of possible actions available to the agent (e.g., move Up, Down, Left, or Right).</li>
            <li><strong>3. Transition Model:</strong> A description of what each action does, returning the resulting state.</li>
            <li><strong>4. Goal Test:</strong> A function that determines whether a given state is the Goal State.</li>
            <li><strong>5. Path Cost:</strong> A function that assigns a numeric cost to each path (e.g., 1 cost per step).</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-secondary">
            <Target className="mr-3" /> Heuristic Functions
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A heuristic function <code>h(n)</code> estimates the cost of the cheapest path from state <code>n</code> to a goal state. It injects domain knowledge into the search algorithm (like A* or Greedy Search) to make it vastly faster than Blind Searches (BFS/DFS).
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl mt-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Examples in Maze Pathfinding:</h3>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 text-sm">
              <li><strong>Manhattan Distance:</strong> Sum of the vertical and horizontal distances from the current position to the maze exit. (Usually very efficient!)</li>
              <li><strong>Euclidean Distance:</strong> The straight-line distance from the current position to the maze exit.</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-accent">
            <Code2 className="mr-3" /> Constraint Satisfaction Problems (CSP)
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Unlike state space search where the path to the goal matters, in a CSP, the goal itself is the answer. A CSP is defined by Variables, Domains, and Constraints. 
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            In Sudoku, the Variables are the 81 cells, the Domain is the digits 1-9, and the Constraints are that no digit can repeat in a row, column, or 3x3 block. We solve CSPs using <strong>Backtracking Search</strong>.
          </p>
        </section>

        {/* Algorithms Guide Section */}
        <section className="glass-card p-8 border-l-4 border-l-purple-400">
          <h2 className="text-2xl font-bold mb-6 flex items-center text-purple-400">
            <BookOpen className="mr-3" /> Algorithms Reference Guide
          </h2>
          
          <div className="space-y-6">
            {algorithms.map((algo, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-200">{algo.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{algo.definition}</p>
                
                <div className="bg-white dark:bg-black/40 p-3 rounded-lg mb-4 font-mono text-sm text-center text-primary border border-slate-200 dark:border-slate-800">
                  {algo.formula}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-success mb-2">Advantages</h4>
                    <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      {algo.advantages.map((adv, i) => <li key={i}>{adv}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Disadvantages</h4>
                    <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      {algo.disadvantages.map((dis, i) => <li key={i}>{dis}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default LearningCenter;
