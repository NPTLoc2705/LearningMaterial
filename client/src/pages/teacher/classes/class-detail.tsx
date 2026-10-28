import { Link, useParams } from 'react-router-dom';
import { AddStudentFormCard } from '../../../components/teacher/AddStudentFormCard';
import { ClassAccessLinkCard } from '../../../components/teacher/ClassAccessLinkCard';
import { StudentRosterList } from '../../../components/teacher/StudentRosterList';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useClassroomDetail } from '../../../hooks/use-classroom-detail';

export function TeacherClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const classroomId = Number(id ?? 0);

  const {
    classroom,
    students,
    isLoading,
    isSubmittingStudent,
    isMutatingLink,
    error,
    latestCreatedStudent,
    latestAccessLink,
    linkRevokedNotice,
    dismissLatestStudentPassword,
    addStudent,
    removeStudent,
    createOrRotateLink,
    revokeLink,
    archiveClassroom,
  } = useClassroomDetail(classroomId);

  if (isLoading) {
    return (
      <div className="py-12 text-center font-mono text-xs text-[#9E9D97] animate-pulse">
        Đang tải chi tiết lớp học...
      </div>
    );
  }

  if (!classroom) {
    return (
      <Card innerClassName="p-8 text-center space-y-4">
        <p className="text-sm text-[#9F2F2D]">
          {error ?? 'Không tìm thấy lớp học hoặc bạn không có quyền truy cập.'}
        </p>
        <div>
          <Link to="/teacher/classes">
            <Button size="sm" variant="secondary">
              ← Quay lại danh sách lớp
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/teacher/classes"
              className="font-mono text-xs text-[#6B6A66] hover:text-[#141413]"
            >
              ← Danh sách lớp học
            </Link>
            <span className="text-[#D5D4CE]">/</span>
            <Badge
              variant={classroom.accessMode === 'ClassLink' ? 'green' : 'blue'}
              size="sm"
            >
              {classroom.levelDisplayName}
            </Badge>
            {classroom.isArchived && (
              <Badge variant="amber" size="sm">
                Đã lưu trữ
              </Badge>
            )}
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141413]">
            {classroom.name}
          </h1>
          {classroom.termName && (
            <p className="text-xs sm:text-sm text-[#6B6A66] mt-0.5">
              Học kỳ: {classroom.termName}
            </p>
          )}
        </div>

        {!classroom.isArchived && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => void archiveClassroom()}
            >
              Lưu trữ lớp học
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-[#FDEBEC] border border-[#FAD4D6] px-4 py-3 text-xs text-[#9F2F2D]"
        >
          {error}
        </div>
      )}

      {classroom.accessMode === 'ClassLink' && (
        <ClassAccessLinkCard
          isArchived={classroom.isArchived}
          isMutating={isMutatingLink}
          latestAccessLink={latestAccessLink}
          linkRevokedNotice={linkRevokedNotice}
          onCreateOrRotate={createOrRotateLink}
          onRevoke={revokeLink}
        />
      )}

      <AddStudentFormCard
        accessMode={classroom.accessMode}
        isArchived={classroom.isArchived}
        isSubmitting={isSubmittingStudent}
        latestCreatedStudent={latestCreatedStudent}
        onDismissLatestPassword={dismissLatestStudentPassword}
        onAddStudent={addStudent}
      />

      <StudentRosterList
        students={students}
        isArchived={classroom.isArchived}
        onRemoveStudent={removeStudent}
      />
    </div>
  );
}

export default TeacherClassDetailPage;

