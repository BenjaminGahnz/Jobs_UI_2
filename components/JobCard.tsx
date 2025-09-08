import React from 'react';
import type { JobListing } from '../types';
import LocationIcon from './icons/LocationIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import CalendarIcon from './icons/CalendarIcon';
import StarIcon from './icons/StarIcon';

interface JobCardProps {
  job: JobListing;
  onSelect: (job: JobListing) => void;
  isFavorite: boolean;
  onToggleFavorite: (jobId: number) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onSelect, isFavorite, onToggleFavorite }) => {
  const timeSince = (date: string | null) => {
    if (!date) return 'N/A';
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const formatLocation = (location: { city: string; country: string }) => {
    if (!location) return null;
    if (location.city && location.country) {
      return `${location.city}, ${location.country}`;
    }
    return location.city || location.country || null;
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the modal from opening when favoriting
    onToggleFavorite(job.id);
  }

  const locationString = formatLocation(job.location);

  return (
    <div className="relative">
      <button
        type="button"
        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-slate-200 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-left w-full h-full"
        onClick={() => onSelect(job)}
      >
        <div className="flex flex-col h-full">
          <div>
              <h3 className="text-lg font-bold text-slate-900 pr-10">{job.title}</h3>
              <p className="text-slate-600 font-medium">{job.company}</p>
          </div>
          
          <div className="mt-4 space-y-2 text-sm text-slate-500 flex-grow">
              {locationString && (
                  <div className="flex items-center">
                  <LocationIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{locationString}</span>
                  </div>
              )}
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{timeSince(job.date_scraped)}</span>
              </div>
          </div>

          {job.source && (
               <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                  <span className="text-xs text-slate-400">Source: {job.source}</span>
              </div>
          )}
        </div>
      </button>
       <button
        onClick={handleFavoriteClick}
        className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isFavorite ? 'text-yellow-500' : 'text-slate-400'} hover:bg-slate-100`}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <StarIcon isFavorite={isFavorite} className="w-6 h-6" />
      </button>
    </div>
  );
};

export default JobCard;