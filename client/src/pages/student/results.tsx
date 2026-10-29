import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SessionService } from '../../Service/SessionService';
import { StarBurst } from '../../components/kids/StarBurst';
import { SpeakerButton } from '../../components/kids/SpeakerButton';
import type { CompleteSessionResponseDto } from '../../types/api';

export function StudentResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sessionId = parseInt(id || '0', 10);

  const [result, setResult] = useState<CompleteSessionResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResult() {
      if (!sessionId) return;
      try {
        const data = await SessionService.getSessionResult(sessionId);
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load session result.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchResult();
  }, [sessionId]);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Đang tải kết quả...</div>;
  }

  if (error || !result) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-red-600 font-bold">{error || 'Không tìm thấy kết quả.'}</p>
        <button onClick={() => navigate('/student')} className="px-6 py-2 bg-gray-200 rounded-xl font-bold">
          Trang chủ
        </button>
      </div>
    );
  }

  const isSenior = result.scorePercent !== null;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      {/* Top Stars / Score Banner */}
      <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 text-center shadow-md space-y-3">
        {result.stars != null && <StarBurst stars={result.stars} />}

        {isSenior && (
          <div className="space-y-1">
            <span className="text-4xl font-black text-blue-600">{result.scorePercent}%</span>
            <p className="text-sm font-semibold text-gray-500">
              Đúng {result.correct} trên {result.total} câu hỏi
            </p>
          </div>
        )}

        {!isSenior && (
          <p className="text-lg font-bold text-gray-700">
            Đúng {result.correct} / {result.total} câu!
          </p>
        )}
      </div>

      {/* Review details */}
      {result.review.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-extrabold text-gray-800">Ôn tập chi tiết:</h3>
          <div className="space-y-2">
            {result.review.map((item, idx) => (
              <div
                key={item.sessionQuestionId || idx}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 ${
                  item.isCorrect
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.isCorrect ? '✅' : '🌟'}</span>
                    <span className="font-extrabold text-gray-900 text-base">
                      {item.correctAnswer}
                    </span>
                  </div>
                  {item.explanation && (
                    <p className="text-xs text-gray-600">{item.explanation}</p>
                  )}
                </div>

                {item.correctAnswer && (
                  <SpeakerButton text={item.correctAnswer} size="md" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate('/student')}
          className="flex-1 py-3.5 bg-emerald-600 text-white font-extrabold text-lg rounded-2xl shadow hover:bg-emerald-700 active:scale-98 transition text-center"
        >
          Trang chủ
        </button>
      </div>
    </div>
  );
}
