import React from 'react';
import { SignedMediaImage } from '../common/SignedMediaImage';

export interface BigChoiceProps {
  choiceKey: string;
  text?: string | null;
  imageKey?: string | null;
  disabled?: boolean;
  isSelected?: boolean;
  isCorrect?: boolean | null;
  onClick: (key: string) => void;
}

export const BigChoice: React.FC<BigChoiceProps> = ({
  choiceKey,
  text,
  imageKey,
  disabled = false,
  isSelected = false,
  isCorrect = null,
  onClick,
}) => {
  let borderClass = 'border-4 border-amber-200 bg-amber-50 hover:bg-amber-100 active:scale-95';

  if (isSelected) {
    if (isCorrect === true) {
      borderClass = 'border-4 border-emerald-500 bg-emerald-50 shadow-lg scale-102';
    } else if (isCorrect === false) {
      borderClass = 'border-4 border-orange-400 bg-orange-50';
    } else {
      borderClass = 'border-4 border-blue-500 bg-blue-50';
    }
  }

  return (
    <button
      type="button"
      onClick={() => onClick(choiceKey)}
      disabled={disabled}
      className={`min-h-[72px] min-w-[72px] w-full p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 select-none shadow-sm ${borderClass} disabled:opacity-75 disabled:cursor-not-allowed`}
      style={{ touchAction: 'manipulation' }}
    >
      {imageKey ? (
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center overflow-hidden rounded-xl bg-white mb-1 shadow-inner">
          <SignedMediaImage
            imageKey={imageKey}
            alt={text || 'Option'}
            className="w-full h-full object-cover"
          />
        </div>
      ) : null}
      {text ? (
        <span className="text-xl sm:text-2xl font-bold text-gray-800 tracking-wide">
          {text}
        </span>
      ) : null}
    </button>
  );
};
