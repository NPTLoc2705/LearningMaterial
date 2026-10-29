import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useGameSession } from '../../../hooks/use-game-session';
import { BigChoice } from '../../../components/kids/BigChoice';
import { SpeakerButton } from '../../../components/kids/SpeakerButton';
import { GentleFeedback } from '../../../components/kids/GentleFeedback';
import { StarBurst } from '../../../components/kids/StarBurst';
import { ProgressDots } from '../../../components/kids/ProgressDots';

export function GrammarUsagePracticeActivity() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const classroomId = parseInt(searchParams.get('classroomId') || '0', 10);
  const paramLessonId = parseInt(searchParams.get('lessonId') || '0', 10);
  const lessonId = parseInt(id || '0', 10) || paramLessonId;
  const grammarTopicId = searchParams.get('grammarTopicId')
    ? parseInt(searchParams.get('grammarTopicId')!, 10)
    : searchParams.get('topicId')
    ? parseInt(searchParams.get('topicId')!, 10)
    : undefined;

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
      start(
        lessonId,
        classroomId,
        'GrammarUsagePractice',
        undefined,
        grammarTopicId
      );
    }
  }, [lessonId, classroomId, grammarTopicId, start]);

  const handleSelect = async (key: string) => {
    if (isSubmitting || feedback) return;
    setSelectedKey(key);
    await submitAnswer(key);
  };

  const handleNext = () => {
    setSelectedKey(null);
    nextQuestion();
  };

  if (!lessonId || !classroomId) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto">
        <p className="text-gray-600 font-bold">Please select a lesson to start grammar practice.</p>
        <button
          onClick={() => navigate(-1)}
          className="min-h-[64px] px-8 py-3 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 active:scale-95 transition"
          style={{ touchAction: 'manipulation' }}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isLoading && !session) {
    return (
      <div className="p-8 text-center text-amber-600 font-extrabold text-lg animate-pulse">
        Loading game... 🌟
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto">
        <p className="text-red-600 font-bold">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="min-h-[64px] px-8 py-3 bg-gray-200 rounded-2xl font-bold text-gray-800"
          style={{ touchAction: 'manipulation' }}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isCompleted && result) {
    return (
      <div className="max-w-md mx-auto p-6 text-center space-y-6">
        <StarBurst stars={result.stars ?? 3} />
        <p className="text-gray-700 font-bold text-lg">
          You got {result.correct} / {result.total} correct! 🎉
        </p>
        <button
          onClick={() =>
            navigate(`/student/lessons/${lessonId}?classroomId=${classroomId}`)
          }
          className="w-full min-h-[64px] py-4 bg-emerald-600 text-white font-extrabold text-xl rounded-2xl shadow-lg hover:bg-emerald-700 active:scale-95 transition"
          style={{ touchAction: 'manipulation' }}
        >
          Back to Lesson 🌟
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col items-center justify-between min-h-[85vh] space-y-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-600 text-2xl font-bold"
          style={{ touchAction: 'manipulation' }}
          aria-label="Back"
        >
          ✕
        </button>
        <ProgressDots total={questions.length} current={currentIndex} />
        <span className="text-xs font-extrabold text-amber-500">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      {/* Prompt / Speaker */}
      <div className="flex flex-col items-center justify-center space-y-3 py-2 text-center">
        <p className="text-xs font-black text-amber-600 tracking-wider uppercase">
          Choose the right answer
        </p>

        <h2 className="text-xl sm:text-2xl font-black text-gray-900 px-4">
          {currentQuestion.prompt}
        </h2>

        {(currentQuestion.speakText || currentQuestion.prompt) && (
          <SpeakerButton
            text={currentQuestion.speakText || currentQuestion.prompt}
            size="lg"
            autoPlay={true}
          />
        )}
      </div>

      {/* Choices Grid (Tap targets >= 64px) */}
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

      {/* Gentle feedback banner (cheer + continue button) */}
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

export default GrammarUsagePracticeActivity;
