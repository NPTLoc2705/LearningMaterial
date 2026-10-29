import { useState } from 'react';
import { ExtractionWarningsBanner } from './ExtractionWarningsBanner';
import { IgnoredSlidesSummaryBadge } from './IgnoredSlidesSummaryBadge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type {
  ExtractionDraftDto,
  ExtractionJobDto,
} from '../../types/api';

export interface ExtractionDraftReviewCardProps {
  job: ExtractionJobDto;
  isProcessing: boolean;
  onUpdateDraft: (draft: ExtractionDraftDto) => Promise<unknown>;
  onApprove: () => Promise<unknown>;
  onDiscard: () => Promise<unknown>;
}

export function ExtractionDraftReviewCard({
  job,
  isProcessing,
  onUpdateDraft,
  onApprove,
  onDiscard,
}: ExtractionDraftReviewCardProps) {
  const [draft, setDraft] = useState<ExtractionDraftDto>(
    job.draft ?? {
      vocabulary: [],
      sentencePatterns: [],
      ignoredSlides: [],
      warnings: [],
    }
  );

  const handleToggleApproved = (id: string) => {
    const nextDraft: ExtractionDraftDto = {
      ...draft,
      vocabulary: draft.vocabulary.map((item) =>
        item.id === id ? { ...item, isApproved: !item.isApproved } : item
      ),
    };
    setDraft(nextDraft);
    void onUpdateDraft(nextDraft);
  };

  const handleFieldChange = (
    id: string,
    field: 'word' | 'meaningVi',
    value: string
  ) => {
    const nextDraft: ExtractionDraftDto = {
      ...draft,
      vocabulary: draft.vocabulary.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    };
    setDraft(nextDraft);
    void onUpdateDraft(nextDraft);
  };

  const approvedCount = draft.vocabulary.filter((v) => v.isApproved).length;

  return (
    <Card innerClassName="p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E7E4] pb-4">
        <div>
          <h2 className="font-serif text-lg font-semibold text-[#141413]">
            Xem trước bản nháp trích xuất ({draft.vocabulary.length} từ vựng)
          </h2>
          <p className="text-xs text-[#6B6A66] mt-0.5">
            Giáo viên có thể sửa từ, đổi nghĩa, hoặc bỏ chọn những từ không phù hợp trước khi nhập vào bài giảng.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={isProcessing}
            onClick={() => void onDiscard()}
          >
            Hủy bản nháp
          </Button>
          <Button
            size="sm"
            disabled={isProcessing || approvedCount === 0}
            onClick={() => void onApprove()}
          >
            {isProcessing ? 'Đang nhập...' : `Duyệt (${approvedCount} từ) và lưu`}
          </Button>
        </div>
      </div>

      <ExtractionWarningsBanner warnings={draft.warnings} />
      <IgnoredSlidesSummaryBadge ignoredSlides={draft.ignoredSlides} />

      <div className="space-y-2">
        {draft.vocabulary.map((item) => (
          <div
            key={item.id}
            className={`rounded-xl border p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
              item.isApproved
                ? 'border-[#E8E7E4] bg-white'
                : 'border-[#F4F3EF] bg-[#FBFBFA] opacity-60'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <input
                type="checkbox"
                aria-label={`Duyệt từ ${item.word}`}
                checked={item.isApproved}
                onChange={() => handleToggleApproved(item.id)}
                className="w-4 h-4 rounded border-[#E8E7E4] text-[#141413]"
              />

              {item.imagePreviewUrl ? (
                <img
                  src={item.imagePreviewUrl}
                  alt={item.word}
                  className="w-12 h-12 rounded-lg object-cover border border-[#E8E7E4] bg-[#F4F3EF]"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-[#F4F3EF] border border-[#E8E7E4] flex items-center justify-center text-sm">
                  🖼️
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                <input
                  type="text"
                  aria-label="Từ tiếng Anh"
                  value={item.word}
                  onChange={(e) => handleFieldChange(item.id, 'word', e.target.value)}
                  className="rounded-lg border border-[#E8E7E4] px-2.5 py-1 text-sm font-semibold text-[#141413]"
                />
                <input
                  type="text"
                  aria-label="Nghĩa tiếng Việt"
                  value={item.meaningVi ?? ''}
                  onChange={(e) => handleFieldChange(item.id, 'meaningVi', e.target.value)}
                  placeholder="Nghĩa tiếng Việt"
                  className="rounded-lg border border-[#E8E7E4] px-2.5 py-1 text-sm text-[#141413]"
                />
              </div>
            </div>

            <span className="font-mono text-xs text-[#6B6A66] shrink-0 sm:text-right">
              Trang {item.sourcePage ?? '?'}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

