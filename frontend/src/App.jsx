import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Layout
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import EightPuzzle from './pages/EightPuzzle';
import MazeSolver from './pages/MazeSolver';
import SudokuSolver from './pages/SudokuSolver';
import AlgorithmComparison from './pages/AlgorithmComparison';
import AlgorithmsGuide from './pages/AlgorithmsGuide';
import LearningCenter from './pages/LearningCenter';
import About from './pages/About';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col font-sans">
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/8-puzzle" element={<EightPuzzle />} />
            <Route path="/maze" element={<MazeSolver />} />
            <Route path="/sudoku" element={<SudokuSolver />} />
            <Route path="/comparison" element={<AlgorithmComparison />} />
            <Route path="/guide" element={<AlgorithmsGuide />} />
            <Route path="/learn" element={<LearningCenter />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        
        <footer className="bg-slate-100 dark:bg-card-bg py-6 text-center text-sm opacity-80 mt-auto border-t border-slate-200 dark:border-slate-800">
          <p>© {new Date().getFullYear()} AI Puzzle Solver Studio - Computational Foundations of AI</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
