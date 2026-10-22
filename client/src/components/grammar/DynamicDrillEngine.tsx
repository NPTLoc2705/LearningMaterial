import React, { useState, useEffect } from 'react';
import type { DynamicDrillQuestion } from '../../types/grammar';
import { generateMixedDrill } from '../../utils/drillGenerator';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { IconCheck, IconCross, IconRefresh, IconAward, IconInfo, IconShuffle } from '../ui/Icons';
import confetti from 'canvas-confetti';

export interface DynamicDrillEngineProps {
  drillBank: DynamicDrillQuestion[];
  onCompleteDrill?: (score: number, total: number) => void;
}

export function DynamicDrillEngine({
  drillBank,
  onCompleteDrill,
}: DynamicDrillEngineProps) {
  const [activeQuestions, setActiveQuestions] = useState<DynamicDrillQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Initialize or re-sample a 6-question mixed drill (from at least 3 types)
  const initNewDrill = () => {
    const sampled = generateMixedDrill(drillBank, 6, 3);
    setActiveQuestions(sampled);
    setAnswers({});
    setIsSubmitted(false);
  };

  useEffect(() => {
    initNewDrill();
  }, [drillBank]);

  // "Làm lại đề này": Preserves activeQuestions, resets answers and submission state
  const handleRetrySameDrill = () => {
    setAnswers({});
    setIsSubmitted(false);
  };

  // Answer handler
  const handleSetAnswer = (questionId: string, val: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  // Evaluation logic
  const checkIsCorrect = (q: DynamicDrillQuestion): boolean => {
    const userAns = (answers[q.id] || '').trim().toLowerCase();
    const targetAns = q.correctAnswer.trim().toLowerCase();

    if (!userAns) return false;

    // Normalizing spaces and punctuation for flexible comparison
    const cleanUser = userAns.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').replace(/\s+/g, ' ');
    const cleanTarget = targetAns.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').replace(/\s+/g, ' ');

    return cleanUser === cleanTarget;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitted || activeQuestions.length === 0) return;

    let score = 0;
    activeQuestions.forEach((q) => {
      if (checkIsCorrect(q)) score++;
    });

    setIsSubmitted(true);
    if (onCompleteDrill) {
      onCompleteDrill(score, activeQuestions.length);
    }

    if (score >= Math.ceil(activeQuestions.length * 0.8)) {
      try {
        confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }
  };

  if (!activeQuestions || activeQuestions.length === 0) {
    return (
      <div className="p-8 text-center bg-[#F6F5F2] rounded-xl border border-[#E8E7E4]">
        <p className="font-serif italic text-sm text-[#6B6A66]">
          Chủ điểm này là tài liệu tham khảo ghi chú, chưa có ngân hàng câu hỏi vận dụng.
        </p>
      </div>
    );
  }

  // Count distinct types in current drill
  const uniqueTypes = Array.from(new Set(activeQuestions.map((q) => q.typeLabel)));

  // Calculate score if submitted
  const correctCount = activeQuestions.filter((q) => checkIsCorrect(q)).length;
  const answeredCount = Object.keys(answers).filter((k) => (answers[k] || '').trim()).length;

  return (
    <div className="space-y-6">
      {/* Session Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#FBFBFA] rounded-xl border border-[#E8E7E4]">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono text-xs font-semibold text-[#141413]">
              Đề Luyện Hỗn Hợp ({activeQuestions.length} câu)
            </span>
            <Badge variant="blue" size="sm">
              {uniqueTypes.length} dạng đề kết hợp
            </Badge>
          </div>
          <p className="text-xs text-[#6B6A66]">
            Gồm các dạng: {uniqueTypes.join(' · ')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isSubmitted && (
            <span className="font-mono text-xs text-[#9E9D97]">
              Đã làm: {answeredCount} / {activeQuestions.length}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={initNewDrill}
            title="Đổi bộ 3 dạng đề ngẫu nhiên mới"
            className="touch-manipulation"
          >
            <IconShuffle size={12} />
            <span>Tạo đề mới</span>
          </Button>
        </div>
      </div>

      {/* Submitted Result Score Banner */}
      {isSubmitted && (
        <Card innerClassName="p-6 sm:p-8 text-center space-y-4 animate-scale-up">
          <div className="w-12 h-12 rounded-xl bg-[#EDF3EC] text-[#346538] mx-auto flex items-center justify-center">
            <IconAward size={24} />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#141413]">
              Hoàn Thành Bài Luyện Tập
            </h3>
            <p className="text-xs text-[#6B6A66]">
              Xem chi tiết đáp án và phần giải thích cặn kẽ từng câu bên dưới.
            </p>
          </div>

          <div className="p-3 bg-[#FBFBFA] rounded-xl border border-[#E8E7E4] max-w-xs mx-auto">
            <span className="font-mono text-[10px] uppercase text-[#9E9D97]">Kết quả</span>
            <div className="font-serif text-3xl font-bold text-[#141413] my-1">
              {correctCount} / {activeQuestions.length}
            </div>
            <Badge
              variant={correctCount / activeQuestions.length >= 0.8 ? 'green' : 'amber'}
              size="md"
            >
              {Math.round((correctCount / activeQuestions.length) * 100)}% ĐIỂM ĐẠT
            </Badge>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetrySameDrill}
              className="touch-manipulation"
            >
              <IconRefresh size={12} />
              <span>Làm lại đề này</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={initNewDrill}
              className="touch-manipulation"
            >
              <IconShuffle size={12} />
              <span>Tạo đề luyện mới</span>
            </Button>
          </div>
        </Card>
      )}

      {/* Question List */}
      <div className="space-y-5">
        {activeQuestions.map((q, idx) => {
          const userAns = answers[q.id] || '';
          const isCorrect = checkIsCorrect(q);

          return (
            <Card key={q.id} innerClassName="p-5 sm:p-6 space-y-4">
              {/* Question Header */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#EFEFEA]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-semibold text-[#141413]">
                    CÂU {idx + 1} / {activeQuestions.length}
                  </span>
                  <Badge variant="slate" size="sm">
                    {q.typeLabel}
                  </Badge>
                </div>

                {isSubmitted && (
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-xs font-medium ${
                      isCorrect ? 'text-[#346538]' : 'text-[#9F2F2D]'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <IconCheck size={14} /> Chính xác
                      </>
                    ) : (
                      <>
                        <IconCross size={14} /> Chưa chính xác
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Prompt */}
              <p className="text-xs sm:text-sm text-[#6B6A66]">
                {q.prompt}
              </p>

              {/* Passage / Target context if present */}
              {q.passage && (
                <div className="p-3.5 bg-[#FBFBFA] rounded-xl border border-[#E8E7E4] font-serif text-sm sm:text-base text-[#141413] leading-relaxed">
                  "{q.passage}"
                </div>
              )}

              {/* Type 1: Reading Cloze & Sentence Rewrite & Generic Input */}
              {(q.type === 'reading-cloze' || q.type === 'sentence-rewrite') && (
                <div className="space-y-2">
                  {q.targetKeyword && (
                    <div className="flex items-center gap-1.5 text-xs text-[#6B6A66]">
                      <span>Từ khóa bắt buộc:</span>
                      <span className="font-mono font-bold text-[#141413] bg-[#F4F3EF] px-2 py-0.5 rounded border border-[#E8E7E4]">
                        [{q.targetKeyword}]
                      </span>
                    </div>
                  )}
                  <Input
                    disabled={isSubmitted}
                    placeholder="Nhập câu trả lời của bạn..."
                    value={userAns}
                    onChange={(e) => handleSetAnswer(q.id, e.target.value)}
                    className={
                      isSubmitted
                        ? isCorrect
                          ? 'border-[#DCE8DA] bg-[#EDF3EC] text-[#346538]'
                          : 'border-[#FAD4D6] bg-[#FDEBEC] text-[#9F2F2D]'
                        : ''
                    }
                  />
                </div>
              )}

              {/* Type 2: Error Correction */}
              {q.type === 'error-correction' && (
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D97] block">
                    Gõ từ sửa lại đúng:
                  </span>
                  <Input
                    disabled={isSubmitted}
                    placeholder="Nhập từ chính xác thay thế..."
                    value={userAns}
                    onChange={(e) => handleSetAnswer(q.id, e.target.value)}
                    className={
                      isSubmitted
                        ? isCorrect
                          ? 'border-[#DCE8DA] bg-[#EDF3EC] text-[#346538]'
                          : 'border-[#FAD4D6] bg-[#FDEBEC] text-[#9F2F2D]'
                        : ''
                    }
                  />
                </div>
              )}

              {/* Type 3: Multiple Choice */}
              {q.type === 'multiple-choice' && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAns.toLowerCase() === opt.toLowerCase();
                    const isTarget = opt.toLowerCase() === q.correctAnswer.toLowerCase();

                    let btnStyles = 'bg-white border-[#E8E7E4] text-[#141413] hover:bg-[#FBFBFA]';
                    if (isSubmitted) {
                      if (isTarget) {
                        btnStyles = 'bg-[#EDF3EC] border-[#DCE8DA] text-[#346538] font-semibold';
                      } else if (isSelected && !isCorrect) {
                        btnStyles = 'bg-[#FDEBEC] border-[#FAD4D6] text-[#9F2F2D]';
                      } else {
                        btnStyles = 'opacity-40 bg-[#FBFBFA] border-[#E8E7E4] text-[#9E9D97]';
                      }
                    } else if (isSelected) {
                      btnStyles = 'bg-[#141413] text-white border-[#141413] font-medium';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSetAnswer(q.id, opt)}
                        className={`p-3 text-xs sm:text-sm rounded-lg border text-left transition-all touch-manipulation flex items-center justify-between ${btnStyles}`}
                      >
                        <span>{opt}</span>
                        {isSubmitted && isTarget && <IconCheck size={14} className="text-[#346538]" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Type 4: Word Scramble */}
              {q.type === 'word-scramble' && q.scrambledWords && (
                <div className="space-y-3">
                  {!isSubmitted && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {q.scrambledWords.map((word, wIdx) => (
                        <button
                          key={wIdx}
                          type="button"
                          onClick={() => {
                            const newText = userAns ? `${userAns.trim()} ${word}` : word;
                            handleSetAnswer(q.id, newText);
                          }}
                          className="px-2.5 py-1 text-xs font-mono bg-[#F4F3EF] hover:bg-[#EAE8E3] text-[#141413] rounded-md border border-[#E8E7E4] transition-colors touch-manipulation"
                        >
                          {word}
                        </button>
                      ))}
                      {userAns && (
                        <button
                          type="button"
                          onClick={() => handleSetAnswer(q.id, '')}
                          className="text-[11px] font-mono text-[#9F2F2D] hover:underline ml-2"
                        >
                          Xóa làm lại
                        </button>
                      )}
                    </div>
                  )}

                  <Input
                    disabled={isSubmitted}
                    placeholder="Chạm các từ phía trên hoặc gõ câu hoàn chỉnh..."
                    value={userAns}
                    onChange={(e) => handleSetAnswer(q.id, e.target.value)}
                    className={
                      isSubmitted
                        ? isCorrect
                          ? 'border-[#DCE8DA] bg-[#EDF3EC] text-[#346538]'
                          : 'border-[#FAD4D6] bg-[#FDEBEC] text-[#9F2F2D]'
                        : ''
                    }
                  />
                </div>
              )}

              {/* Review & Explanations when Submitted */}
              {isSubmitted && (
                <div className="pt-3 border-t border-[#EFEFEA] space-y-3 text-xs sm:text-sm">
                  {/* Correct Answer comparison if user was wrong */}
                  {!isCorrect && (
                    <div className="p-3 bg-[#FDEBEC] border border-[#FAD4D6] rounded-lg text-[#9F2F2D] space-y-1">
                      <p className="font-mono text-xs">
                        Câu trả lời của bạn: <span className="line-through">{userAns || '(bỏ trống)'}</span>
                      </p>
                      <p className="font-semibold text-xs">
                        Đáp án đúng: <span className="font-mono text-[#141413]">{q.correctAnswer}</span>
                      </p>
                    </div>
                  )}

                  {/* Detailed Explanation Box */}
                  <div className="p-3.5 bg-[#F6F5F2] border border-[#E8E7E4] rounded-lg text-[#141413] space-y-2">
                    <div className="flex items-center gap-1.5 font-bold font-mono text-[11px] uppercase text-[#6B6A66]">
                      <IconInfo size={13} />
                      <span>Giải thích chi tiết vì sao đúng:</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#403F3B]">
                      {q.explanation.ruleReason}
                    </p>
                    {q.explanation.whyWrong && (
                      <p className="text-xs text-[#956400] bg-[#FBF3DB] p-2 rounded border border-[#F5E6BF]">
                        💡 <strong>Lỗi thường gặp:</strong> {q.explanation.whyWrong}
                      </p>
                    )}
                    <p className="font-mono text-[11px] text-[#346538]">
                      👉 <strong>Mẹo ghi nhớ:</strong> {q.explanation.grammarTip}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Bottom Action Submit or Retry */}
      {!isSubmitted ? (
        <div className="pt-4 flex items-center justify-between gap-4">
          <span className="text-xs text-[#9E9D97] font-mono">
            Bạn có thể làm lại câu sai sau khi nộp bài
          </span>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={answeredCount === 0}
            className="touch-manipulation"
          >
            Nộp bài &amp; Xem giải thích
          </Button>
        </div>
      ) : (
        <div className="pt-4 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleRetrySameDrill}
            className="touch-manipulation"
          >
            <IconRefresh size={14} />
            <span>Làm lại đề này</span>
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={initNewDrill}
            className="touch-manipulation"
          >
            <IconShuffle size={14} />
            <span>Tạo đề luyện mới</span>
          </Button>
        </div>
      )}
    </div>
  );
}
