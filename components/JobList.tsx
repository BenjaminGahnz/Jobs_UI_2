import React from 'react';
import type { JobListing } from '../types';
import JobCard from './JobCard';

interface JobListProps {
  jobs: JobListing[];
  onSelectJob: (job: JobListing) => void;
  hasActiveFilters: boolean;
  favorites: Set<number>;
  onToggleFavorite: (jobId: number) => void;
}

const JobList: React.FC<JobListProps> = ({ jobs, onSelectJob, hasActiveFilters, favorites, onToggleFavorite }) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-700">
            {hasActiveFilters ? "No Jobs Match Your Filters" : "No Jobs Found"}
        </h3>
        <p className="text-slate-500 mt-2">
            {hasActiveFilters ? "Try adjusting or clearing your filters to see more results." : "Please check back later or try a different search."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard 
          key={job.id} 
          job={job} 
          onSelect={onSelectJob}
          isFavorite={favorites.has(job.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default JobList;