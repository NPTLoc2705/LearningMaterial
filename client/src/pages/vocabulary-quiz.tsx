import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import vocabData from '../data/vocabulary.json';
import type { VocabularyItem, UnitFilter } from '../types/vocabulary';
import {
  generateVocabQuestions,
  type VocabQuizQuestion,
} from '../utils/quizGenerator';
import { MultipleChoiceQuestion } from '../components/vocabulary/MultipleChoiceQuestion';
import { TypingQuestion } from '../components/vocabulary/TypingQuestion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  IconRefresh,
  IconAward,
  IconCards,
  IconArrowLeft,
} from '../components/ui/Icons';
import type { useProgress } from '../hooks/use-progress';

const allVocab = vocabData as VocabularyItem[];

export interface VocabularyQuizPageProps {
  progressHook: ReturnType<typeof useProgress>;
}

export function VocabularyQuizPage({ progressHook }: VocabularyQuizPageProps) {
  const { recordQuizResult } = progressHook;

  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizMode, setQuizMode] = useState<'multiple-choice' | 'typing'>('multiple-choice');
  const [selectedUnit, setSelectedUnit] = useState<UnitFilter>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);

  const [questions, setQuestions] = useState<VocabQuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const startQuiz = () => {
    const pool = allVocab.filter((v) => {
      if (selectedUnit === 'all') return true;
      return v.unit === selectedUnit;
    });

    const generated = generateVocabQuestions(pool, quizMode, questionCount);
    setQuestions(generated);
    setCurrentIdx(0);
    setScore(0);
    setIsCompleted(false);
    setIsQuizActive(true);
  };

  const handleAnswerQuestion = (isCorrect: boolean) => {
    const activeQuestion = questions[currentIdx];
    if (activeQuestion) {
      recordQuizResult(activeQuestion.wordId, isCorrect);
    }

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      const finalScore = isCorrect ? score + 1 : score;
      if (finalScore >= Math.ceil(questions.length * 0.8)) {
        import('canvas-confetti')
          .then(({ default: confetti }) => {
            confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
          })
          .catch(() => {
            // ignore
          });
      }
    }
  };

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="border-b border-[#E8E7E4] pb-4">
        <NavLink
          to="/vocabulary"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#9E9D97] hover:text-[#141413] transition-colors mb-1.5"
        >
          <IconArrowLeft size={12} />
          <span>Quay lại danh sách từ vựng</span>
        </NavLink>
        <h1 className="font-serif text-3xl font-normal text-[#141413]">
          Luyện Tập &amp; Kiểm Tra Từ Vựng
        </h1>
      </div>

      {!isQuizActive ? (
        /* Configuration */
        <Card innerClassName="p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#EFEFEA] pb-3">
            <h2 className="font-serif text-xl font-semibold text-[#141413]">
              Cấu hình bài luyện tập
            </h2>
            <p className="text-xs text-[#6B6A66] mt-0.5">
              Lựa chọn hình thức kiểm tra và phạm vi bài học phù hợp.
            </p>
          </div>

          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="font-mono text-[11px] uppercase tracking-wider text-[#9E9D97] block">
              Hình thức bài tập:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setQuizMode('multiple-choice')}
                className={`p-4 rounded-lg border text-left transition-all touch-manipulation ${
                  quizMode === 'multiple-choice'
                    ? 'border-[#141413] bg-[#F6F5F2]'
                    : 'border-[#E8E7E4] bg-white hover:bg-[#FBFBFA]'
                }`}
              >
                <span className="font-serif font-bold text-[#141413] text-sm block">
                  Trắc nghiệm 4 đáp án
                </span>
                <span className="text-xs text-[#6B6A66] mt-1 block">
                  Chọn định nghĩa tiếng Việt tương ứng với từ vựng tiếng Anh.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setQuizMode('typing')}
                className={`p-4 rounded-lg border text-left transition-all touch-manipulation ${
                  quizMode === 'typing'
                    ? 'border-[#141413] bg-[#F6F5F2]'
                    : 'border-[#E8E7E4] bg-white hover:bg-[#FBFBFA]'
                }`}
              >
                <span className="font-serif font-bold text-[#141413] text-sm block">
                  Luyện gõ từ vựng
                </span>
                <span className="text-xs text-[#6B6A66] mt-1 block">
                  Gõ chính xác từ tiếng Anh dựa theo nghĩa tiếng Việt và câu ví dụ.
                </span>
              </button>
            </div>
          </div>

          {/* Unit Scope */}
          <div className="space-y-2">
            <label className="font-mono text-[11px] uppercase tracking-wider text-[#9E9D97] block">
              Phạm vi bài học:
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {(['all', 7, 8] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setSelectedUnit(u)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all touch-manipulation ${
                    selectedUnit === u
                      ? 'bg-[#141413] text-white border-[#141413]'
                      : 'bg-white text-[#6B6A66] border-[#E8E7E4] hover:bg-[#FBFBFA]'
                  }`}
                >
                  {u === 'all' ? 'Tất cả (58 từ)' : `Unit ${u}`}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <div className="space-y-2">
            <label className="font-mono text-[11px] uppercase tracking-wider text-[#9E9D97] block">
              Số lượng câu:
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-all touch-manipulation ${
                    questionCount === num
                      ? 'bg-[#141413] text-white border-[#141413]'
                      : 'bg-white text-[#6B6A66] border-[#E8E7E4] hover:bg-[#FBFBFA]'
                  }`}
                >
                  {num} câu
                </button>
              ))}
            </div>
          </div>

          <Button variant="primary" size="md" fullWidth onClick={startQuiz} className="touch-manipulation">
            Bắt đầu làm bài
          </Button>
        </Card>
      ) : isCompleted ? (
        /* Results */
        <Card innerClassName="p-8 sm:p-12 text-center space-y-5 animate-scale-up">
          <div className="w-12 h-12 rounded-xl bg-[#EDF3EC] text-[#346538] mx-auto flex items-center justify-center">
            <IconAward size={24} />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-3xl font-bold text-[#141413]">Hoàn Thành Bài Luyện</h2>
            <p className="text-xs text-[#6B6A66]">
              Kết quả làm bài đã được tự động lưu vào tiến độ học tập của bạn.
            </p>
          </div>

          <div className="p-4 bg-[#FBFBFA] rounded-xl border border-[#E8E7E4] max-w-xs mx-auto">
            <span className="font-mono text-[10px] text-[#9E9D97] uppercase">Độ chính xác</span>
            <div className="font-serif text-4xl font-bold text-[#141413] my-1">
              {score} / {questions.length}
            </div>
            <Badge
              variant={score / questions.length >= 0.8 ? 'green' : 'amber'}
              size="md"
            >
              {Math.round((score / questions.length) * 100)}% ĐIỂM SỐ
            </Badge>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsQuizActive(false)} className="touch-manipulation">
              <IconRefresh size={12} />
              <span>Làm bài khác</span>
            </Button>
            <NavLink to="/vocabulary/flashcards">
              <Button variant="secondary" size="sm" className="touch-manipulation">
                <IconCards size={12} />
                <span>Ôn lại với Flashcard</span>
              </Button>
            </NavLink>
          </div>
        </Card>
      ) : (
        /* Question screen */
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-[#9E9D97] px-1">
            <span>
              CÂU {currentIdx + 1} / {questions.length}
            </span>
            <button
              type="button"
              onClick={() => setIsQuizActive(false)}
              className="hover:text-[#9F2F2D] transition-colors touch-manipulation"
            >
              Thoát bài
            </button>
          </div>

          <div className="w-full bg-[#E8E7E4] rounded-full h-1 overflow-hidden">
            <div
              className="bg-[#141413] h-full transition-all duration-300"
              style={{
                width: `${((currentIdx + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          {currentQ.mode === 'multiple-choice' ? (
            <MultipleChoiceQuestion
              key={currentQ.id}
              question={currentQ}
              onAnswer={handleAnswerQuestion}
            />
          ) : (
            <TypingQuestion
              key={currentQ.id}
              question={currentQ}
              onAnswer={handleAnswerQuestion}
            />
          )}
        </div>
      )}
    </div>
  );
}
