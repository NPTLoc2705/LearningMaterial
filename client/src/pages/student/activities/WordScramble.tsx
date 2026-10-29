import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useGameSession } from '../../../hooks/use-game-session';
import { GentleFeedback } from '../../../components/kids/GentleFeedback';
import { StarBurst } from '../../../components/kids/StarBurst';
import { ProgressDots } from '../../../components/kids/ProgressDots';
import { SignedMediaImage } from '../../../components/common/SignedMediaImage';

interface PlacedTile {
  key: string;
  letter: string;
}

export function WordScrambleActivity() {
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

  const [availableKeys, setAvailableKeys] = useState<string[]>([]);
  const [placedTiles, setPlacedTiles] = useState<PlacedTile[]>([]);
  const [prevQuestionId, setPrevQuestionId] = useState<number | null>(null);

  useEffect(() => {
    if (lessonId && classroomId) {
      start(lessonId, classroomId, 'VocabWordScramble');
    }
  }, [lessonId, classroomId, start]);

  if (currentQuestion && currentQuestion.id !== prevQuestionId) {
    setPrevQuestionId(currentQuestion.id);
    setAvailableKeys(currentQuestion.options.map((o) => o.key));
    setPlacedTiles([]);
  }

  const handleTileTap = (key: string, letter: string) => {
    if (feedback || isSubmitting) return;
    setAvailableKeys((prev) => prev.filter((k) => k !== key));
    setPlacedTiles((prev) => [...prev, { key, letter }]);
  };

  const handleRemoveTile = (tile: PlacedTile) => {
    if (feedback || isSubmitting) return;
    setPlacedTiles((prev) => prev.filter((t) => t.key !== tile.key));
    setAvailableKeys((prev) => [...prev, tile.key]);
  };

  const handleReset = () => {
    if (currentQuestion && !feedback) {
      setAvailableKeys(currentQuestion.options.map((o) => o.key));
      setPlacedTiles([]);
    }
  };

  const handleSubmit = async () => {
    if (feedback || isSubmitting) return;
    const typedWord = placedTiles.map((t) => t.letter).join('');
    await submitAnswer(typedWord);
  };

  const handleNext = () => {
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

  const allPlaced = availableKeys.length === 0 && placedTiles.length > 0;

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

      {/* Prompt */}
      <div className="text-center space-y-2">
        <p className="text-sm font-extrabold text-gray-500 tracking-wider">
          {currentQuestion.prompt}
        </p>
        {currentQuestion.imageKey && (
          <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden bg-white border-2 border-amber-300 shadow-md flex items-center justify-center">
            <SignedMediaImage
              imageKey={currentQuestion.imageKey}
              alt="Word hint"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Placed Word Target Slots */}
      <div className="w-full flex flex-wrap items-center justify-center gap-2 p-3 min-h-[72px] bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl">
        {placedTiles.length === 0 ? (
          <span className="text-xs font-bold text-amber-600/70">Chạm các chữ cái bên dưới để ghép từ</span>
        ) : (
          placedTiles.map((tile) => (
            <button
              key={tile.key}
              type="button"
              onClick={() => handleRemoveTile(tile)}
              className="w-12 h-14 bg-white border-2 border-amber-400 shadow-md rounded-xl text-2xl font-extrabold text-gray-800 flex items-center justify-center active:scale-95 transition"
            >
              {tile.letter}
            </button>
          ))
        )}
      </div>

      {/* Scrambled Letter Tiles */}
      <div className="flex flex-wrap items-center justify-center gap-2 w-full py-2">
        {currentQuestion.options.map((opt) => {
          const isUsed = !availableKeys.includes(opt.key);
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleTileTap(opt.key, opt.text || '')}
              disabled={isUsed || feedback !== null}
              className={`w-14 h-16 rounded-2xl text-2xl font-black shadow-md flex items-center justify-center border-2 transition-all ${
                isUsed
                  ? 'opacity-20 border-gray-200 bg-gray-100 cursor-not-allowed'
                  : 'bg-gradient-to-b from-amber-200 to-amber-300 border-amber-400 text-amber-950 hover:brightness-105 active:scale-90'
              }`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {/* Action / Feedback controls */}
      {!feedback ? (
        <div className="flex gap-2 w-full">
          <button
            type="button"
            onClick={handleReset}
            disabled={placedTiles.length === 0}
            className="px-4 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl text-sm disabled:opacity-30"
          >
            Làm lại
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allPlaced || isSubmitting}
            className="flex-1 py-3 bg-emerald-600 text-white font-extrabold text-lg rounded-xl shadow hover:bg-emerald-700 disabled:opacity-40 transition active:scale-98"
          >
            Kiểm tra
          </button>
        </div>
      ) : (
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
