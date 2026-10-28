import { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { ExtractionJobDto } from '../../types/api';

export interface SlideUploadCardProps {
  job: ExtractionJobDto | null;
  isUploading: boolean;
  onUpload: (file: File) => Promise<unknown>;
}

export function SlideUploadCard({
  job,
  isUploading,
  onUpload,
}: SlideUploadCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setLocalError(null);
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setLocalError('File vượt quá kích thước tối đa 20 MB.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleStartUpload = async () => {
    if (!selectedFile) return;
    setLocalError(null);
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
    } catch {
      // Error handled by parent hook
    }
  };

  const isExtracting = job?.status === 'Uploaded' || job?.status === 'Extracting';

  return (
    <Card innerClassName="p-5 sm:p-6 space-y-4">
      <div>
        <h2 className="font-serif text-base sm:text-lg font-semibold text-[#141413]">
          Tự động trích xuất từ Slide bài giảng (PDF / PPTX)
        </h2>
        <p className="text-xs text-[#6B6A66] mt-1">
          Hệ thống AI sẽ quét nội dung bài giảng, tự động nhận diện từ vựng, câu mẫu, cắt hình ảnh minh họa và lọc các trang bìa/nội quy. File tạm sẽ được xóa ngay sau khi duyệt.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          disabled={isUploading || isExtracting}
          onChange={handleFileChange}
          className="text-xs text-[#6B6A66] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border file:border-[#E8E7E4] file:text-xs file:font-medium file:bg-[#F4F3EF] file:text-[#141413] hover:file:bg-[#EAE8E3]"
        />

        <Button
          size="sm"
          disabled={!selectedFile || isUploading || isExtracting}
          onClick={() => void handleStartUpload()}
        >
          {isUploading
            ? 'Đang tải lên...'
            : isExtracting
              ? 'Đang phân tích...'
              : 'Bắt đầu trích xuất'}
        </Button>
      </div>

      {localError && (
        <p className="text-xs text-[#9F2F2D] font-medium">{localError}</p>
      )}

      {isExtracting && (
        <div className="rounded-xl bg-[#F4F3EF] p-4 flex items-center gap-3 animate-pulse">
          <span className="text-xl" aria-hidden="true">
            ⚡
          </span>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-[#141413]">
              Đang phân tích file slide {job?.originalFileName ? `"${job.originalFileName}"` : ''}...
            </p>
            <p className="text-[11px] text-[#6B6A66]">
              Trạng thái: {job?.status === 'Uploaded' ? 'Đã xếp hàng xử lý' : 'Mô hình AI đang trích xuất từ vựng và hình ảnh'}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
