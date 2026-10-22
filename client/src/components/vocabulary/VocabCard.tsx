import type { VocabularyItem } from '../../types/vocabulary';
import type { WordLearningStatus } from '../../types/progress';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { IconVolume, IconCheck, IconRefresh, IconInfo } from '../ui/Icons';
import { FormattedText } from '../ui/FormattedText';

export interface VocabCardProps {
  item: VocabularyItem;
  status: WordLearningStatus;
  onSetStatus: (status: WordLearningStatus) => void;
}

export function VocabCard({ item, status, onSetStatus }: VocabCardProps) {
  const speakWord = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(item.word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const statusBadgeConfig = {
    known: { variant: 'green' as const, label: 'ĐÃ THUỘC' },
    review: { variant: 'red' as const, label: 'CẦN ÔN' },
    learning: { variant: 'blue' as const, label: 'ĐANG HỌC' },
    new: { variant: 'slate' as const, label: 'MỚI' },
  };

  const currentBadge = statusBadgeConfig[status];

  return (
    <Card hoverable innerClassName="p-5 flex flex-col justify-between h-full">
      <div>
        {/* Header tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="slate" size="sm">
              Unit {item.unit}
            </Badge>
            {item.partOfSpeech && (
              <Badge variant="slate" size="sm">
                {item.partOfSpeech}
              </Badge>
            )}
            {item.synonym && (
              <Badge variant="blue" size="sm">
                ={item.synonym}
              </Badge>
            )}
          </div>
          <Badge variant={currentBadge.variant} size="sm">
            {currentBadge.label}
          </Badge>
        </div>

        {/* Word and audio button */}
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <h3 className="font-serif text-2xl font-bold tracking-tight text-[#141413]">
            {item.word}
          </h3>
          <button
            type="button"
            onClick={speakWord}
            className="p-1.5 text-[#9E9D97] hover:text-[#141413] transition-colors rounded-md touch-manipulation"
            title="Phát âm từ vựng"
            aria-label={`Phát âm từ ${item.word}`}
          >
            <IconVolume size={16} />
          </button>
        </div>

        {/* Meaning in Vietnamese */}
        <p className="text-sm font-normal text-[#141413] mb-4 leading-relaxed">
          {item.meaningVi}
        </p>

        {/* Verbatim Example */}
        {item.example && (
          <div className="p-3 bg-[#FBFBFA] rounded-lg border border-[#E8E7E4] text-xs text-[#6B6A66] mb-3 space-y-1">
            <p className="font-serif italic text-[#141413] text-[13px] leading-snug">
              "{item.example.sentenceEn}"
            </p>
            {item.example.sentenceVi && (
              <p className="text-[#9E9D97]">{item.example.sentenceVi}</p>
            )}
          </div>
        )}

        {/* Context Note (e.g. Border vs Boundary) */}
        {item.notes && (
          <div className="p-2.5 bg-[#FBF3DB] rounded-lg border border-[#F5E6BF] text-xs text-[#956400] flex items-start gap-2 mb-3">
            <IconInfo size={14} className="flex-shrink-0 mt-0.5" />
            <FormattedText text={item.notes} className="leading-relaxed" />
          </div>
        )}
      </div>

      {/* Action buttons with touch targets */}
      <div className="pt-3 border-t border-[#EFEFEA] flex items-center justify-between gap-2">
        <Button
          variant={status === 'review' ? 'danger' : 'outline'}
          size="sm"
          className="flex-1"
          onClick={() => onSetStatus(status === 'review' ? 'new' : 'review')}
          title="Đánh dấu cần ôn lại"
        >
          <IconRefresh size={12} />
          <span>{status === 'review' ? 'Đang ôn' : 'Cần ôn lại'}</span>
        </Button>

        <Button
          variant={status === 'known' ? 'success' : 'secondary'}
          size="sm"
          className="flex-1"
          onClick={() => onSetStatus(status === 'known' ? 'new' : 'known')}
          title="Đánh dấu đã thuộc"
        >
          <IconCheck size={12} />
          <span>{status === 'known' ? 'Đã thuộc' : 'Đánh dấu thuộc'}</span>
        </Button>
      </div>
    </Card>
  );
}
