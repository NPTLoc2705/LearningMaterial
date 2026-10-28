import { useEffect, useState } from 'react';
import { ApiError } from '../../lib/authFetch';
import { AssignmentService } from '../../Service/AssignmentService';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { ClassroomDto, LessonDto } from '../../types/api';

export interface AssignLessonDialogCardProps {
  lesson: LessonDto;
  sameLevelClassrooms: ClassroomDto[];
}

export function AssignLessonDialogCard({
  lesson,
  sameLevelClassrooms,
}: AssignLessonDialogCardProps) {
  const [selectedClassroomId, setSelectedClassroomId] = useState<number>(
    sameLevelClassrooms[0]?.id ?? 0
  );
  const [assignedClassIds, setAssignedClassIds] = useState<Set<number>>(
    new Set()
  );
  const [isAssigning, setIsAssigning] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const effectiveClassroomId =
    selectedClassroomId || sameLevelClassrooms[0]?.id || 0;

  useEffect(() => {
    if (sameLevelClassrooms.length === 0) return;

    let cancelled = false;
    Promise.all(
      sameLevelClassrooms.map(async (cls) => {
        try {
          const list = await AssignmentService.getClassroomAssignments(cls.id);
          return list.some((a) => a.lessonId === lesson.id) ? cls.id : null;
        } catch {
          return null;
        }
      })
    ).then((ids) => {
      if (cancelled) return;
      setAssignedClassIds(
        new Set(ids.filter((id): id is number => id !== null))
      );
    });

    return () => {
      cancelled = true;
    };
  }, [lesson.id, sameLevelClassrooms]);

  const handleAssign = async () => {
    if (!effectiveClassroomId) return;
    setIsAssigning(true);
    setFeedback(null);
    try {
      await AssignmentService.assignLessonToClassroom(effectiveClassroomId, {
        lessonId: lesson.id,
      });
      setAssignedClassIds((prev) => new Set([...prev, effectiveClassroomId]));
      setFeedback({
        type: 'success',
        message: 'Đã giao bài giảng cho lớp học thành công.',
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message:
          err instanceof ApiError
            ? err.detail
            : 'Không thể giao bài giảng cho lớp học.',
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Card innerClassName="p-4 sm:p-5 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-serif text-base font-semibold text-[#141413]">
            Giao bài cho lớp cùng cấp độ ({lesson.levelDisplayName})
          </h3>
          <p className="text-xs text-[#6B6A66]">
            Chỉ những bài giảng ở trạng thái Đã xuất bản mới có thể giao cho lớp.
          </p>
        </div>
        {assignedClassIds.size > 0 && (
          <Badge variant="green" size="sm">
            Đã giao cho {assignedClassIds.size} lớp
          </Badge>
        )}
      </div>

      {lesson.status !== 'Published' ? (
        <p className="text-xs text-[#6B6A66] italic">
          Vui lòng xuất bản bài giảng trước khi giao cho lớp học.
        </p>
      ) : sameLevelClassrooms.length === 0 ? (
        <p className="text-xs text-[#6B6A66]">
          Chưa có lớp học nào thuộc cấp độ {lesson.levelDisplayName}.
        </p>
      ) : (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <select
            aria-label="Chọn lớp học để giao bài"
            value={effectiveClassroomId}
            onChange={(e) => setSelectedClassroomId(Number(e.target.value))}
            className="flex-1 rounded-lg border border-[#E8E7E4] bg-white px-3 py-2 text-sm text-[#141413]"
          >
            {sameLevelClassrooms.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} {cls.termName ? `(${cls.termName})` : ''}{' '}
                {assignedClassIds.has(cls.id) ? '— Đã giao ✓' : ''}
              </option>
            ))}
          </select>

          <Button
            size="sm"
            disabled={isAssigning || assignedClassIds.has(effectiveClassroomId)}
            onClick={() => void handleAssign()}
          >
            {assignedClassIds.has(effectiveClassroomId)
              ? 'Đã giao cho lớp này'
              : isAssigning
                ? 'Đang giao...'
                : 'Giao bài học'}
          </Button>
        </div>
      )}

      {feedback && (
        <p
          className={`text-xs font-medium ${
            feedback.type === 'success' ? 'text-[#2E6F40]' : 'text-[#9F2F2D]'
          }`}
        >
          {feedback.message}
        </p>
      )}
    </Card>
  );
}

