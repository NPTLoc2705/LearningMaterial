import { useState } from 'react';
import type { GrammarPracticeItem } from '../../types/grammar';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { IconCheck, IconCross, IconRefresh, IconAward } from '../ui/Icons';

export interface TopicPracticeDrillProps {
  exercises: GrammarPracticeItem[];
  onCompleteDrill: (score: number, total: number) => void;
}

export function TopicPracticeDrill({
  exercises,
  onCompleteDrill,
}: TopicPracticeDrillProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});

  if (!exercises || exercises.length === 0) {
    return (
      <div className="p-8 text-center bg-[#F6F5F2] rounded-xl border border-[#E8E7E4]">
        <p className="font-serif italic text-sm text-[#6B6A66]">
          Chủ điểm này là tài liệu tham khảo và ghi chú lý thuyết, không có bài tập vận dụng trong tài liệu gốc.
        </p>
      </div>
    );
  }

  const checkAllCompleted = (
    submittedMap: Record<string, boolean>,
    answerMap: Record<string, string>
  ) => {
    const isAllDone = exercises.every((ex) => submittedMap[ex.id]);
    if (isAllDone) {
      let score = 0;
      exercises.forEach((ex) => {
        const userAns = (answerMap[ex.id] || '').trim().toLowerCase();
        const correctAns = ex.correctAnswer.trim().toLowerCase();
        if (userAns === correctAns) score++;
      });
      onCompleteDrill(score, exercises.length);
      if (score === exercises.length) {
        import('canvas-confetti')
          .then(({ default: confetti }) => {
            confetti({ particleCount: 50, spread: 45, origin: { y: 0.7 } });
          })
          .catch(() => {
            // ignore
          });
      }
    }
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (submittedQuestions[questionId]) return;
    const nextAnswers = { ...answers, [questionId]: option };
    const nextSubmitted = { ...submittedQuestions, [questionId]: true };
    setAnswers(nextAnswers);
    setSubmittedQuestions(nextSubmitted);
    checkAllCompleted(nextSubmitted, nextAnswers);
  };

  const handleFillSubmit = (questionId: string, e: React.FormEvent) => {
    e.preventDefault();
    const currentVal = answers[questionId]?.trim();
    if (!currentVal || submittedQuestions[questionId]) return;

    const nextSubmitted = { ...submittedQuestions, [questionId]: true };
    setSubmittedQuestions(nextSubmitted);
    checkAllCompleted(nextSubmitted, answers);
  };

  const handleResetDrill = () => {
    setAnswers({});
    setSubmittedQuestions({});
  };

  const isAllCompleted = exercises.every((ex) => submittedQuestions[ex.id]);
  const correctCount = exercises.filter((ex) => {
    const userAns = (answers[ex.id] || '').trim().toLowerCase();
    return userAns === ex.correctAnswer.trim().toLowerCase();
  }).length;

  return (
    <div className="space-y-6">
      {isAllCompleted && (
        <div className="p-4 bg-[#EDF3EC] border border-[#DCE8DA] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#346538] text-white flex items-center justify-center flex-shrink-0">
              <IconAward size={16} />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#141413]">Hoàn thành bài luyện tập</h4>
              <p className="font-mono text-xs text-[#346538]">
                Điểm số: {correctCount} / {exercises.length} câu đúng ({Math.round((correctCount / exercises.length) * 100)}%)
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleResetDrill} className="touch-manipulation self-start sm:self-auto">
            <IconRefresh size={12} />
            <span>Làm lại</span>
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {exercises.map((item, index) => {
          const isSubmitted = !!submittedQuestions[item.id];
          const userAns = (answers[item.id] || '').trim().toLowerCase();
          const isCorrect = userAns === item.correctAnswer.trim().toLowerCase();

          return (
            <Card key={item.id} innerClassName="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] text-[#9E9D97]">
                  CÂU HỎI {index + 1} / {exercises.length}
                </span>
                {isSubmitted && (
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-xs ${
                      isCorrect ? 'text-[#346538]' : 'text-[#9F2F2D]'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <IconCheck size={13} /> Chính xác
                      </>
                    ) : (
                      <>
                        <IconCross size={13} /> Chưa chính xác
                      </>
                    )}
                  </span>
                )}
              </div>

              <p className="font-serif text-lg font-medium text-[#141413] mb-4 leading-snug">
                {item.prompt}
              </p>

              {item.options && item.options.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {item.options.map((option, optIdx) => {
                    const isSelected = answers[item.id] === option;
                    const isOptionTarget = option.toLowerCase() === item.correctAnswer.toLowerCase();

                    let optionStyle =
                      'bg-white border-[#E8E7E4] text-[#141413] hover:bg-[#FBFBFA] hover:border-[#D5D4CE]';

                    if (isSubmitted) {
                      if (isOptionTarget) {
                        optionStyle =
                          'bg-[#EDF3EC] border-[#DCE8DA] text-[#346538] font-medium';
                      } else if (isSelected && !isCorrect) {
                        optionStyle =
                          'bg-[#FDEBEC] border-[#FAD4D6] text-[#9F2F2D]';
                      } else {
                        optionStyle = 'opacity-40 bg-[#FBFBFA] border-[#E8E7E4] text-[#9E9D97]';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(item.id, option)}
                        className={`p-3 text-xs sm:text-sm rounded-lg border text-left transition-all touch-manipulation ${optionStyle}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <form
                  onSubmit={(e) => handleFillSubmit(item.id, e)}
                  className="flex items-center gap-2 mb-3"
                >
                  <Input
                    disabled={isSubmitted}
                    placeholder="Nhập câu trả lời..."
                    value={answers[item.id] || ''}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    className={
                      isSubmitted
                        ? isCorrect
                          ? 'border-[#DCE8DA] bg-[#EDF3EC] text-[#346538] font-medium'
                          : 'border-[#FAD4D6] bg-[#FDEBEC] text-[#9F2F2D] font-medium'
                        : ''
                    }
                  />
                  {!isSubmitted && (
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={!answers[item.id]?.trim()}
                      className="touch-manipulation"
                    >
                      Kiểm tra
                    </Button>
                  )}
                </form>
              )}

              {isSubmitted && (
                <div className="pt-2.5 border-t border-[#EFEFEA] text-xs space-y-0.5">
                  {!isCorrect && (
                    <p className="font-mono text-[#9F2F2D] text-[11px]">
                      Đáp án đúng: <span className="font-serif font-bold text-[#141413]">{item.correctAnswer}</span>
                    </p>
                  )}
                  <p className="font-serif italic text-[#9E9D97] text-xs">
                    Câu gốc trong bài học: "{item.sourceSentence}"
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
