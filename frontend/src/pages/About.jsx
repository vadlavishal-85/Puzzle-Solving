import { Users, Code, Heart } from 'lucide-react';

function About() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-12 text-center">
      <div className="mb-12 mt-8">
        <h1 className="text-4xl font-bold flex items-center justify-center text-primary mb-4">
          <Heart className="mr-3 text-primary" /> About This Project
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          This platform was built as a comprehensive final project for a university-level <strong>Computational Foundations of AI</strong> course.
        </p>
      </div>

      <div className="glass-card p-8 text-left mb-8 border-t-4 border-t-secondary">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center">
          <Users className="mr-3 text-secondary" /> Team Members
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Developed collaboratively by passionate Computer Science students focusing on Artificial Intelligence.
        </p>
        
        <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <ul className="space-y-3">
            <li className="flex items-center text-slate-700 dark:text-slate-300">
              <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold mr-4">1</span>
              Student Name - Vadla Vishal
            </li>
            <li className="flex items-center text-slate-700 dark:text-slate-300">
              <span className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold mr-4">2</span>
              Student Name - Krishna Biradar
            </li>
            
          </ul>
        </div>
      </div>

      <div className="glass-card p-8 text-left">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center">
          <Code className="mr-3 text-slate-800 dark:text-slate-100" /> Technology Stack
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-full text-sm font-semibold">React.js</span>
          <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-full text-sm font-semibold">Tailwind CSS v4</span>
          <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-full text-sm font-semibold">JavaScript (ES6+)</span>
          
        </div>
      </div>
    </div>
  );
}

export default About;
