import React, { useEffect, useRef } from 'react';
import type { JobListing } from '../types';
import CloseIcon from './icons/CloseIcon';
import LocationIcon from './icons/LocationIcon';
import CalendarIcon from './icons/CalendarIcon';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import StarIcon from './icons/StarIcon';

interface JobDetailModalProps {
  job: JobListing | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (jobId: number) => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose, isFavorite, onToggleFavorite }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (job) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0];
      firstElement?.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
        if (event.key === 'Tab' && focusableElements) {
          const lastElement = focusableElements[focusableElements.length - 1];
          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              event.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              event.preventDefault();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        previousFocusRef.current?.focus();
      };
    }
  }, [job, onClose]);

  if (!job) return null;

  const formatLocation = (location: { city: string; country: string }) => {
    if (!location) return null;
    if (location.city && location.country) {
      return `${location.city}, ${location.country}`;
    }
    return location.city || location.country || null;
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(job!.id);
  };

  const locationString = formatLocation(job.location);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 id="job-title" className="text-2xl font-bold text-slate-900">{job.title}</h2>
              <p className="text-slate-600 font-medium text-lg">{job.company}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-yellow-500' : 'text-slate-400'} hover:bg-slate-100`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <StarIcon isFavorite={isFavorite} className="w-6 h-6" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                aria-label="Close job details"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
             {locationString && <div className="flex items-center"><LocationIcon className="w-4 h-4 mr-1.5" /> {locationString}</div>}
             {job.date_scraped && <div className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1.5" /> Posted on {new Date(job.date_scraped).toLocaleDateString()}</div>}
             {job.source && <div className="flex items-center">Source: <span className="font-medium ml-1">{job.source}</span></div>}
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="prose max-w-none text-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Job Description</h3>
            <p className="whitespace-pre-line">{job.description || 'No description available.'}</p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-lg mt-auto">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">How to Apply</h3>
          <div className="space-y-3">
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full text-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply Now
                <ExternalLinkIcon className="w-5 h-5 ml-2" />
              </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;