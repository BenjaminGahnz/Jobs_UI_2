import React from 'react';

const JobCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 w-full h-full">
      <div className="animate-pulse flex flex-col h-full">
        <div>
          <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
        <div className="mt-4 space-y-3 flex-grow">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-slate-200 rounded-full mr-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-slate-200 rounded-full mr-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
          <div className="h-3 bg-slate-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default JobCardSkeleton;
