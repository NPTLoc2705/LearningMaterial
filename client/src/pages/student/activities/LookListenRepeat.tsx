import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SessionService } from '../../../Service/SessionService';
import { AssignmentService } from '../../../Service/AssignmentService';
import { SpeakerButton } from '../../../components/kids/SpeakerButton';
import { StarBurst } from '../../../components/kids/StarBurst';
import { SignedMediaImage } from '../../../components/common/SignedMediaImage';
import type { StudentVocabularyPreviewDto } from '../../../types/api';

export function LookListenRepeatActivity() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const classroomId = parseInt(searchParams.get('classroomId') || '0', 10);
  const lessonId = parseInt(id || '0', 10);

  const navigate = useNavigate();
  const [items, setItems] = useState<StudentVocabularyPreviewDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLessonItems() {
      if (!lessonId) return;
      try {
        const hub = await AssignmentService.getMyLessonHub(lessonId);
        setItems(hub.vocabulary || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load lesson.');
      } finally {
        setIsLoading(false);
      }
    }
    loadLessonItems();
  }, [lessonId]);

  const currentItem = items[currentIndex];

  const handleNext = () => {
    if (currentIndex + 1 < items.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFinish = async () => {
    if (!lessonId || !classroomId || isFinishing) return;
    setIsFinishing(true);
    try {
      const session = await SessionService.startSession({
        lessonId,
        classroomId,
        activityType: 'VocabLookListenRepeat',
      });
      await SessionService.completeSession(session.sessionId);
      setIsCompleted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not complete session.');
    } finally {
      setIsFinishing(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Đang tải thẻ từ vựng...</div>;
  }

  if (error || items.length === 0) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-red-600 font-semibold">{error || 'Không tìm thấy từ vựng nào.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-gray-200 rounded-xl font-bold"
        >
          Quay lại
        </button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="max-w-md mx-auto p-6 text-center space-y-6">
        <StarBurst stars={3} />
        <p className="text-gray-700 font-bold text-lg">Bạn đã hoàn thành phần nghe và nhắc lại!</p>
        <button
          onClick={() => navigate(`/student/lessons/${lessonId}?classroomId=${classroomId}`)}
          className="w-full min-h-[56px] py-3 bg-emerald-600 text-white font-extrabold text-xl rounded-2xl shadow-lg hover:bg-emerald-700"
        >
          Trở về bài học
        </button>
      </div>
    );
  }

  const isLast = currentIndex === items.length - 1;

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col items-center justify-between min-h-[80vh] space-y-6">
      {/* Header progress */}
      <div className="w-full flex items-center justify-between text-sm font-extrabold text-gray-500">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 text-lg">
          ✕
        </button>
        <span>
          {currentIndex + 1} / {items.length}
        </span>
      </div>

      {/* Flashcard */}
      <div className="w-full bg-white border-4 border-amber-300 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center space-y-4 min-h-[340px]">
        {currentItem?.imageKey && (
          <div className="w-44 h-44 rounded-2xl overflow-hidden bg-gray-50 border shadow-inner flex items-center justify-center">
            <SignedMediaImage
              imageKey={currentItem.imageKey}
              alt={currentItem.word}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="text-center space-y-1">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-wide">
            {currentItem?.word}
          </h2>
          {currentItem?.meaningVi && (
            <p className="text-lg font-semibold text-gray-600">{currentItem.meaningVi}</p>
          )}
        </div>

        {currentItem?.word && (
          <SpeakerButton text={currentItem.word} size="lg" autoPlay={true} />
        )}
      </div>

      {/* Bottom controls */}
      <div className="w-full space-y-3">
        <button
          type="button"
          onClick={isLast ? handleFinish : handleNext}
          disabled={isFinishing}
          className="w-full min-h-[64px] py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xl rounded-2xl shadow-lg hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2"
        >
          <span>🗣️</span>
          <span>{isLast ? 'I said it! (Hoàn thành)' : 'I said it! (Từ tiếp)'}</span>
        </button>

        <div className="flex justify-between w-full">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-5 py-2 text-sm font-bold text-gray-500 disabled:opacity-20"
          >
            ◀ Quay lại
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isLast}
            className="px-5 py-2 text-sm font-bold text-gray-500 disabled:opacity-20"
          >
            Bỏ qua ▶
          </button>
        </div>
      </div>
    </div>
  );
}
