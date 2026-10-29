import type { CompleteSessionResponseDto } from '../../../types/api';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface SeniorGrammarReviewStepProps {
  result: CompleteSessionResponseDto;
  onRetakeTest: () => void;
  onBackToLearn: () => void;
  onFinish: () => void;
}

export function SeniorGrammarReviewStep({
  result,
  onRetakeTest,
  onBackToLearn,
  onFinish,
}: SeniorGrammarReviewStepProps) {
  const score = result.scorePercent ?? Math.round((result.correct / result.total) * 100);
  const passed = score >= 70;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header banner */}
      <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 font-bold">
            Bước 4 · Xem lại chi tiết & Giải thích
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            Tổng kết kết quả kiểm tra
          </h2>
          <p className="text-sm text-gray-600">
            Điểm số: <strong className="font-mono text-base">{score}%</strong> ({result.correct}/{result.total} câu đúng) ·{' '}
            <span className={passed ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
              {passed ? 'Đạt' : 'Chưa đạt'}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={onBackToLearn}>
            📖 Lý thuyết
          </Button>
          <Button size="sm" variant="outline" onClick={onRetakeTest}>
            🔄 Làm lại bài thi
          </Button>
          <Button size="sm" variant="primary" onClick={onFinish}>
            🏠 Hoàn thành
          </Button>
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-4">
        {result.review.map((item, idx) => (
          <Card
            key={item.sessionQuestionId}
            innerClassName={`p-5 space-y-3 border-l-4 ${
              item.isCorrect ? 'border-l-emerald-500' : 'border-l-red-500'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{item.isCorrect ? '✅' : '❌'}</span>
                <span className="font-mono text-xs font-bold text-gray-400">
                  Câu {idx + 1}
                </span>
                <h3 className="font-bold text-base text-gray-900">{item.prompt}</h3>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  item.isCorrect
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {item.isCorrect ? 'Đúng' : 'Sai'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-gray-500 font-medium block">Câu trả lời của bạn:</span>
                <span
                  className={`font-bold text-sm ${
                    item.isCorrect ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {item.studentAnswer || '(Chưa trả lời)'}
                </span>
              </div>

              {!item.isCorrect && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                  <span className="text-emerald-700 font-medium block">Đáp án chính xác:</span>
                  <span className="font-bold text-sm text-emerald-800">
                    {item.correctAnswer}
                  </span>
                </div>
              )}
            </div>

            {item.explanation && (
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs sm:text-sm text-blue-950 leading-relaxed space-y-1">
                <p className="font-bold text-blue-900">💡 Giải thích chi tiết:</p>
                <p>{item.explanation}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="flex justify-center gap-3 pt-4">
        <Button size="lg" variant="outline" onClick={onRetakeTest}>
          🔄 Thử làm lại bài kiểm tra
        </Button>
        <Button size="lg" variant="primary" onClick={onFinish}>
          Quay về danh sách Ngữ pháp ➔
        </Button>
      </div>
    </div>
  );
}
