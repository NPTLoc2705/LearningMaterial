import React from 'react';

export interface ProgressDotsProps {
  total: number;
  current: number;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({ total, current }) => {
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      {Array.from({ length: total }).map((_, idx) => {
        const isCurrent = idx === current;
        const isPast = idx < current;

        return (
          <div
            key={idx}
            className={`rounded-full transition-all duration-200 ${
              isCurrent
                ? 'w-4 h-4 bg-amber-500 ring-4 ring-amber-200 scale-125'
                : isPast
                ? 'w-3 h-3 bg-emerald-500'
                : 'w-2.5 h-2.5 bg-gray-300'
            }`}
          />
        );
      })}
    </div>
  );
};

