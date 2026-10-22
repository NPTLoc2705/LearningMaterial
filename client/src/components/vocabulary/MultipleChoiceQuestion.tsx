import { useState } from 'react';
import type { VocabQuizQuestion } from '../../utils/quizGenerator';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { IconCheck, IconCross, IconArrowRight } from '../ui/Icons';

export interface MultipleChoiceQuestionProps {
  question: VocabQuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export function MultipleChoiceQuestion({
  question,
  onAnswer,
}: MultipleChoiceQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const isAnswered = selectedOption !== null;

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const isCorrect = selectedOption === question.correctAnswer;

  return (
    <Card innerClassName="p-6 sm:p-8 max-w-xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFEFEA]">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E9D97]">
          Trắc nghiệm nghĩa từ
        </span>
        {question.partOfSpeech && (
          <Badge variant="slate" size="sm">
            {question.partOfSpeech}
          </Badge>
        )}
      </div>

      {/* Target Word */}
      <div className="text-center py-4 mb-6">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#141413]">
          {question.prompt}
        </h2>
        {question.exampleSentence && (
          <p className="mt-2 font-serif italic text-xs sm:text-sm text-[#6B6A66]">
            "{question.exampleSentence}"
          </p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2 mb-6">
        {question.options?.map((option, idx) => {
          const isThisOptionSelected = selectedOption === option;
          const isThisOptionCorrect = option === question.correctAnswer;

          let btnStyles = 'bg-white border-[#E8E7E4] text-[#141413] hover:bg-[#FBFBFA] hover:border-[#D5D4CE]';

          if (isAnswered) {
            if (isThisOptionCorrect) {
              btnStyles = 'bg-[#EDF3EC] border-[#DCE8DA] text-[#346538] font-medium';
            } else if (isThisOptionSelected && !isCorrect) {
              btnStyles = 'bg-[#FDEBEC] border-[#FAD4D6] text-[#9F2F2D]';
            } else {
              btnStyles = 'opacity-40 bg-[#FBFBFA] border-[#E8E7E4] text-[#9E9D97]';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelect(option)}
              className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between touch-manipulation ${btnStyles}`}
            >
              <span>{option}</span>
              {isAnswered && isThisOptionCorrect && (
                <IconCheck size={14} className="text-[#346538] flex-shrink-0" />
              )}
              {isAnswered && isThisOptionSelected && !isCorrect && (
                <IconCross size={14} className="text-[#9F2F2D] flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback & Proceed */}
      {isAnswered && (
        <div className="pt-4 border-t border-[#EFEFEA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <span className="text-xs font-mono font-medium text-[#346538] flex items-center gap-1.5">
                <IconCheck size={14} /> Chính xác!
              </span>
            ) : (
              <span className="text-xs font-mono font-medium text-[#9F2F2D] flex items-center gap-1.5">
                <IconCross size={14} /> Đáp án đúng: {question.correctAnswer}
              </span>
            )}
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAnswer(isCorrect)}
            className="gap-2 touch-manipulation self-end sm:self-auto"
          >
            <span>Tiếp tục</span>
            <IconArrowRight size={14} />
          </Button>
        </div>
      )}
    </Card>
  );
}
