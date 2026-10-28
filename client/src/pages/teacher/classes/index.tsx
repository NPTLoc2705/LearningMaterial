import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreateClassroomForm } from '../../../components/teacher/CreateClassroomForm';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useClassrooms } from '../../../hooks/use-classrooms';
import type { CreateClassroomRequestDto } from '../../../types/api';

export function TeacherClassesPage() {
  const {
    levels,
    classrooms,
    isLoading,
    isCreating,
    error,
    clearError,
    createClassroom,
  } = useClassrooms();
  const navigate = useNavigate();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const visibleClassrooms = classrooms.filter(
    (c) => c.isArchived === showArchived
  );

  const handleCreate = async (payload: CreateClassroomRequestDto) => {
    const created = await createClassroom(payload);
    setShowCreateForm(false);
    navigate(`/teacher/classes/${created.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B6A66]">
            Quản lý lớp học
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141413] mt-1">
            Danh sách lớp học
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowArchived((prev) => !prev)}
          >
            {showArchived ? 'Xem lớp đang hoạt động' : 'Xem lớp đã lưu trữ'}
          </Button>
          {!showCreateForm && (
            <Button
              size="sm"
              onClick={() => {
                clearError();
                setShowCreateForm(true);
              }}
            >
              + Tạo lớp học mới
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-[#FDEBEC] border border-[#FAD4D6] px-4 py-3 text-xs text-[#9F2F2D]"
        >
          {error}
        </div>
      )}

      {showCreateForm && (
        <CreateClassroomForm
          levels={levels}
          isCreating={isCreating}
          onSubmit={handleCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {isLoading ? (
        <div className="py-12 text-center font-mono text-xs text-[#9E9D97] animate-pulse">
          Đang tải danh sách lớp học...
        </div>
      ) : visibleClassrooms.length === 0 ? (
        <Card innerClassName="p-8 text-center space-y-3">
          <p className="text-sm text-[#6B6A66]">
            {showArchived
              ? 'Chưa có lớp học nào trong mục lưu trữ.'
              : 'Chưa có lớp học nào đang hoạt động.'}
          </p>
          {!showArchived && !showCreateForm && (
            <div>
              <Button size="sm" onClick={() => setShowCreateForm(true)}>
                + Tạo lớp học đầu tiên
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleClassrooms.map((cls) => (
            <Link
              key={cls.id}
              to={`/teacher/classes/${cls.id}`}
              className="block group"
            >
              <Card
                hoverable
                innerClassName="p-5 flex flex-col justify-between h-full space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant={
                        cls.accessMode === 'ClassLink' ? 'green' : 'blue'
                      }
                      size="sm"
                    >
                      {cls.levelDisplayName}
                    </Badge>
                    <span className="font-mono text-[11px] text-[#9E9D97]">
                      {cls.accessMode === 'ClassLink' ? 'QR / Link' : 'Mật khẩu'}
                    </span>
                  </div>

                  <h2 className="font-serif text-lg font-semibold text-[#141413] group-hover:underline">
                    {cls.name}
                  </h2>

                  {cls.termName && (
                    <p className="text-xs text-[#6B6A66]">
                      Học kỳ: {cls.termName}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#EFEFEA] flex items-center justify-between text-xs text-[#6B6A66]">
                  <span>Khối {cls.levelGroup}</span>
                  <span className="font-medium text-[#141413]">
                    Quản lý lớp →
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeacherClassesPage;
