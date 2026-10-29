import { Link } from 'react-router-dom';
import type { StudentAssignedLessonDto } from '../../types/api';

export interface KidLessonCardProps {
  lesson: StudentAssignedLessonDto;
}

const UNIT_ICONS = ['🌟', '🎈', '🎨', '🚀', '🐾', '🌈', '🎵', '🏕️'];

export function KidLessonCard({ lesson }: KidLessonCardProps) {
  const icon = UNIT_ICONS[(lesson.unitNo - 1) % UNIT_ICONS.length] ?? '🌟';

  return (
    <Link
      to={`/student/lessons/${lesson.lessonId}?classroomId=${lesson.classroomId}`}
      className="group block rounded-3xl border-2 border-[#E8E7E4] bg-white p-5 sm:p-6 shadow-subtle hover:border-[#141413] transition-transform active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 select-none touch-manipulation"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            aria-hidden="true"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#F4F3EF] flex items-center justify-center text-3xl sm:text-4xl shrink-0"
          >
            {icon}
          </div>

          <div className="space-y-1">
            <span className="inline-block font-mono text-xs uppercase tracking-wider text-[#6B6A66]">
              Unit {lesson.unitNo} · Lesson {lesson.lessonNo}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#141413]">
              {lesson.title}
            </h2>
            <p className="text-sm text-[#6B6A66]">
              {lesson.vocabularyCount} words
            </p>
          </div>
        </div>

        <div className="min-h-[64px] min-w-[64px] px-5 rounded-2xl bg-[#141413] text-white font-semibold text-base inline-flex items-center justify-center gap-2 shrink-0">
          <span aria-hidden="true">▶️</span>
          <span>Play</span>
        </div>
      </div>
    </Link>
  );
}

