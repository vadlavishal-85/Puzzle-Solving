import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function AlgorithmComparison() {
  const data = [
    { name: 'BFS', runtime: 120, nodes: 45000, depth: 15 },
    { name: 'DFS', runtime: 5, nodes: 200, depth: 85 },
    { name: 'UCS', runtime: 130, nodes: 45000, depth: 15 },
    { name: 'A* (Manhattan)', runtime: 15, nodes: 1500, depth: 15 },
    { name: 'Greedy', runtime: 2, nodes: 150, depth: 40 },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center text-blue-400 mb-2">
          Algorithm Comparison Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
          Observe how different Search Algorithms perform conceptually when solving equivalent complexity tasks in State Space Search.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Nodes Expanded */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-6 text-center">Nodes Expanded (Memory & Time cost)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{backgroundColor: '#1A1D29', borderColor: '#4ECDC4'}} />
                <Legend />
                <Bar dataKey="nodes" fill="#FF6B6B" name="Nodes Expanded" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-slate-500 mt-4 text-center">
            Notice how BFS/UCS expands significantly more nodes than A*, making them computationally expensive.
          </p>
        </div>

        {/* Chart 2: Solution Depth */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-6 text-center">Solution Path Length (Optimality)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{backgroundColor: '#1A1D29', borderColor: '#4ECDC4'}} />
                <Legend />
                <Bar dataKey="depth" fill="#4ECDC4" name="Solution Depth" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-slate-500 mt-4 text-center">
            BFS, UCS, and A* are optimal (shortest path). DFS and Greedy are sub-optimal and might return very long, winding paths.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AlgorithmComparison;
