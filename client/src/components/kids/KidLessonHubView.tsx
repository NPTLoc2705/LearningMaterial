import type { StudentLessonHubDto } from '../../types/api';
import { KidActionButton } from './KidActionButton';
import { KidVocabularyCard } from './KidVocabularyCard';

const YOUNG_ACTIVITY_LABELS: Record<string, { icon: string; label: string }> = {
  VocabLookListenRepeat: { icon: '🔊', label: 'Listen & Say' },
  VocabListenChoose: { icon: '🖼️', label: 'Pick the Picture' },
  VocabListenPickPicture: { icon: '🖼️', label: 'Pick the Picture' },
  VocabPictureWordMatch: { icon: '🧩', label: 'Match Words' },
};

export interface KidLessonHubViewProps {
  hub: StudentLessonHubDto;
  onBack: () => void;
}

export function KidLessonHubView({ hub, onBack }: KidLessonHubViewProps) {
  const enabledActivities = hub.levelSettings.enabledActivities;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <KidActionButton variant="secondary" icon="⬅️" onClick={onBack}>
          Back
        </KidActionButton>
        <span className="font-mono text-xs uppercase tracking-wider text-[#6B6A66]">
          Unit {hub.unitNo} · Lesson {hub.lessonNo}
        </span>
      </div>

      <div className="rounded-3xl border-2 border-[#E8E7E4] bg-white p-6 text-center space-y-2 shadow-subtle">
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#141413]">
          {hub.title}
        </h1>
        <p className="text-sm text-[#6B6A66]">
          {hub.vocabularyCount} words to explore 🌟
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {enabledActivities.map((code) => {
          const meta = YOUNG_ACTIVITY_LABELS[code] ?? {
            icon: '⭐',
            label: code,
          };
          return (
            <KidActionButton
              key={code}
              icon={meta.icon}
              variant="primary"
              fullWidth
              disabled
            >
              {meta.label}
            </KidActionButton>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {hub.vocabulary.map((item) => (
          <KidVocabularyCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
