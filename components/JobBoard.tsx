import React, { useState, useEffect, useCallback } from 'react';
import type { JobListing, FilterOptions, ActiveFilters } from '../types';
import { fetchJobs, fetchFilters, startScraping } from '../services/jobService';
import useDebounce from '../hooks/useDebounce';
import FilterPanel from './FilterPanel';
import JobList from './JobList';
import JobDetailModal from './JobDetailModal';
import JobListSkeleton from './JobListSkeleton';
import ErrorMessage from './ErrorMessage';
import Pagination from './Pagination';
import FilterIcon from './icons/FilterIcon';
import ActiveFiltersDisplay from './ActiveFiltersDisplay';
import ScraperControl from './ScraperControl';

const getInitialStateFromURL = () => {
  if (typeof window === 'undefined') {
    return { filters: {}, page: 1, showFavorites: false };
  }
  const params = new URLSearchParams(window.location.search);
  const filters: ActiveFilters = {};
  if (params.has('search_query')) filters.search_query = params.get('search_query')!;
  if (params.has('location')) filters.location = params.get('location')!;
  if (params.has('company_name')) filters.company_name = params.get('company_name')!;
  const page = parseInt(params.get('page') || '1', 10);
  const showFavorites = params.get('favorites') === 'true';
  return { filters, page, showFavorites };
};

const JobBoard: React.FC = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    locations: [],
    company_names: [],
    employment_types: [],
  });
  
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    try {
        const item = window.localStorage.getItem('jobFavorites');
        return item ? new Set(JSON.parse(item)) : new Set();
    } catch (error) {
        console.error("Could not read favorites from localStorage", error);
        return new Set();
    }
  });

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(() => getInitialStateFromURL().showFavorites);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(() => getInitialStateFromURL().filters);
  const [searchInputValue, setSearchInputValue] = useState(() => getInitialStateFromURL().filters.search_query || '');
  const debouncedSearchQuery = useDebounce(searchInputValue, 500);

  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(() => getInitialStateFromURL().page);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);

  const [scrapeQuery, setScrapeQuery] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    try {
        window.localStorage.setItem('jobFavorites', JSON.stringify(Array.from(favorites)));
    } catch (error) {
        console.error("Could not save favorites to localStorage", error);
    }
  }, [favorites]);

  useEffect(() => {
    if (debouncedSearchQuery !== (activeFilters.search_query || '')) {
      setActiveFilters(prev => ({ ...prev, search_query: debouncedSearchQuery || undefined }));
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery, activeFilters.search_query]);
  
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeFilters.search_query) params.set('search_query', activeFilters.search_query);
    if (activeFilters.location) params.set('location', activeFilters.location);
    if (activeFilters.company_name) params.set('company_name', activeFilters.company_name);
    if (showFavoritesOnly) params.set('favorites', 'true');
    if (currentPage > 1) params.set('page', currentPage.toString());

    const newSearch = params.toString();
    const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    
    if (newUrl !== `${window.location.pathname}${window.location.search}`) {
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
  }, [activeFilters, currentPage, showFavoritesOnly]);

  useEffect(() => {
    const handlePopState = () => {
      const { filters, page, showFavorites } = getInitialStateFromURL();
      setActiveFilters(filters);
      setCurrentPage(page);
      setShowFavoritesOnly(showFavorites);
      setSearchInputValue(filters.search_query || '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filtersToFetch = { ...activeFilters };
      if (!filtersToFetch.search_query) {
        delete filtersToFetch.search_query;
      }
      
      const favoritesFilter = { showOnly: showFavoritesOnly, favoriteIds: favorites };
      const { jobs: fetchedJobs, totalPages: fetchedTotalPages } = await fetchJobs(filtersToFetch, currentPage, favoritesFilter);
      
      setJobs(fetchedJobs);
      setTotalPages(fetchedTotalPages);
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch job listings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [activeFilters, currentPage, showFavoritesOnly, favorites]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await fetchFilters();
        setFilterOptions(options);
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    };
    loadFilterOptions();
  }, []);

  const handleToggleFavorite = (jobId: number) => {
    setFavorites(prevFavorites => {
        const newFavorites = new Set(prevFavorites);
        if (newFavorites.has(jobId)) {
            newFavorites.delete(jobId);
        } else {
            newFavorites.add(jobId);
        }
        return newFavorites;
    });
  };
  
  const handleFilterChange = <K extends keyof ActiveFilters>(key: K, value: ActiveFilters[K]) => {
    if (key === 'search_query') {
      setSearchInputValue(value || '');
    } else {
      setActiveFilters(prev => ({ ...prev, [key]: value || undefined }));
      setCurrentPage(1);
    }
  };

  const handleClearFilter = (key: keyof ActiveFilters) => {
    if (key === 'search_query') {
      setSearchInputValue('');
    } else {
      setActiveFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      });
    }
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchInputValue('');
    setShowFavoritesOnly(false);
    setCurrentPage(1);
  };
  
  const handleShowFavoritesChange = (value: boolean) => {
      setShowFavoritesOnly(value);
      setCurrentPage(1);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleStartScrape = async () => {
    if (!scrapeQuery.trim()) {
        setScrapeStatus({ type: 'error', message: 'Please enter a search term to start scraping.' });
        return;
    }
    setIsScraping(true);
    setScrapeStatus(null);
    try {
        const result = await startScraping(scrapeQuery);
        setScrapeStatus({ type: 'success', message: result.message });
        setScrapeQuery(''); 
        loadJobs(); 
        fetchFilters().then(setFilterOptions);
    } catch (err) {
        setScrapeStatus({ type: 'error', message: (err as Error).message });
    } finally {
        setIsScraping(false);
    }
  };
  
  const hasActiveFilters = Object.values(activeFilters).some(val => val) || showFavoritesOnly;

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-3">
         <FilterPanel 
            options={filterOptions}
            activeFilters={{...activeFilters, search_query: searchInputValue}}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isOpen={isFilterPanelOpen}
            onClose={() => setIsFilterPanelOpen(false)}
            showFavoritesOnly={showFavoritesOnly}
            onShowFavoritesChange={handleShowFavoritesChange}
        />
      </div>

      <div className="lg:col-span-9 mt-6 lg:mt-0">
        <div className="mb-4 flex justify-end lg:hidden">
            <button
                onClick={() => setIsFilterPanelOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
            >
                <FilterIcon className="w-5 h-5 mr-2" />
                Filters
            </button>
        </div>

        <ScraperControl
          query={scrapeQuery}
          onQueryChange={setScrapeQuery}
          onStart={handleStartScrape}
          isScraping={isScraping}
          status={scrapeStatus}
        />
        
        <ActiveFiltersDisplay activeFilters={activeFilters} onClearFilter={handleClearFilter} />

        {isLoading ? (
          <JobListSkeleton />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            <JobList 
              jobs={jobs} 
              onSelectJob={setSelectedJob} 
              hasActiveFilters={hasActiveFilters}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
            {jobs.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
          </>
        )}
      </div>

      <JobDetailModal 
        job={selectedJob} 
        onClose={() => setSelectedJob(null)}
        isFavorite={selectedJob ? favorites.has(selectedJob.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
};

export default JobBoard;