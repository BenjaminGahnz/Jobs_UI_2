import React from 'react';
import type { FilterOptions, ActiveFilters } from '../types';
import ChevronDownIcon from './icons/ChevronDownIcon';
import CloseIcon from './icons/CloseIcon';

interface FilterPanelProps {
  options: FilterOptions;
  activeFilters: ActiveFilters;
  onFilterChange: <K extends keyof ActiveFilters>(key: K, value: ActiveFilters[K]) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
  showFavoritesOnly: boolean;
  onShowFavoritesChange: (value: boolean) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  options,
  activeFilters,
  onFilterChange,
  onClearFilters,
  isOpen,
  onClose,
  showFavoritesOnly,
  onShowFavoritesChange,
}) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange(name as keyof ActiveFilters, value);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('search_query', e.target.value);
  }

  return (
    <>
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
        <aside className={`fixed top-0 left-0 h-full bg-white shadow-xl z-40 w-full max-w-sm p-6 transform transition-transform lg:transform-none lg:relative lg:max-w-xs lg:w-full lg:p-0 lg:shadow-none lg:bg-transparent ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-6 lg:hidden">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100">
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="search_query" className="block text-sm font-medium text-slate-700 mb-1">
              Search
            </label>
            <input
              type="text"
              name="search_query"
              id="search_query"
              value={activeFilters.search_query || ''}
              onChange={handleInputChange}
              placeholder="Job title, company..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="relative">
            <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <select
              id="location"
              name="location"
              value={activeFilters.location || ''}
              onChange={handleSelectChange}
              className="appearance-none w-full bg-white border border-slate-300 text-slate-700 py-2 pl-3 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Locations</option>
              {options.locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            <ChevronDownIcon className="w-5 h-5 text-slate-400 absolute right-3 top-9 pointer-events-none" />
          </div>

          <div className="relative">
            <label htmlFor="company_name" className="block text-sm font-medium text-slate-700 mb-1">Company</label>
            <select
              id="company_name"
              name="company_name"
              value={activeFilters.company_name || ''}
              onChange={handleSelectChange}
              className="appearance-none w-full bg-white border border-slate-300 text-slate-700 py-2 pl-3 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Companies</option>
              {options.company_names.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
             <ChevronDownIcon className="w-5 h-5 text-slate-400 absolute right-3 top-9 pointer-events-none" />
          </div>

          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between">
                <label htmlFor="favorites-only" className="text-sm font-medium text-slate-700">
                    Show Favorites Only
                </label>
                <button
                    type="button"
                    className={`${
                    showFavoritesOnly ? 'bg-blue-600' : 'bg-slate-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    role="switch"
                    aria-checked={showFavoritesOnly}
                    onClick={() => onShowFavoritesChange(!showFavoritesOnly)}
                    id="favorites-only"
                >
                    <span
                    className={`${
                        showFavoritesOnly ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                </button>
            </div>
          </div>


          <button
            onClick={onClearFilters}
            className="w-full text-center py-2 px-4 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            Clear All Filters
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterPanel;