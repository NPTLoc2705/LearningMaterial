import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ExtractionDraftReviewCard } from './ExtractionDraftReviewCard';
import { SlideUploadCard } from './SlideUploadCard';
import { useExtractionJob } from '../../hooks/use-extraction-job';

export interface LessonExtractionTabProps {
  lessonId: number;
  isReadOnly: boolean;
  onApproved: () => Promise<void> | void;
}

export function LessonExtractionTab({
  lessonId,
  isReadOnly,
  onApproved,
}: LessonExtractionTabProps) {
  const {
    job,
    isUploading,
    isProcessingAction,
    error,
    uploadSlideDeck,
    updateDraft,
    approveJob,
    discardJob,
    resetJob,
  } = useExtractionJob(lessonId);

  if (isReadOnly) {
    return (
      <Card innerClassName="p-6 text-center text-sm text-[#6B6A66]">
        Bài giảng đã được lưu trữ (Archived), không thể trích xuất thêm nội dung mới.
      </Card>
    );
  }

  const handleApprove = async () => {
    await approveJob();
    await onApproved();
  };

  return (
    <div className="space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded-lg bg-[#FDEBEC] border border-[#FAD4D6] px-4 py-3 text-xs text-[#9F2F2D]"
        >
          {error}
        </div>
      )}

      {job?.status === 'Approved' ? (
        <Card innerClassName="p-6 text-center space-y-3">
          <div className="text-2xl" aria-hidden="true">
            🎉
          </div>
          <h3 className="font-serif text-base font-semibold text-[#141413]">
            Trích xuất và nhập từ vựng thành công!
          </h3>
          <p className="text-xs text-[#6B6A66]">
            Các từ vựng được giáo viên phê duyệt đã được chuyển vào danh sách từ vựng của bài giảng.
          </p>
          <Button size="sm" variant="outline" onClick={resetJob}>
            Trích xuất file slide khác
          </Button>
        </Card>
      ) : job?.status === 'Draft' && job.draft ? (
        <ExtractionDraftReviewCard
          job={job}
          isProcessing={isProcessingAction}
          onUpdateDraft={updateDraft}
          onApprove={handleApprove}
          onDiscard={discardJob}
        />
      ) : (
        <SlideUploadCard
          job={job}
          isUploading={isUploading}
          onUpload={uploadSlideDeck}
        />
      )}
    </div>
  );
}
