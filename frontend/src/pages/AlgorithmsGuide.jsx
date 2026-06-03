import { BookOpen } from 'lucide-react';

function AlgorithmsGuide() {
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
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold flex items-center text-purple-400 mb-2">
          <BookOpen className="mr-3 w-8 h-8" />
          Algorithms Guide
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          A comprehensive reference guide for all AI Search Algorithms utilized in this studio.
        </p>
      </div>

      <div className="space-y-6">
        {algorithms.map((algo, idx) => (
          <div key={idx} className="glass-card p-6 border-l-4 border-l-purple-400">
            <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-200">{algo.name}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{algo.definition}</p>
            
            <div className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-lg mb-4 font-mono text-sm text-center text-primary border border-slate-200 dark:border-slate-800">
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
    </div>
  );
}

export default AlgorithmsGuide;
