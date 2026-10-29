import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SignedMediaImage } from '../../components/common/SignedMediaImage';
import { KidActionButton } from '../../components/kids/KidActionButton';
import { KidLessonHubView } from '../../components/kids/KidLessonHubView';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useStudentLessonHub } from '../../hooks/use-student-lesson-hub';

const SENIOR_ACTIVITY_LABELS: Record<string, { icon: string; label: string }> = {
  VocabLookListenRepeat: { icon: '🔊', label: 'Nghe & Lặp lại từ vựng' },
  VocabListenChoose: { icon: '🖼️', label: 'Nghe & Chọn tranh đúng' },
  VocabListenPickPicture: { icon: '🖼️', label: 'Nghe & Chọn tranh đúng' },
  VocabPictureWordMatch: { icon: '🧩', label: 'Nối tranh với từ vựng' },
  VocabWordScramble: { icon: '🔤', label: 'Sắp xếp chữ cái' },
  GrammarGuidedPractice: { icon: '📝', label: 'Luyện tập ngữ pháp' },
  GrammarMiniTest: { icon: '📋', label: 'Bài kiểm tra ngữ pháp' },
};

export function StudentLessonHubPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const classroomId = parseInt(searchParams.get('classroomId') || '0', 10);
  const navigate = useNavigate();
  const lessonId = Number(id);
  const { hub, isLoading, error } = useStudentLessonHub(lessonId);

  if (isLoading) {
    return (
      <div className="py-12 text-center font-mono text-xs text-[#9E9D97] animate-pulse">
        Loading lesson...
      </div>
    );
  }

  if (!hub) {
    return (
      <Card innerClassName="p-8 text-center space-y-4">
        <p className="text-sm text-[#9F2F2D]">
          {error ?? 'Lesson not found.'}
        </p>
        <KidActionButton
          variant="secondary"
          icon="⬅️"
          onClick={() => navigate('/student')}
        >
          Back
        </KidActionButton>
      </Card>
    );
  }

  if (hub.levelGroup === 'Young') {
    return (
      <KidLessonHubView
        hub={hub}
        classroomId={classroomId}
        onBack={() => navigate('/student')}
      />
    );
  }

  const enabledActivities = hub.levelSettings.enabledActivities;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => navigate('/student')}
            className="font-mono text-xs text-[#6B6A66] hover:text-[#141413]"
          >
            ← Quay lại danh sách bài học
          </button>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant="blue" size="sm">
              {hub.levelDisplayName}
            </Badge>
            <span className="font-mono text-xs text-[#6B6A66]">
              Unit {hub.unitNo}
              {hub.unitTitle ? `: ${hub.unitTitle}` : ''} · Lesson {hub.lessonNo}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141413]">
            {hub.title}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          {enabledActivities.map((code) => {
            const meta = SENIOR_ACTIVITY_LABELS[code] ?? {
              icon: '⭐',
              label: code,
            };
            return (
              <Button key={code} size="sm" variant="outline" disabled>
                {meta.icon} {meta.label}
              </Button>
            );
          })}
        </div>
      </div>

      {hub.grammarTopicCount > 0 && (
        <Card innerClassName="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-700 font-bold">
              Chuyên đề ngữ pháp
            </span>
            <h3 className="font-serif text-lg font-bold text-gray-900">
              Ngữ pháp bài học ({hub.grammarTopicCount} chủ đề)
            </h3>
            <p className="text-xs text-gray-600">
              Quy trình học chuẩn: Lý thuyết ➔ Luyện tập ➔ Bài kiểm tra ngắn (Đạt ≥ 70%) ➔ Xem lại.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() =>
              navigate(
                `/student/lessons/${hub.lessonId}/grammar?classroomId=${classroomId}`
              )
            }
            className="shrink-0 font-bold"
          >
            Bắt đầu học ngữ pháp ➔
          </Button>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {hub.vocabulary.map((item) => (
          <Card key={item.id} innerClassName="p-4 flex items-start gap-3.5">
            <SignedMediaImage
              imageKey={item.imageKey}
              alt={item.word}
              className="w-16 h-16 rounded-xl object-cover border border-[#E8E7E4] bg-[#F4F3EF] shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-semibold text-[#141413]">
                  {item.word}
                </h3>
                {item.partOfSpeech && (
                  <span className="font-mono text-[11px] text-[#6B6A66]">
                    ({item.partOfSpeech})
                  </span>
                )}
              </div>
              {item.meaningVi && (
                <p className="text-xs font-medium text-[#141413]">
                  {item.meaningVi}
                </p>
              )}
              {item.exampleEn && (
                <p className="text-xs text-[#6B6A66] italic">
                  {item.exampleEn}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default StudentLessonHubPage;
