import { Badge } from '../ui/Badge';
import type { IgnoredSlideSummaryDto } from '../../types/api';

export interface IgnoredSlidesSummaryBadgeProps {
  ignoredSlides: IgnoredSlideSummaryDto[];
}

export function IgnoredSlidesSummaryBadge({
  ignoredSlides,
}: IgnoredSlidesSummaryBadgeProps) {
  if (ignoredSlides.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#E8E7E4] bg-[#FBFBFA] p-3.5 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-semibold text-[#141413]">
          Đã bỏ qua {ignoredSlides.length} trang không chứa từ vựng bài học:
        </span>
        <Badge variant="slate" size="sm">
          Tự động lọc
        </Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {ignoredSlides.map((slide) => (
          <span
            key={slide.pageNumber}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#E8E7E4] px-2.5 py-1 text-xs text-[#6B6A66]"
          >
            <strong className="font-mono text-[#141413]">Trang {slide.pageNumber}:</strong> {slide.reason}
          </span>
        ))}
      </div>
    </div>
  );
}

