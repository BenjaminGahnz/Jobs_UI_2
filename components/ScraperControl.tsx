import React from 'react';
import SearchIcon from './icons/SearchIcon';

interface ScraperControlProps {
  query: string;
  onQueryChange: (value: string) => void;
  onStart: () => void;
  isScraping: boolean;
  status: { type: 'success' | 'error'; message: string } | null;
}

const ScraperControl: React.FC<ScraperControlProps> = ({
  query,
  onQueryChange,
  onStart,
  isScraping,
  status,
}) => {
  // Always show the disabled error
  const disabledStatus = { type: 'error' as const, message: "The scraper is disabled to conserve resources on this server." };

  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-lg font-bold text-slate-800 mb-3">Search for New Job Postings</h2>
      <p className="text-sm text-slate-500 mb-4">
        Enter a query to start a new search. This will scrape for new jobs and add them to the database.
      </p>
      <form className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="e.g., Python Developer in Berlin"
          className="flex-grow w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-slate-50"
          disabled
          aria-label="Search query for new postings"
        />
        <button
          type="button"
          className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-300 cursor-not-allowed transition"
          disabled
        >
          <SearchIcon className="w-5 h-5 mr-2 -ml-1" />
          Start Search
        </button>
      </form>
      <div
        className="mt-4 p-3 rounded-md text-sm bg-red-50 text-red-800 border border-red-200"
      >
        {disabledStatus.message}
      </div>
    </div>
  );
};

export default ScraperControl;
