import { useNavigate } from 'react-router-dom';
import type { StudentLessonHubDto } from '../../types/api';
import { KidActionButton } from './KidActionButton';
import { KidVocabularyCard } from './KidVocabularyCard';

const YOUNG_ACTIVITY_LABELS: Record<string, { icon: string; label: string; path: string }> = {
  VocabLookListenRepeat: { icon: '🗣️', label: 'Listen & Say', path: 'look-listen-repeat' },
  VocabListenChoose: { icon: '🖼️', label: 'Pick the Picture', path: 'listen-pick-picture' },
  VocabListenPickPicture: { icon: '🖼️', label: 'Pick the Picture', path: 'listen-pick-picture' },
  VocabPictureWordMatch: { icon: '🧩', label: 'Match Words', path: 'picture-word-match' },
  VocabWordScramble: { icon: '🔤', label: 'Word Scramble', path: 'word-scramble' },
  GrammarUsagePractice: { icon: '💬', label: 'Luyện mẫu câu', path: 'grammar-usage-practice' },
};

export interface KidLessonHubViewProps {
  hub: StudentLessonHubDto;
  classroomId?: number;
  onBack: () => void;
}

export function KidLessonHubView({ hub, classroomId, onBack }: KidLessonHubViewProps) {
  const navigate = useNavigate();
  const enabledActivities = hub.levelSettings.enabledActivities;

  const handleLaunch = (code: string) => {
    const meta = YOUNG_ACTIVITY_LABELS[code];
    if (meta?.path) {
      const cId = classroomId ? `?classroomId=${classroomId}` : '';
      navigate(`/student/lessons/${hub.lessonId}/${meta.path}${cId}`);
    }
  };

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
            path: '',
          };
          return (
            <KidActionButton
              key={code}
              icon={meta.icon}
              variant="primary"
              fullWidth
              onClick={() => handleLaunch(code)}
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
