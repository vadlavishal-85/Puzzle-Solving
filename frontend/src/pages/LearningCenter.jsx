import { GraduationCap, BrainCircuit, Target, Code2 } from 'lucide-react';

function LearningCenter() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <div className="mb-8 border-b border-white/10 pb-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold flex items-center justify-center text-green-400 mb-4">
          <GraduationCap className="mr-3 w-10 h-10" />
          Learning Center
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Master the Computational Foundations of Artificial Intelligence.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Section 1 */}
        <section className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-primary">
            <BrainCircuit className="mr-3" /> Problem Formulation
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Before an AI agent can solve a problem, the problem must be formally defined. This process is called <strong>Problem Formulation</strong>. It consists of five key components:
          </p>
          <ul className="space-y-3 text-slate-600 dark:text-slate-400 ml-4 border-l-2 border-slate-300 dark:border-slate-700 pl-4">
            <li><strong>1. Initial State:</strong> The starting configuration of the problem (e.g., the shuffled 8-puzzle board).</li>
            <li><strong>2. Actions:</strong> The set of possible actions available to the agent (e.g., slide tile Left, Right, Up, Down).</li>
            <li><strong>3. Transition Model:</strong> A description of what each action does, returning the resulting state.</li>
            <li><strong>4. Goal Test:</strong> A function that determines whether a given state is the Goal State.</li>
            <li><strong>5. Path Cost:</strong> A function that assigns a numeric cost to each path (e.g., 1 cost per move).</li>
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
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Examples in 8-Puzzle:</h3>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2 text-sm">
              <li><strong>Misplaced Tiles:</strong> Counts the number of tiles that are not in their goal position.</li>
              <li><strong>Manhattan Distance:</strong> Sum of the vertical and horizontal distances of all tiles from their current positions to their goal positions. (Usually much more efficient!)</li>
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

      </div>
    </div>
  );
}

export default LearningCenter;
