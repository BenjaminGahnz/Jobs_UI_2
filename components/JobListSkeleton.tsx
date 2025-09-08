import React from 'react';
import JobCardSkeleton from './JobCardSkeleton';

const JobListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <JobCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default JobListSkeleton;
