import { Link } from 'react-router-dom';
import { KidLessonCard } from '../../components/kids/KidLessonCard';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/use-auth';
import { useStudentAssignments } from '../../hooks/use-student-assignments';

export function StudentHomePage() {
  const { user } = useAuth();
  const { assignments, isLoading, error } = useStudentAssignments();

  const isYoungStudent =
    assignments.some((a) => a.levelGroup === 'Young') ||
    user?.loginMode === 'ClassLink';

  if (isLoading) {
    return (
      <div className="py-12 text-center font-mono text-xs text-[#9E9D97] animate-pulse">
        {isYoungStudent
          ? 'Loading lessons...'
          : 'Đang tải danh sách bài học được giao...'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B6A66]">
          {isYoungStudent ? 'My Lessons' : 'Học tập'}
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141413] mt-1">
          {isYoungStudent
            ? `Hi, ${user?.displayName ?? 'Friend'}! 👋`
            : `Xin chào, ${user?.displayName ?? 'Học sinh'}!`}
        </h1>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-[#FDEBEC] border border-[#FAD4D6] px-4 py-3 text-xs text-[#9F2F2D]"
        >
          {error}
        </div>
      )}

      {assignments.length === 0 ? (
        <Card innerClassName="p-8 text-center space-y-2">
          <p className="text-base text-[#6B6A66]">
            {isYoungStudent
              ? 'No lessons yet! Check back soon 🌟'
              : 'Hiện chưa có bài học nào được giao cho lớp của em.'}
          </p>
        </Card>
      ) : isYoungStudent ? (
        <div className="grid grid-cols-1 gap-4">
          {assignments.map((item) => (
            <KidLessonCard key={item.assignmentId} lesson={item} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((item) => (
            <Card
              key={item.assignmentId}
              hoverable
              innerClassName="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="blue" size="sm">
                    {item.levelDisplayName}
                  </Badge>
                  <span className="font-mono text-xs text-[#6B6A66]">
                    {item.classroomName} · Unit {item.unitNo} · Lesson{' '}
                    {item.lessonNo}
                  </span>
                  <Badge variant="green" size="sm">
                    {item.vocabularyCount} từ vựng
                  </Badge>
                </div>
                <h2 className="font-serif text-base sm:text-lg font-semibold text-[#141413]">
                  <Link
                    to={`/student/lessons/${item.lessonId}`}
                    className="hover:underline"
                  >
                    {item.title}
                  </Link>
                </h2>
              </div>

              <Link
                to={`/student/lessons/${item.lessonId}`}
                className="inline-flex items-center justify-center rounded-lg bg-[#141413] px-4 py-2 text-xs font-medium text-white hover:bg-[#282725]"
              >
                Vào học ngay →
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentHomePage;
