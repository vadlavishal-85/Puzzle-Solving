import { Link } from 'react-router-dom';
import { Map, Grid3X3, GraduationCap, Users } from 'lucide-react';

function Home() {
  const modules = [
    {
      title: 'Maze Solver',
      description: 'Build your own maze and watch pathfinding algorithms navigate from start to goal.',
      icon: <Map className="w-8 h-8 mb-4 text-secondary" />,
      path: '/maze',
      color: 'from-secondary/20 to-transparent border-secondary/30',
    },
    {
      title: 'Sudoku Solver',
      description: 'Learn Constraint Satisfaction Problems (CSP) by seeing backtracking in action.',
      icon: <Grid3X3 className="w-8 h-8 mb-4 text-accent" />,
      path: '/sudoku',
      color: 'from-accent/20 to-transparent border-accent/30',
    },
    {
      title: 'Learning Center',
      description: 'Educational content on problem formulation, heuristics, and search algorithms.',
      icon: <GraduationCap className="w-8 h-8 mb-4 text-green-400" />,
      path: '/learn',
      color: 'from-green-400/20 to-transparent border-green-400/30',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="text-center mb-16 mt-8">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
          Puzzle Solver Studio
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          A project exploring State Space Search, Problem Formulation, Heuristic Functions, and Constraint Satisfaction Problems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {modules.map((mod, index) => (
          <Link
            key={index}
            to={mod.path}
            className={`glass-card p-6 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300 bg-gradient-to-b ${mod.color.replace('from-', 'from-slate-50 dark:from-')}`}
          >
            <div className="p-4 bg-slate-100 dark:bg-black/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {mod.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{mod.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">{mod.description}</p>
            <div className="mt-6 flex-grow flex items-end">
              <span className="text-sm font-semibold text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Module →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="glass-card p-8 rounded-2xl border-l-4 border-l-primary flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center">
            <Users className="mr-3 text-primary" /> Meet the Team
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Learn more about the students behind this project.
          </p>
        </div>
        <Link to="/about" className="mt-4 md:mt-0 btn-primary whitespace-nowrap">
          About the Project
        </Link>
      </div>
    </div>
  );
}

export default Home;
