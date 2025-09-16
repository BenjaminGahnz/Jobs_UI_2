import type { JobListing, FilterOptions, ActiveFilters } from '../types';

import { mockJobs } from '../mockJobs';


/*
/// <reference types="vite/client" />
const configPromise = (async () => {
  // ... original config code
})();
async function getApiBaseUrl(): Promise<string> {
  // ... original function
}
async function getScraperBaseUrl(): Promise<string> {
  // ... original function
}
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  // ... original function
};
*/

// A small helper function to simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchJobs = async (
  filters: ActiveFilters,
  page: number,
  favoritesFilter: { showOnly: boolean, favoriteIds: Set<number> }
): Promise<{ jobs: JobListing[], totalPages: number }> => {
  
  // Simulate network delay to see loading spinners
  await sleep(500); 

  console.log('Fetching MOCK jobs with filters:', filters, `Page: ${page}`);

  let jobsToFilter = [...mockJobs];

 
  if (favoritesFilter.showOnly) {
    jobsToFilter = jobsToFilter.filter(job => favoritesFilter.favoriteIds.has(job.id));
  }


  if (filters.search_query) {
    const query = filters.search_query.toLowerCase();
    jobsToFilter = jobsToFilter.filter(job => 
      job.title.toLowerCase().includes(query) || 
      (job.description && job.description.toLowerCase().includes(query))
    );
  }
  if (filters.location) {
    const query = filters.location.toLowerCase();
    jobsToFilter = jobsToFilter.filter(job => 
        (job.location.city && job.location.city.toLowerCase().includes(query)) ||
        (job.location.country && job.location.country.toLowerCase().includes(query))
    );
  }
  if (filters.company_name) {
    const query = filters.company_name.toLowerCase();
    jobsToFilter = jobsToFilter.filter(job => 
      job.company && job.company.toLowerCase().includes(query)
    );
  }


  const limit = 12;
  const totalPages = Math.ceil(jobsToFilter.length / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedJobs = jobsToFilter.slice(startIndex, endIndex);

  return { jobs: paginatedJobs, totalPages };
};

export const fetchFilters = async (): Promise<FilterOptions> => {
  await sleep(200); // Simulate short delay

  
  const locations = new Set<string>();
  const company_names = new Set<string>();

  mockJobs.forEach(job => {
    if (job.location?.city) locations.add(job.location.city);
    if (job.company) company_names.add(job.company);
  });
  
  return {
    locations: Array.from(locations).sort(),
    company_names: Array.from(company_names).sort(),
    employment_types: ['Full-time', 'Part-time', 'Contract'], // Hardcoded for example
  };
};

export const startScraping = async (searchQuery: string): Promise<{ message: string }> => {
  await sleep(1500); // Simulate longer delay for scraping
  console.log(`MOCK scraping for: "${searchQuery}"`);
  
  // Always return a success message
  return { message: `Successfully completed mock scrape for "${searchQuery}".` };
};