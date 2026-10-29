import React from 'react';
import { SpeakerButton } from './SpeakerButton';

export interface GentleFeedbackProps {
  isCorrect: boolean;
  correctAnswer?: string | null;
  explanation?: string | null;
  speakText?: string | null;
  onNext: () => void;
}

export const GentleFeedback: React.FC<GentleFeedbackProps> = ({
  isCorrect,
  correctAnswer,
  explanation,
  speakText,
  onNext,
}) => {
  const speechTarget = speakText || correctAnswer || '';

  return (
    <div
      className={`w-full p-4 rounded-2xl flex flex-col items-center justify-between gap-4 transition-all duration-200 border-4 ${
        isCorrect
          ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
          : 'bg-amber-50 border-amber-300 text-amber-900'
      }`}
    >
      <div className="flex items-center gap-3 w-full justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{isCorrect ? '🌟' : '💪'}</span>
          <div>
            <h4 className="text-xl font-extrabold tracking-wide">
              {isCorrect ? 'Awesome!' : 'Good try!'}
            </h4>
            {!isCorrect && correctAnswer && (
              <p className="text-sm font-semibold text-gray-700 mt-0.5">
                Đáp án đúng: <span className="text-emerald-700 font-bold">{correctAnswer}</span>
              </p>
            )}
            {explanation && (
              <p className="text-xs text-gray-600 mt-0.5">{explanation}</p>
            )}
          </div>
        </div>

        {speechTarget && (
          <SpeakerButton text={speechTarget} size="md" autoPlay={!isCorrect} />
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full min-h-[56px] py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xl rounded-xl shadow-md hover:brightness-105 active:scale-98 transition tracking-wider flex items-center justify-center gap-2"
        style={{ touchAction: 'manipulation' }}
      >
        <span>Tiếp tục</span>
        <span>➜</span>
      </button>
    </div>
  );
};

