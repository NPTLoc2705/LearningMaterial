import { useEffect, useState } from 'react';
import { useGameSession } from '../../../hooks/use-game-session';
import type { CompleteSessionResponseDto } from '../../../types/api';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface SeniorGrammarTestStepProps {
  lessonId: number;
  classroomId: number;
  topicId: number;
  onProceedToReview: (result: CompleteSessionResponseDto) => void;
  onBackToPractice: () => void;
}

export function SeniorGrammarTestStep({
  lessonId,
  classroomId,
  topicId,
  onProceedToReview,
  onBackToPractice,
}: SeniorGrammarTestStepProps) {
  const {
    session,
    questions,
    currentIndex,
    currentQuestion,
    isSubmitting,
    isLoading,
    isCompleted,
    result,
    error,
    start,
    submitAnswer,
    nextQuestion,
  } = useGameSession();

  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState<boolean>(false);

  useEffect(() => {
    if (lessonId && classroomId && topicId) {
      start(lessonId, classroomId, 'GrammarMiniTest', 'Test', topicId);
    }
  }, [lessonId, classroomId, topicId, start]);

  const handleSelectAnswer = async (key: string) => {
    if (isSubmitting || hasAnsweredCurrent) return;
    setSelectedAnswer(key);
    setHasAnsweredCurrent(true);
    await submitAnswer(key);
  };

  const handleNext = () => {
    setSelectedAnswer('');
    setHasAnsweredCurrent(false);
    nextQuestion();
  };

  if (isLoading && !session) {
    return (
      <div className="py-12 text-center text-purple-600 font-bold animate-pulse">
        Đang khởi tạo bài kiểm tra ngắn...
      </div>
    );
  }

  if (error && !session) {
    return (
      <Card innerClassName="p-8 text-center space-y-4">
        <p className="text-sm text-red-600 font-bold">{error}</p>
        <Button variant="outline" onClick={onBackToPractice}>
          Quay lại Luyện tập
        </Button>
      </Card>
    );
  }

  if (isCompleted && result) {
    const score = result.scorePercent ?? Math.round((result.correct / result.total) * 100);
    const passed = score >= 70;

    return (
      <div className="max-w-xl mx-auto p-6 text-center space-y-6">
        <div
          className={`p-8 rounded-3xl border-2 space-y-4 ${
            passed
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <span className="text-5xl">{passed ? '🏆' : '💪'}</span>
          <h2 className="text-3xl font-black">
            {passed ? 'ĐÃ ĐẠT BÀI KIỂM TRA!' : 'CHƯA ĐẠT (CẦN ≥ 70%)'}
          </h2>
          <div className="font-mono text-4xl font-extrabold">
            {score}%
          </div>
          <p className="text-sm font-medium">
            Trả lời đúng <strong>{result.correct}</strong> trên tổng số{' '}
            <strong>{result.total}</strong> câu hỏi.
          </p>
          <p className="text-xs text-gray-600">
            {passed
              ? 'Chúc mừng bạn đã nắm vững quy tắc ngữ pháp của chủ đề này!'
              : 'Đừng lo lắng! Hãy xem lại chi tiết các câu sai để hiểu rõ nguyên tắc nhé.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onProceedToReview(result)}
            className="font-bold min-h-[50px] shadow-md"
          >
            Xem lại giải thích chi tiết (Bước 4) ➔
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-purple-700 bg-purple-50 px-3 py-1 rounded-full font-bold">
          Câu {currentIndex + 1} / {questions.length} · Bài kiểm tra ngắn
        </span>
        <span className="text-xs font-semibold text-gray-500">
          Chế độ kiểm tra (Không hiển thị đáp án)
        </span>
      </div>

      {/* Question Card */}
      <Card innerClassName="p-6 space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-purple-600 font-bold">
            {currentQuestion.kind || 'Multiple Choice'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {currentQuestion.prompt}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedAnswer === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSelectAnswer(opt.key)}
                disabled={isSubmitting || hasAnsweredCurrent}
                className={`w-full p-4 rounded-xl border-2 text-left text-base font-medium transition-all ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold shadow-sm'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                } disabled:cursor-not-allowed`}
              >
                {opt.text}
              </button>
            );
          })}
        </div>

        {/* Action to proceed */}
        {hasAnsweredCurrent && (
          <div className="pt-4 flex justify-end border-t">
            <Button size="sm" variant="primary" onClick={handleNext}>
              {currentIndex + 1 < questions.length ? 'Câu tiếp theo ➔' : 'Nộp bài & Hoàn thành ➔'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
