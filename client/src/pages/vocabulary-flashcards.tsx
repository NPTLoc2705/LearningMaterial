import { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import vocabData from '../data/vocabulary.json';
import type { VocabularyItem, UnitFilter } from '../types/vocabulary';
import { FlashcardViewer } from '../components/vocabulary/FlashcardViewer';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { IconShuffle, IconRefresh, IconArrowLeft, IconAward } from '../components/ui/Icons';
import type { useProgress } from '../hooks/use-progress';
import { shuffleArray } from '../utils/quizGenerator';
import confetti from 'canvas-confetti';

const allVocab = vocabData as VocabularyItem[];

export interface VocabularyFlashcardsPageProps {
  progressHook: ReturnType<typeof useProgress>;
}

export function VocabularyFlashcardsPage({
  progressHook,
}: VocabularyFlashcardsPageProps) {
  const { progress, setWordStatus } = progressHook;

  const [unitFilter, setUnitFilter] = useState<UnitFilter>('all');
  const [onlyReview, setOnlyReview] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const deck = useMemo(() => {
    let items = allVocab.filter((v) => {
      if (unitFilter !== 'all' && v.unit !== unitFilter) return false;
      if (onlyReview) {
        const s = progress.words[v.id]?.status;
        return s === 'review';
      }
      return true;
    });

    if (isShuffled) {
      items = shuffleArray(items);
    }
    return items;
  }, [unitFilter, onlyReview, isShuffled, progress]);

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      try {
        confetti({ particleCount: 50, spread: 45, origin: { y: 0.7 } });
      } catch {
        // ignore
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
  };

  const currentItem = deck[currentIndex];
  const currentStatus = currentItem ? progress.words[currentItem.id]?.status || 'new' : 'new';

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8E7E4] pb-4">
        <div>
          <NavLink
            to="/vocabulary"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#9E9D97] hover:text-[#141413] transition-colors mb-1.5"
          >
            <IconArrowLeft size={12} />
            <span>Quay lại danh sách từ vựng</span>
          </NavLink>
          <h1 className="font-serif text-3xl font-normal text-[#141413]">
            Bộ Thẻ Ghi Nhớ
          </h1>
        </div>

        {/* Deck Filters & Shuffle */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#F4F3EF] p-1 rounded-lg">
            {(['all', 7, 8] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => {
                  setUnitFilter(u);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all touch-manipulation ${
                  unitFilter === u
                    ? 'bg-white text-[#141413] shadow-subtle font-semibold'
                    : 'text-[#6B6A66] hover:text-[#141413]'
                }`}
              >
                {u === 'all' ? 'Tất cả' : `Unit ${u}`}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setOnlyReview(!onlyReview);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all touch-manipulation ${
              onlyReview
                ? 'bg-[#FDEBEC] text-[#9F2F2D] border-[#FAD4D6] font-semibold'
                : 'bg-white text-[#6B6A66] border-[#E8E7E4] hover:bg-[#FBFBFA]'
            }`}
          >
            Chỉ từ cần ôn
          </button>

          <Button
            variant={isShuffled ? 'primary' : 'outline'}
            size="sm"
            onClick={() => {
              setIsShuffled(!isShuffled);
              setCurrentIndex(0);
            }}
            title="Xáo trộn thứ tự thẻ"
          >
            <IconShuffle size={13} />
            <span>Xáo trộn</span>
          </Button>
        </div>
      </div>

      {/* Main Flashcard View */}
      {deck.length > 0 ? (
        currentIndex < deck.length ? (
          <div className="space-y-4">
            <div className="w-full bg-[#E8E7E4] rounded-full h-1 overflow-hidden">
              <div
                className="bg-[#141413] h-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / deck.length) * 100}%`,
                }}
              />
            </div>

            <FlashcardViewer
              items={deck}
              currentIndex={currentIndex}
              onNext={handleNext}
              onPrev={handlePrev}
              status={currentStatus}
              onSetStatus={(newStatus) => {
                if (currentItem) {
                  setWordStatus(currentItem.id, newStatus);
                }
              }}
            />
          </div>
        ) : (
          <Card innerClassName="p-8 sm:p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EDF3EC] text-[#346538] mx-auto flex items-center justify-center">
              <IconAward size={24} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#141413]">Hoàn Thành Bộ Thẻ</h3>
            <p className="text-xs text-[#6B6A66] leading-relaxed">
              Bạn đã ôn tập xong toàn bộ {deck.length} thẻ từ vựng trong phần này.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" onClick={handleRestart}>
                <IconRefresh size={12} />
                <span>Học lại từ đầu</span>
              </Button>
              <NavLink to="/vocabulary/quiz">
                <Button variant="primary" size="sm">
                  Làm bài kiểm tra
                </Button>
              </NavLink>
            </div>
          </Card>
        )
      ) : (
        <Card innerClassName="p-12 text-center max-w-md mx-auto">
          <Badge variant="amber" size="sm" className="mb-3">
            CHƯA CÓ TỪ NÀO
          </Badge>
          <p className="font-serif text-sm text-[#141413]">
            {onlyReview
              ? 'Hiện tại không có từ nào được đánh dấu cần ôn lại trong Unit này.'
              : 'Không tìm thấy thẻ từ nào.'}
          </p>
          {onlyReview && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setOnlyReview(false)}
            >
              Xem tất cả từ vựng
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
