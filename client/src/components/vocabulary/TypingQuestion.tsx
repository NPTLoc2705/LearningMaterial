import { useState } from 'react';
import type { VocabQuizQuestion } from '../../utils/quizGenerator';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { IconCheck, IconCross, IconArrowRight } from '../ui/Icons';

export interface TypingQuestionProps {
  question: VocabQuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

export function TypingQuestion({ question, onAnswer }: TypingQuestionProps) {
  const [inputVal, setInputVal] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const cleanAnswer = question.correctAnswer.trim().toLowerCase();
  const cleanInput = inputVal.trim().toLowerCase();
  const isCorrect = cleanInput === cleanAnswer;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isSubmitted) return;
    setIsSubmitted(true);
  };

  return (
    <Card innerClassName="p-6 sm:p-8 max-w-xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFEFEA]">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E9D97]">
          Luyện gõ chính tả
        </span>
        {question.partOfSpeech && (
          <Badge variant="slate" size="sm">
            {question.partOfSpeech}
          </Badge>
        )}
      </div>

      <div className="text-center py-4 mb-6 space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D97]">
          Nghĩa tiếng Việt
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141413]">
          {question.prompt}
        </h2>
        {question.exampleSentence && (
          <p className="mt-2 font-serif italic text-xs sm:text-sm text-[#6B6A66] bg-[#FBFBFA] p-3 rounded-lg border border-[#E8E7E4]">
            "{question.exampleSentence}"
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label htmlFor="vocab-typing-input" className="block font-mono text-[11px] uppercase text-[#6B6A66] mb-1.5">
            Nhập từ tiếng Anh tương ứng:
          </label>
          <Input
            id="vocab-typing-input"
            autoFocus
            disabled={isSubmitted}
            placeholder="Gõ từ tiếng Anh..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className={
              isSubmitted
                ? isCorrect
                  ? 'border-[#DCE8DA] bg-[#EDF3EC] text-[#346538] font-medium'
                  : 'border-[#FAD4D6] bg-[#FDEBEC] text-[#9F2F2D] font-medium'
                : ''
            }
          />
        </div>

        {!isSubmitted && (
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={!inputVal.trim()}
            className="touch-manipulation"
          >
            Kiểm tra đáp án
          </Button>
        )}
      </form>

      {isSubmitted && (
        <div className="pt-4 border-t border-[#EFEFEA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            {isCorrect ? (
              <span className="text-xs font-mono font-medium text-[#346538] flex items-center gap-1.5">
                <IconCheck size={14} /> Chính xác!
              </span>
            ) : (
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-medium text-[#9F2F2D] flex items-center gap-1.5">
                  <IconCross size={14} /> Chưa chính xác
                </span>
                <p className="text-xs text-[#6B6A66]">
                  Đáp án đúng: <span className="font-serif font-bold text-[#141413]">{question.correctAnswer}</span>
                </p>
              </div>
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
