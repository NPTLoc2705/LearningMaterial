import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useGameSession } from '../../../hooks/use-game-session';
import { BigChoice } from '../../../components/kids/BigChoice';
import { SpeakerButton } from '../../../components/kids/SpeakerButton';
import { GentleFeedback } from '../../../components/kids/GentleFeedback';
import { StarBurst } from '../../../components/kids/StarBurst';
import { ProgressDots } from '../../../components/kids/ProgressDots';

export function ListenAndTapPictureActivity() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const classroomId = parseInt(searchParams.get('classroomId') || '0', 10);
  const lessonId = parseInt(id || '0', 10);
  const navigate = useNavigate();

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

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    if (lessonId && classroomId) {
      start(lessonId, classroomId, 'VocabListenPickPicture');
    }
  }, [lessonId, classroomId, start]);

  const handleSelect = async (key: string) => {
    if (isSubmitting || feedback) return;
    setSelectedKey(key);
    await submitAnswer(key);
  };

  const handleNext = () => {
    setSelectedKey(null);
    nextQuestion();
  };

  if (isLoading && !session) {
    return <div className="p-8 text-center text-gray-500 font-bold">Đang tải trò chơi...</div>;
  }

  if (error && !session) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-red-600 font-bold">{error}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-200 rounded-xl font-bold">
          Quay lại
        </button>
      </div>
    );
  }

  if (isCompleted && result) {
    return (
      <div className="max-w-md mx-auto p-6 text-center space-y-6">
        <StarBurst stars={result.stars ?? 3} />
        <p className="text-gray-700 font-bold text-lg">
          Bạn trả lời đúng {result.correct} / {result.total} câu!
        </p>
        <button
          onClick={() => navigate(`/student/lessons/${lessonId}?classroomId=${classroomId}`)}
          className="w-full min-h-[56px] py-3 bg-emerald-600 text-white font-extrabold text-xl rounded-2xl shadow-lg hover:bg-emerald-700"
        >
          Trở về bài học
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col items-center justify-between min-h-[85vh] space-y-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
          ✕
        </button>
        <ProgressDots total={questions.length} current={currentIndex} />
        <span className="text-xs font-bold text-gray-400">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      {/* Audio Prompt */}
      <div className="flex flex-col items-center justify-center space-y-2 py-4">
        <p className="text-sm font-extrabold text-gray-500 tracking-wider uppercase">Nghe và chọn hình đúng</p>
        {currentQuestion.speakText && (
          <SpeakerButton text={currentQuestion.speakText} size="lg" autoPlay={true} />
        )}
      </div>

      {/* Picture Options Grid (375px mobile friendly) */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {currentQuestion.options.map((option) => (
          <BigChoice
            key={option.key}
            choiceKey={option.key}
            imageKey={option.imageKey}
            text={option.text}
            disabled={isSubmitting || feedback !== null}
            isSelected={selectedKey === option.key}
            isCorrect={feedback ? feedback.isCorrect : null}
            onClick={handleSelect}
          />
        ))}
      </div>

      {/* Feedback banner */}
      {feedback && (
        <GentleFeedback
          isCorrect={feedback.isCorrect === true}
          correctAnswer={feedback.correctAnswer}
          explanation={feedback.explanation}
          speakText={feedback.speakText}
          onNext={handleNext}
        />
      )}
    </div>
  );
}

