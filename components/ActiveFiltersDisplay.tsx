import React from 'react';
import type { ActiveFilters } from '../types';
import XCircleIcon from './icons/XCircleIcon';

interface ActiveFiltersDisplayProps {
  activeFilters: ActiveFilters;
  onClearFilter: (key: keyof ActiveFilters) => void;
}

const ActiveFiltersDisplay: React.FC<ActiveFiltersDisplayProps> = ({ activeFilters, onClearFilter }) => {
  const filters = Object.entries(activeFilters).filter(([, value]) => value);

  if (filters.length === 0) {
    return null;
  }
  
  const getFilterDisplayName = (key: string) => {
    switch (key) {
      case 'search_query':
        return 'Search';
      case 'location':
        return 'Location';
      case 'company_name':
        return 'Company';
      default:
        return key;
    }
  };

  return (
    <div className="mb-4 p-4 bg-slate-100 rounded-lg border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-600 mb-2">Active Filters:</h4>
        <div className="flex flex-wrap gap-2">
        {filters.map(([key, value]) => (
            <div key={key} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            <span>{getFilterDisplayName(key)}: <span className="font-normal">{value}</span></span>
            <button
                onClick={() => onClearFilter(key as keyof ActiveFilters)}
                className="ml-2 text-blue-600 hover:text-blue-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Remove ${getFilterDisplayName(key)} filter`}
            >
                <XCircleIcon className="w-4 h-4" />
            </button>
            </div>
        ))}
        </div>
    </div>
  );
};

export default ActiveFiltersDisplay;
