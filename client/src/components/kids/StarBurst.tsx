import React from 'react';

export interface StarBurstProps {
  stars: number;
}

export const StarBurst: React.FC<StarBurstProps> = ({ stars }) => {
  const count = Math.max(1, Math.min(3, stars));

  const cheerMessage =
    count === 3 ? 'Super Star! ⭐⭐⭐' : count === 2 ? 'Great Job! ⭐⭐' : 'Good Try! ⭐';

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
      <div className="flex items-center justify-center gap-3">
        {[1, 2, 3].map((starIndex) => {
          const isFilled = starIndex <= count;
          return (
            <div
              key={starIndex}
              className={`transform transition-all duration-300 ${
                isFilled
                  ? 'scale-110 animate-bounce text-amber-400 drop-shadow-md'
                  : 'text-gray-300 opacity-60'
              }`}
              style={{ animationDelay: `${starIndex * 150}ms` }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-16 h-16 sm:w-20 sm:h-20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          );
        })}
      </div>
      <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-wide">
        {cheerMessage}
      </p>
    </div>
  );
};
