import React, { useState } from 'react';
import type { DynamicDrillQuestion } from '../../types/grammar';
import { generateMixedDrill } from '../../utils/drillGenerator';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { IconCheck, IconCross, IconRefresh, IconAward, IconInfo, IconShuffle } from '../ui/Icons';

export interface DynamicDrillEngineProps {
  drillBank: DynamicDrillQuestion[];
  onCompleteDrill?: (score: number, total: number) => void;
}

/**
 * Normalizes text for flexible answer comparison:
 * 1. Lowercase
 * 2. Replaces punctuation with space (handles commas, periods, question marks, quotes, brackets, etc.)
 * 3. Collapses multiple whitespace to single space
 * 4. Trims leading and trailing spaces
 */
export function normalizeAnswer(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Splits user answers for multiple-blank cloze tasks.
 * Supports slashes, dashes, commas, and semicolons as separators.
 */
export function splitClozeAnswers(text: string): string[] {
  if (!text) return [];
  return text
    .split(/\s*(?:\/|,|;|\s+-\s+|\s*-\s*)\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function DynamicDrillEngine({
  drillBank,
  onCompleteDrill,
}: DynamicDrillEngineProps) {
  const [activeQuestions, setActiveQuestions] = useState<DynamicDrillQuestion[]>(() =>
    generateMixedDrill(drillBank, 6, 3)
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // Track selected chips for word-scramble questions by question id: array of clicked word chip indices
  const [scrambleSelections, setScrambleSelections] = useState<Record<string, number[]>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Initialize or re-sample a 6-question mixed drill (from at least 3 types)
  const initNewDrill = () => {
    const sampled = generateMixedDrill(drillBank, 6, 3);
    setActiveQuestions(sampled);
    setAnswers({});
    setScrambleSelections({});
    setIsSubmitted(false);
  };

  // "Làm lại đề này": Preserves activeQuestions, resets answers and submission state
  const handleRetrySameDrill = () => {
    setAnswers({});
    setScrambleSelections({});
    setIsSubmitted(false);
  };

  // Answer handler
  const handleSetAnswer = (questionId: string, val: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  // Word Scramble chip click handler
  const handleScrambleChipClick = (qId: string, word: string, wIdx: number) => {
    if (isSubmitted) return;
    const currentSelected = scrambleSelections[qId] || [];
    if (currentSelected.includes(wIdx)) return; // already used

    const nextSelected = [...currentSelected, wIdx];
    setScrambleSelections((prev) => ({ ...prev, [qId]: nextSelected }));

    const currentText = answers[qId] || '';
    const newText = currentText.trim() ? `${currentText.trim()} ${word}` : word;
    setAnswers((prev) => ({ ...prev, [qId]: newText }));
  };

  // Word Scramble backspace last chip
  const handleScrambleBackspace = (q: DynamicDrillQuestion) => {
    if (isSubmitted || !q.scrambledWords) return;
    const currentSelected = scrambleSelections[q.id] || [];
    if (currentSelected.length === 0) {
      setAnswers((prev) => ({ ...prev, [q.id]: '' }));
      return;
    }
    const nextSelected = currentSelected.slice(0, -1);
    setScrambleSelections((prev) => ({ ...prev, [q.id]: nextSelected }));

    // Reconstruct text from remaining selected chips
    const reconstructed = nextSelected.map((idx) => q.scrambledWords![idx]).join(' ');
    setAnswers((prev) => ({ ...prev, [q.id]: reconstructed }));
  };

  // Word Scramble clear all
  const handleScrambleClear = (qId: string) => {
    if (isSubmitted) return;
    setScrambleSelections((prev) => ({ ...prev, [qId]: [] }));
    setAnswers((prev) => ({ ...prev, [qId]: '' }));
  };

  // Flexible Evaluation logic
  const checkIsCorrect = (q: DynamicDrillQuestion): boolean => {
    const rawUserAns = (answers[q.id] || '').trim();
    if (!rawUserAns) return false;

    const cleanUser = normalizeAnswer(rawUserAns);
    const cleanTarget = normalizeAnswer(q.correctAnswer);

    // 1. Exact normalized match with primary correctAnswer
    if (cleanUser === cleanTarget) return true;

    // 2. Match with any explicit acceptableAnswers
    if (q.acceptableAnswers && q.acceptableAnswers.length > 0) {
      if (q.acceptableAnswers.some((alt) => normalizeAnswer(alt) === cleanUser)) {
        return true;
      }
    }

    // 3. For multi-blank reading-cloze: check orderedAnswers
    if (q.type === 'reading-cloze' && q.orderedAnswers && q.orderedAnswers.length > 1) {
      const userParts = splitClozeAnswers(rawUserAns);
      if (userParts.length === q.orderedAnswers.length) {
        const allMatch = q.orderedAnswers.every((expected, idx) => {
          return normalizeAnswer(userParts[idx]) === normalizeAnswer(expected);
        });
        if (allMatch) return true;
      }
    }

    // 4. For error-correction:
    // Allow either the corrected word, or the full sentence
    if (q.type === 'error-correction') {
      // Check fullCorrectSentence if provided
      if (q.fullCorrectSentence && normalizeAnswer(q.fullCorrectSentence) === cleanUser) {
        return true;
      }
      // Compute full corrected sentence from passage + errorWord + correctAnswer
      if (q.passage && q.errorWord && q.correctAnswer) {
        const regex = new RegExp(`\\b${q.errorWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        const computedSentence = q.passage.replace(regex, q.correctAnswer);
        if (normalizeAnswer(computedSentence) === cleanUser) {
          return true;
        }
      }
      // If student wrote something like "more -> most" or "more: most"
      if (rawUserAns.includes('->') || rawUserAns.includes(':')) {
        const rhs = rawUserAns.split(/->|:/)[1]?.trim();
        if (rhs && normalizeAnswer(rhs) === cleanTarget) {
          return true;
        }
      }
    }

    return false;
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
      import('canvas-confetti')
        .then(({ default: confetti }) => {
          confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
        })
        .catch(() => {
          // ignore
        });
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
          const currentSelected = scrambleSelections[q.id] || [];

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

              {/* Type 1: Reading Cloze */}
              {q.type === 'reading-cloze' && (
                <div className="space-y-2.5">
                  {/* Guidance description for multi-blank cloze */}
                  {q.orderedAnswers && q.orderedAnswers.length > 1 && (
                    <div className="p-3 bg-[#F4F3EF] rounded-lg border border-[#E8E7E4] text-xs text-[#52514D] flex items-start gap-2">
                      <IconInfo size={14} className="mt-0.5 shrink-0 text-[#6B6A66]" />
                      <div className="leading-relaxed">
                        <strong className="text-[#141413]">Hướng dẫn nhập đáp án:</strong> Đoạn văn có{' '}
                        {q.orderedAnswers.length} chỗ trống theo thứ tự (1), (2), (3)... Bạn có thể nhập các từ cần
                        điền cách nhau bằng dấu gạch chéo{' '}
                        <code className="bg-white px-1.5 py-0.5 rounded border border-[#DDD] font-mono text-[11px] text-[#141413]">
                          /
                        </code>{' '}
                        hoặc gạch ngang{' '}
                        <code className="bg-white px-1.5 py-0.5 rounded border border-[#DDD] font-mono text-[11px] text-[#141413]">
                          -
                        </code>{' '}
                        (Ví dụ:{' '}
                        <span className="font-mono text-[#141413]">{q.orderedAnswers.join(' / ')}</span>).
                      </div>
                    </div>
                  )}

                  <Input
                    disabled={isSubmitted}
                    placeholder={
                      q.orderedAnswers && q.orderedAnswers.length > 1
                        ? 'Ví dụ: từ 1 / từ 2 / từ 3...'
                        : 'Nhập câu trả lời của bạn...'
                    }
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

              {/* Type 2: Sentence Rewrite */}
              {q.type === 'sentence-rewrite' && (
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
                    placeholder="Nhập câu hoàn chỉnh của bạn..."
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

              {/* Type 3: Error Correction */}
              {q.type === 'error-correction' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#6B6A66]">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D97] block">
                      Gõ từ sửa lại đúng (hoặc nhập lại cả câu đã sửa):
                    </span>
                    {q.errorWord && (
                      <span className="text-[11px] text-[#956400]">
                        Từ sai: <strong className="font-mono bg-[#FBF3DB] px-1.5 py-0.5 rounded border border-[#F5E6BF]">{q.errorWord}</strong>
                      </span>
                    )}
                  </div>
                  <Input
                    disabled={isSubmitted}
                    placeholder="Ví dụ: gõ từ sửa lại đúng hoặc viết lại cả câu..."
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

              {/* Type 4: Multiple Choice */}
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

              {/* Type 5: Word Scramble */}
              {q.type === 'word-scramble' && q.scrambledWords && (
                <div className="space-y-3">
                  {!isSubmitted && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {q.scrambledWords.map((word, wIdx) => {
                        const isUsed = currentSelected.includes(wIdx);
                        return (
                          <button
                            key={wIdx}
                            type="button"
                            disabled={isUsed}
                            onClick={() => handleScrambleChipClick(q.id, word, wIdx)}
                            className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-all touch-manipulation ${
                              isUsed
                                ? 'bg-[#EAE8E3] text-[#9E9D97] border-[#DDD] cursor-not-allowed line-through opacity-60'
                                : 'bg-[#F4F3EF] hover:bg-[#EAE8E3] text-[#141413] border-[#E8E7E4] shadow-xs active:scale-95'
                            }`}
                          >
                            {word}
                          </button>
                        );
                      })}
                      {userAns && (
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            type="button"
                            onClick={() => handleScrambleBackspace(q)}
                            className="text-[11px] font-mono text-[#6B6A66] hover:text-[#141413] hover:underline"
                          >
                            Xóa từ cuối
                          </button>
                          <span className="text-[#DDD]">|</span>
                          <button
                            type="button"
                            onClick={() => handleScrambleClear(q.id)}
                            className="text-[11px] font-mono text-[#9F2F2D] hover:underline"
                          >
                            Xóa hết
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <Input
                    disabled={isSubmitted}
                    placeholder="Chạm các từ phía trên hoặc tự gõ câu hoàn chỉnh..."
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
                  {/* Correct Answer comparison box */}
                  <div
                    className={`p-3.5 rounded-lg border space-y-2 ${
                      isCorrect
                        ? 'bg-[#EDF3EC] border-[#DCE8DA] text-[#346538]'
                        : 'bg-[#FDEBEC] border-[#FAD4D6] text-[#9F2F2D]'
                    }`}
                  >
                    {!isCorrect && (
                      <p className="font-mono text-xs">
                        Câu trả lời của bạn: <span className="line-through">{userAns || '(bỏ trống)'}</span>
                      </p>
                    )}

                    {/* Detailed correct answer presentation depending on type */}
                    {q.type === 'reading-cloze' && q.orderedAnswers && q.orderedAnswers.length > 1 ? (
                      <div className="space-y-1.5 pt-1">
                        <span className="font-semibold text-xs block text-[#141413]">
                          Đáp án đúng theo thứ tự các chỗ trống:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {q.orderedAnswers.map((ans, aIdx) => (
                            <div
                              key={aIdx}
                              className="p-2.5 bg-white rounded-lg border border-[#E8E7E4] font-mono text-xs flex items-center gap-2"
                            >
                              <span className="w-5 h-5 rounded-full bg-[#EDF3EC] text-[#346538] font-bold text-[11px] flex items-center justify-center shrink-0">
                                {aIdx + 1}
                              </span>
                              <span className="text-[#346538] font-semibold">{ans}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : q.type === 'error-correction' ? (
                      <div className="space-y-1 text-xs">
                        <p>
                          Từ sửa lại đúng: <strong className="font-mono text-[#346538]">{q.correctAnswer}</strong>
                        </p>
                        {q.fullCorrectSentence && (
                          <p className="text-[#6B6A66]">
                            Câu hoàn chỉnh:{' '}
                            <span className="italic font-serif text-[#141413]">"{q.fullCorrectSentence}"</span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="font-semibold text-xs">
                        Đáp án đúng: <span className="font-mono text-[#141413]">{q.correctAnswer}</span>
                      </p>
                    )}
                  </div>

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
