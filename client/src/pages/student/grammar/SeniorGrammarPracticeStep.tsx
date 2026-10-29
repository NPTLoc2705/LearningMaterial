import { useEffect, useState } from 'react';
import { useGameSession } from '../../../hooks/use-game-session';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface SeniorGrammarPracticeStepProps {
  lessonId: number;
  classroomId: number;
  topicId: number;
  onProceedToTest: () => void;
  onBackToLearn: () => void;
}

export function SeniorGrammarPracticeStep({
  lessonId,
  classroomId,
  topicId,
  onProceedToTest,
  onBackToLearn,
}: SeniorGrammarPracticeStepProps) {
  const {
    session,
    questions,
    currentIndex,
    currentQuestion,
    feedback,
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

  useEffect(() => {
    if (lessonId && classroomId && topicId) {
      start(lessonId, classroomId, 'GrammarGuidedPractice', 'Practice', topicId);
    }
  }, [lessonId, classroomId, topicId, start]);

  const handleSubmit = async (answer: string) => {
    if (isSubmitting || feedback) return;
    setSelectedAnswer(answer);
    await submitAnswer(answer);
  };

  const handleNext = () => {
    setSelectedAnswer('');
    nextQuestion();
  };

  if (isLoading && !session) {
    return (
      <div className="py-12 text-center text-indigo-600 font-bold animate-pulse">
        Đang khởi tạo bài luyện tập...
      </div>
    );
  }

  if (error && !session) {
    return (
      <Card innerClassName="p-8 text-center space-y-4">
        <p className="text-sm text-red-600 font-bold">{error}</p>
        <Button variant="outline" onClick={onBackToLearn}>
          Quay lại phần lý thuyết
        </Button>
      </Card>
    );
  }

  if (isCompleted && result) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center space-y-6">
        <div className="p-8 bg-emerald-50 border-2 border-emerald-200 rounded-3xl space-y-3">
          <span className="text-4xl">🎉</span>
          <h2 className="text-2xl font-bold text-emerald-900">
            Hoàn thành Luyện tập có hướng dẫn!
          </h2>
          <p className="text-gray-700 font-medium">
            Bạn đã trả lời đúng <strong>{result.correct}</strong> trên tổng số{' '}
            <strong>{result.total}</strong> câu hỏi.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={onBackToLearn}>
            ← Xem lại lý thuyết
          </Button>
          <Button variant="primary" size="lg" onClick={onProceedToTest}>
            Tiếp tục: Làm bài kiểm tra ngắn (Mini Test) ➔
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
        <button
          type="button"
          onClick={onBackToLearn}
          className="text-xs font-mono text-gray-500 hover:text-gray-900"
        >
          ← Quay lại lý thuyết
        </button>
        <div className="text-xs font-mono text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full font-bold">
          Câu {currentIndex + 1} / {questions.length} · Luyện tập
        </div>
      </div>

      {/* Question Card */}
      <Card innerClassName="p-6 space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-600 font-bold">
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
            let btnStyle = 'border-gray-200 hover:bg-gray-50 text-gray-800';

            if (isSelected) {
              if (feedback) {
                btnStyle = feedback.isCorrect
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                  : 'border-orange-500 bg-orange-50 text-orange-900 font-bold';
              } else {
                btnStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold';
              }
            }

            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSubmit(opt.key)}
                disabled={isSubmitting || feedback !== null}
                className={`w-full p-4 rounded-xl border-2 text-left text-base font-medium transition-all ${btnStyle} disabled:cursor-not-allowed`}
              >
                {opt.text}
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback Banner with Explanation */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border-2 space-y-2 ${
              feedback.isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-base">
              <span>{feedback.isCorrect ? '✅' : '❌'}</span>
              <span>
                {feedback.isCorrect
                  ? 'Chính xác!'
                  : `Chưa chính xác. Đáp án đúng: ${feedback.correctAnswer || ''}`}
              </span>
            </div>

            {feedback.explanation && (
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-white/80 p-3 rounded-lg border border-current/20">
                💡 <strong>Giải thích:</strong> {feedback.explanation}
              </p>
            )}

            <div className="pt-2 flex justify-end">
              <Button size="sm" variant="primary" onClick={handleNext}>
                Câu tiếp theo ➔
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
