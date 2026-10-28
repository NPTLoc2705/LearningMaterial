import { Link } from 'react-router-dom';
import type { SaveIndicatorState } from '../../hooks/use-lesson-detail';
import type { LessonDto, LessonStatus } from '../../types/api';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const STATUS_BADGE_MAP: Record<
  LessonStatus,
  { label: string; variant: 'amber' | 'green' | 'slate' }
> = {
  Draft: { label: 'Bản nháp', variant: 'amber' },
  Published: { label: 'Đã xuất bản', variant: 'green' },
  Archived: { label: 'Đã lưu trữ', variant: 'slate' },
};

const SAVE_STATUS_LABEL: Record<SaveIndicatorState, string> = {
  idle: 'Tự động lưu khi chỉnh sửa',
  saving: 'Đang lưu thay đổi...',
  saved: 'Đã lưu tất cả thay đổi ✓',
  error: 'Lỗi lưu thay đổi',
};

export interface LessonDetailHeaderProps {
  lesson: LessonDto;
  saveState: SaveIndicatorState;
  onPublish: () => Promise<void>;
  onArchive: () => Promise<void>;
  onRestore: () => Promise<void>;
}

export function LessonDetailHeader({
  lesson,
  saveState,
  onPublish,
  onArchive,
  onRestore,
}: LessonDetailHeaderProps) {
  const statusMeta = STATUS_BADGE_MAP[lesson.status];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <Link
          to="/teacher/lessons"
          className="font-mono text-xs text-[#6B6A66] hover:text-[#141413]"
        >
          ← Thư viện bài giảng
        </Link>
        <div className="flex flex-wrap items-center gap-2 pt-1">
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
          <span className="font-mono text-[11px] text-[#6B6A66] ml-1">
            · {SAVE_STATUS_LABEL[saveState]}
          </span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141413]">
          {lesson.title}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {lesson.status === 'Draft' && (
          <Button size="sm" onClick={() => void onPublish()}>
            Xuất bản bài giảng
          </Button>
        )}
        {lesson.status !== 'Archived' ? (
          <Button size="sm" variant="outline" onClick={() => void onArchive()}>
            Lưu trữ
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => void onRestore()}>
            Khôi phục về Bản nháp
          </Button>
        )}
      </div>
    </div>
  );
}
