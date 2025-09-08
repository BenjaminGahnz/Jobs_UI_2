export interface LocationModel {
  city: string;
  country: string;
}

export interface JobListing {
  id: number;
  title: string;
  company: string | null;
  location: LocationModel;
  description: string | null;
  url: string;
  source: string | null;
  date_scraped: string | null;
  salary_range?: string | null;
  employment_type?: string | null;
  experience_level?: string | null;
}

export interface FilterOptions {
  locations: string[];
  company_names: string[];
  employment_types: string[];
}

export interface ActiveFilters {
  location?: string;
  company_name?: string;
  search_query?: string;
}