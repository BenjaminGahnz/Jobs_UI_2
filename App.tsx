
import React from 'react';
import JobBoard from './components/JobBoard';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans">
      <header className="bg-white shadow-sm z-10 flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Job Board
          </h1>
          <p className="text-slate-500 mt-1">This is an showcase of the frontend</p>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        <JobBoard />
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm flex-shrink-0">
        <p>&copy; by Benjamin Gahnz</p>
      </footer>
    </div>
  );
};

export default App;
