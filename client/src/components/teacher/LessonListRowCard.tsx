import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { LessonDto, LessonStatus } from '../../types/api';

const STATUS_BADGE_MAP: Record<
  LessonStatus,
  { label: string; variant: 'amber' | 'green' | 'slate' }
> = {
  Draft: { label: 'Bản nháp', variant: 'amber' },
  Published: { label: 'Đã xuất bản', variant: 'green' },
  Archived: { label: 'Đã lưu trữ', variant: 'slate' },
};

export interface LessonListRowCardProps {
  lesson: LessonDto;
  onArchive: (lessonId: number) => Promise<void>;
}

export function LessonListRowCard({
  lesson,
  onArchive,
}: LessonListRowCardProps) {
  const statusMeta = STATUS_BADGE_MAP[lesson.status];

  return (
    <Card
      hoverable
      innerClassName="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="blue" size="sm">
            {lesson.levelDisplayName}
          </Badge>
          <span className="font-mono text-xs text-[#6B6A66]">
            Unit {lesson.unitNo}
            {lesson.unitTitle ? `: ${lesson.unitTitle}` : ''} · Lesson{' '}
            {lesson.lessonNo}
          </span>
          <Badge variant={statusMeta.variant} size="sm">
            {statusMeta.label}
          </Badge>
        </div>
        <h2 className="font-serif text-base sm:text-lg font-semibold text-[#141413]">
          <Link
            to={`/teacher/lessons/${lesson.id}`}
            className="hover:underline"
          >
            {lesson.title}
          </Link>
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to={`/teacher/lessons/${lesson.id}`}
          className="inline-flex items-center justify-center rounded-lg border border-[#E8E7E4] bg-white px-3 py-1.5 text-xs font-medium text-[#141413] hover:bg-[#F4F3EF]"
        >
          Biên tập từ vựng
        </Link>
        {lesson.status !== 'Archived' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => void onArchive(lesson.id)}
          >
            Lưu trữ
          </Button>
        )}
      </div>
    </Card>
  );
}

