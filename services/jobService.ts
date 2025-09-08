/// <reference types="vite/client" />

import type { JobListing, FilterOptions, ActiveFilters } from '../types';

// Use Vite's environment variables. VITE_API_BASE_URL will be set in Azure.
// We provide a fallback for local development.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const SCRAPER_BASE_URL = import.meta.env.VITE_SCRAPER_BASE_URL || 'http://localhost:9000';


const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    let errorMessage = `Request failed with status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || JSON.stringify(errorData);
    } catch (e) {
      const textError = await response.text();
      if (textError) {
        errorMessage = textError.substring(0, 500);
      }
    }
    console.error("API Error Response:", errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (e) {
    console.error("Failed to parse successful response as JSON.", e);
    throw new Error("Received an invalid response from the server.");
  }
};

export const fetchJobs = async (filters: ActiveFilters, page: number, favoritesFilter: { showOnly: boolean, favoriteIds: Set<number> }): Promise<{ jobs: JobListing[], totalPages: number }> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', '12');
  if (filters.search_query) params.append('search_query', filters.search_query);
  if (filters.location) params.append('location', filters.location);
  if (filters.company_name) params.append('company_name', filters.company_name);

  let { jobs, totalPages } = await apiFetch(`/jobs?${params.toString()}`);

  if (favoritesFilter.showOnly) {
      jobs = jobs.filter((job: JobListing) => favoritesFilter.favoriteIds.has(job.id));
  }
  return { jobs, totalPages };
};

export const fetchFilters = async (): Promise<FilterOptions> => {
  return apiFetch('/jobs/filters');
};

export const startScraping = async (searchQuery: string): Promise<{ message: string }> => {
  // This component is disabled in the UI, but if you re-enable it,
  // it will point to the correct scraper URL.
  const url = `${SCRAPER_BASE_URL}/scrape`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ search_query: searchQuery }),
  });
  if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Scraping failed');
  }
  return response.json();
};