import React, { useState } from 'react';
import type { VocabularyItem } from '../../types/vocabulary';
import type { WordLearningStatus } from '../../types/progress';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  IconChevronLeft,
  IconChevronRight,
  IconVolume,
  IconRefresh,
  IconCheck,
  IconInfo,
} from '../ui/Icons';
import { FormattedText } from '../ui/FormattedText';
import { useKeyboardNav } from '../../hooks/use-keyboard-nav';

export interface FlashcardViewerProps {
  items: VocabularyItem[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  status: WordLearningStatus;
  onSetStatus: (status: WordLearningStatus) => void;
}

const STATUS_LABELS: Record<WordLearningStatus, string> = {
  known: 'ĐÃ THUỘC',
  review: 'CẦN ÔN',
  learning: 'ĐANG HỌC',
  new: 'MỚI',
};

export function FlashcardViewer({
  items,
  currentIndex,
  onNext,
  onPrev,
  status,
  onSetStatus,
}: FlashcardViewerProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const currentItem = items[currentIndex];

  const handleFlip = () => setIsFlipped((prev) => !prev);

  const handleNextCard = () => {
    setIsFlipped(false);
    onNext();
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    onPrev();
  };

  const handleMarkReview = () => {
    onSetStatus('review');
    handleNextCard();
  };

  const handleMarkKnown = () => {
    onSetStatus('known');
    handleNextCard();
  };

  useKeyboardNav({
    onFlip: handleFlip,
    onNext: handleNextCard,
    onPrev: handlePrevCard,
    onMarkReview: handleMarkReview,
    onMarkKnown: handleMarkKnown,
  });

  const speakWord = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window && currentItem) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentItem.word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!currentItem) {
    return (
      <div className="text-center py-16">
        <p className="text-[#6B6A66] font-serif text-lg">
          Không có thẻ từ nào phù hợp với bộ lọc hiện tại.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center w-full">
      {/* Top indicator */}
      <div className="w-full flex items-center justify-between text-xs text-[#9E9D97] font-mono mb-3 px-1">
        <span>
          THẺ {currentIndex + 1} / {items.length}
        </span>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[#B5B4AE]">
            [Phím cách] Lật thẻ · [1] Cần ôn · [2] Đã thuộc
          </span>
          <Badge
            variant={
              status === 'known'
                ? 'green'
                : status === 'review'
                ? 'red'
                : 'slate'
            }
            size="sm"
          >
            {STATUS_LABELS[status]}
          </Badge>
        </div>
      </div>

      {/* 3D Flashcard Container with double-bezel framing */}
      <div
        className="w-full h-84 sm:h-96 perspective-1000 cursor-pointer select-none touch-manipulation"
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-label="Thẻ ghi nhớ từ vựng. Chạm hoặc bấm phím cách để lật xem nghĩa"
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleFlip();
          }
        }}
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform rounded-[1.25rem] ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT */}
          <div className="absolute inset-0 backface-hidden bg-[#F6F5F2] border border-[#E8E7E4] p-2 rounded-[1.25rem] shadow-subtle">
            <div className="w-full h-full bg-white border border-[#EFEFEA] rounded-[1rem] p-6 sm:p-8 flex flex-col justify-between items-center text-center">
              <div className="w-full flex items-center justify-between">
                <Badge variant="slate" size="sm">
                  Unit {currentItem.unit}
                </Badge>
                {currentItem.partOfSpeech && (
                  <Badge variant="slate" size="sm">
                    {currentItem.partOfSpeech}
                  </Badge>
                )}
              </div>

              <div className="my-auto space-y-2">
                <div className="flex items-center justify-center gap-2.5">
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#141413]">
                    {currentItem.word}
                  </h2>
                  <button
                    type="button"
                    onClick={speakWord}
                    className="p-1.5 text-[#9E9D97] hover:text-[#141413] transition-colors rounded-md touch-manipulation"
                    title="Phát âm từ vựng"
                    aria-label={`Phát âm từ ${currentItem.word}`}
                  >
                    <IconVolume size={18} />
                  </button>
                </div>

                {currentItem.synonym && (
                  <p className="font-mono text-xs text-[#6B6A66]">
                    Từ đồng nghĩa: <span className="text-[#141413] font-semibold">{currentItem.synonym}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-[#9E9D97]">
                <IconRefresh size={12} />
                <span>Chạm hoặc bấm Phím cách để lật</span>
              </div>
            </div>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#F6F5F2] border border-[#E8E7E4] p-2 rounded-[1.25rem] shadow-subtle">
            <div className="w-full h-full bg-white border border-[#EFEFEA] rounded-[1rem] p-6 sm:p-8 flex flex-col justify-between items-center text-center overflow-y-auto">
              <div className="w-full flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D97]">
                  Định nghĩa &amp; Ngữ cảnh
                </span>
                <Badge variant="slate" size="sm">
                  Unit {currentItem.unit}
                </Badge>
              </div>

              <div className="my-auto space-y-4 max-w-md w-full">
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141413]">
                  {currentItem.meaningVi}
                </h3>

                {currentItem.example && (
                  <div className="p-3 bg-[#FBFBFA] rounded-lg border border-[#E8E7E4] text-left space-y-1">
                    <p className="font-serif italic text-xs sm:text-sm text-[#141413]">
                      "{currentItem.example.sentenceEn}"
                    </p>
                    {currentItem.example.sentenceVi && (
                      <p className="text-xs text-[#9E9D97]">
                        {currentItem.example.sentenceVi}
                      </p>
                    )}
                  </div>
                )}

                {currentItem.notes && (
                  <div className="p-2.5 bg-[#FBF3DB] rounded-lg border border-[#F5E6BF] text-left flex items-start gap-2 text-xs text-[#956400]">
                    <IconInfo size={14} className="flex-shrink-0 mt-0.5" />
                    <FormattedText text={currentItem.notes} />
                  </div>
                )}
              </div>

              <div className="font-mono text-[11px] text-[#9E9D97]">
                Chạm để lật lại mặt trước
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls with touch-friendly spacing */}
      <div className="w-full mt-6 flex items-center justify-between gap-2 sm:gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevCard}
          disabled={currentIndex === 0}
          className="touch-manipulation"
        >
          <IconChevronLeft size={14} />
          <span>Trước</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant={status === 'review' ? 'danger' : 'outline'}
            size="sm"
            onClick={handleMarkReview}
            className="touch-manipulation"
          >
            <IconRefresh size={12} />
            <span>Cần ôn (1)</span>
          </Button>

          <Button
            variant={status === 'known' ? 'success' : 'primary'}
            size="sm"
            onClick={handleMarkKnown}
            className="touch-manipulation"
          >
            <IconCheck size={12} />
            <span>Đã thuộc (2)</span>
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNextCard}
          disabled={currentIndex === items.length - 1}
          className="touch-manipulation"
        >
          <span>Sau</span>
          <IconChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}
