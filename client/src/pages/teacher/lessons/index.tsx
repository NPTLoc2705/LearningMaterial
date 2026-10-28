import { useState } from 'react';
import { CreateLessonForm } from '../../../components/teacher/CreateLessonForm';
import { LessonFilterBar } from '../../../components/teacher/LessonFilterBar';
import { LessonListRowCard } from '../../../components/teacher/LessonListRowCard';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useLessons } from '../../../hooks/use-lessons';
import type { CreateLessonRequestDto } from '../../../types/api';

export function TeacherLessonsPage() {
  const {
    levels,
    lessons,
    selectedLevelId,
    selectedStatus,
    searchQuery,
    isLoading,
    isCreating,
    error,
    setSelectedLevelId,
    setSelectedStatus,
    setSearchQuery,
    clearError,
    createLesson,
    archiveLesson,
  } = useLessons();

  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreate = async (payload: CreateLessonRequestDto) => {
    await createLesson(payload);
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B6A66]">
            Quản lý nội dung
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141413] mt-1">
            Thư viện bài giảng
          </h1>
        </div>

        {!showCreateForm && (
          <Button
            size="sm"
            onClick={() => {
              clearError();
              setShowCreateForm(true);
            }}
          >
            + Tạo bài giảng mới
          </Button>
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

      {showCreateForm && (
        <CreateLessonForm
          levels={levels}
          isCreating={isCreating}
          onSubmit={handleCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <LessonFilterBar
        levels={levels}
        selectedLevelId={selectedLevelId}
        selectedStatus={selectedStatus}
        searchQuery={searchQuery}
        onSelectLevelId={setSelectedLevelId}
        onSelectStatus={setSelectedStatus}
        onChangeSearchQuery={setSearchQuery}
      />

      {isLoading ? (
        <div className="py-12 text-center font-mono text-xs text-[#9E9D97] animate-pulse">
          Đang tải danh sách bài giảng...
        </div>
      ) : lessons.length === 0 ? (
        <Card innerClassName="p-8 text-center space-y-2">
          <p className="text-sm text-[#6B6A66]">
            Chưa có bài giảng nào khớp với bộ lọc hiện tại.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <LessonListRowCard
              key={lesson.id}
              lesson={lesson}
              onArchive={archiveLesson}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TeacherLessonsPage;
