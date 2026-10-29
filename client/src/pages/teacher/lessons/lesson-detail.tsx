import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AssignLessonDialogCard } from '../../../components/teacher/AssignLessonDialogCard';
import { LessonDetailHeader } from '../../../components/teacher/LessonDetailHeader';
import { LessonExtractionTab } from '../../../components/teacher/LessonExtractionTab';
import { LessonGrammarTab } from '../../../components/teacher/LessonGrammarTab';
import { LessonMetadataEditorCard } from '../../../components/teacher/LessonMetadataEditorCard';
import { LessonVocabularyTab } from '../../../components/teacher/LessonVocabularyTab';
import { PublishValidationChecklist } from '../../../components/teacher/PublishValidationChecklist';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useLessonDetail } from '../../../hooks/use-lesson-detail';

export function TeacherLessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const lessonId = Number(id);
  const [activeTab, setActiveTab] = useState<'vocab' | 'grammar' | 'extract' | 'info'>('vocab');

  const {
    lesson,
    vocabulary,
    sameLevelClassrooms,
    isLoading,
    saveState,
    error,
    publishDiagnostics,
    reloadVocabulary,
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
          variant={activeTab === 'grammar' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('grammar')}
        >
          Ngữ pháp
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'extract' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('extract')}
        >
          Nhập từ Slide/PDF (AI)
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'info' ? 'primary' : 'outline'}
          onClick={() => setActiveTab('info')}
        >
          Thông tin bài giảng
        </Button>
      </div>

      {activeTab === 'grammar' && (
        <LessonGrammarTab
          lesson={lesson}
          isReadOnly={isReadOnly}
        />
      )}

      {activeTab === 'info' && (
        <LessonMetadataEditorCard
          lesson={lesson}
          isReadOnly={isReadOnly}
          onSave={updateMetadata}
        />
      )}

      {activeTab === 'extract' && (
        <LessonExtractionTab
          lessonId={lesson.id}
          isReadOnly={isReadOnly}
          onApproved={async () => {
            await reloadVocabulary();
            setActiveTab('vocab');
          }}
        />
      )}

      {activeTab === 'vocab' && (
        <LessonVocabularyTab
          vocabulary={vocabulary}
          isReadOnly={isReadOnly}
          onAdd={addVocabularyItem}
          onSave={saveVocabularyItem}
          onUploadImage={uploadVocabularyImage}
          onMove={moveVocabularyItem}
          onDelete={removeVocabularyItem}
        />
      )}
    </div>
  );
}

export default TeacherLessonDetailPage;
