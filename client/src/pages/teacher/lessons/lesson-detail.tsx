import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AddVocabularyItemForm } from '../../../components/teacher/AddVocabularyItemForm';
import { AssignLessonDialogCard } from '../../../components/teacher/AssignLessonDialogCard';
import { LessonDetailHeader } from '../../../components/teacher/LessonDetailHeader';
import { LessonMetadataEditorCard } from '../../../components/teacher/LessonMetadataEditorCard';
import { PublishValidationChecklist } from '../../../components/teacher/PublishValidationChecklist';
import { VocabularyEditorRow } from '../../../components/teacher/VocabularyEditorRow';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useLessonDetail } from '../../../hooks/use-lesson-detail';

export function TeacherLessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const lessonId = Number(id);
  const [activeTab, setActiveTab] = useState<'vocab' | 'info'>('vocab');

  const {
    lesson,
    vocabulary,
    sameLevelClassrooms,
    isLoading,
    saveState,
    error,
    publishDiagnostics,
    updateMetadata,
    addVocabularyItem,
    saveVocabularyItem,
    moveVocabularyItem,
    removeVocabularyItem,
    uploadVocabularyImage,
    publishLesson,
    archiveLesson,
    restoreLesson,
  } = useLessonDetail(lessonId);

  if (isLoading) {
    return (
      <div className="py-12 text-center font-mono text-xs text-[#9E9D97] animate-pulse">
        Đang tải nội dung bài giảng...
      </div>
    );
  }

  if (!lesson) {
    return (
      <Card innerClassName="p-8 text-center space-y-3">
        <p className="text-sm text-[#9F2F2D]">
          {error ?? 'Không tìm thấy bài giảng.'}
        </p>
        <Link
          to="/teacher/lessons"
          className="inline-block font-mono text-xs underline text-[#141413]"
        >
          ← Quay lại thư viện bài giảng
        </Link>
      </Card>
    );
  }

  const isReadOnly = lesson.status === 'Archived';

  return (
    <div className="space-y-6">
      <LessonDetailHeader
        lesson={lesson}
        saveState={saveState}
        onPublish={publishLesson}
        onArchive={archiveLesson}
        onRestore={restoreLesson}
      />

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-[#FDEBEC] border border-[#FAD4D6] px-4 py-3 text-xs text-[#9F2F2D]"
        >
          {error}
        </div>
      )}

      <PublishValidationChecklist diagnostics={publishDiagnostics} />

      <AssignLessonDialogCard
        lesson={lesson}
        sameLevelClassrooms={sameLevelClassrooms}
      />

      <div className="flex items-center gap-2 border-b border-[#E8E7E4] pb-2">
        <Button
          size="sm"
          variant={activeTab === 'vocab' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('vocab')}
        >
          Từ vựng ({vocabulary.length})
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'info' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('info')}
        >
          Thông tin bài giảng
        </Button>
      </div>

      {activeTab === 'info' ? (
        <LessonMetadataEditorCard
          lesson={lesson}
          isReadOnly={isReadOnly}
          onSave={updateMetadata}
        />
      ) : (
        <div className="space-y-4">
          {!isReadOnly && (
            <AddVocabularyItemForm
              onAdd={addVocabularyItem}
              onUploadImage={uploadVocabularyImage}
            />
          )}

          {vocabulary.length === 0 ? (
            <Card innerClassName="p-8 text-center text-sm text-[#6B6A66]">
              Chưa có từ vựng nào trong bài giảng này. Hãy thêm ít nhất 4 từ vựng để đủ điều kiện xuất bản.
            </Card>
          ) : (
            <div className="space-y-2.5">
              {vocabulary.map((item, idx) => (
                <VocabularyEditorRow
                  key={item.id}
                  item={item}
                  isFirst={idx === 0}
                  isLast={idx === vocabulary.length - 1}
                  isReadOnly={isReadOnly}
                  onSave={saveVocabularyItem}
                  onUploadImage={uploadVocabularyImage}
                  onMove={moveVocabularyItem}
                  onDelete={removeVocabularyItem}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TeacherLessonDetailPage;
