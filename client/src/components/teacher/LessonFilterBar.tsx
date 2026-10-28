import type { LessonStatus, LevelDto } from '../../types/api';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

export interface LessonFilterBarProps {
  levels: LevelDto[];
  selectedLevelId: number | null;
  selectedStatus: LessonStatus | null;
  searchQuery: string;
  onSelectLevelId: (levelId: number | null) => void;
  onSelectStatus: (status: LessonStatus | null) => void;
  onChangeSearchQuery: (q: string) => void;
}

export function LessonFilterBar({
  levels,
  selectedLevelId,
  selectedStatus,
  searchQuery,
  onSelectLevelId,
  onSelectStatus,
  onChangeSearchQuery,
}: LessonFilterBarProps) {
  return (
    <Card innerClassName="p-4 sm:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label
            htmlFor="filter-level"
            className="block text-xs font-medium text-[#6B6A66] mb-1"
          >
            Lọc theo cấp độ
          </label>
          <select
            id="filter-level"
            value={selectedLevelId ?? ''}
            onChange={(e) =>
              onSelectLevelId(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full rounded-lg border border-[#E8E7E4] bg-white px-3 py-2 text-xs sm:text-sm text-[#141413]"
          >
            <option value="">Tất cả cấp độ</option>
            {levels.map((lvl) => (
              <option key={lvl.id} value={lvl.id}>
                {lvl.displayName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-status"
            className="block text-xs font-medium text-[#6B6A66] mb-1"
          >
            Trạng thái
          </label>
          <select
            id="filter-status"
            value={selectedStatus ?? ''}
            onChange={(e) =>
              onSelectStatus(
                e.target.value ? (e.target.value as LessonStatus) : null
              )
            }
            className="w-full rounded-lg border border-[#E8E7E4] bg-white px-3 py-2 text-xs sm:text-sm text-[#141413]"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Draft">Bản nháp (Draft)</option>
            <option value="Published">Đã xuất bản (Published)</option>
            <option value="Archived">Đã lưu trữ (Archived)</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-query"
            className="block text-xs font-medium text-[#6B6A66] mb-1"
          >
            Tìm kiếm tiêu đề
          </label>
          <Input
            id="filter-query"
            value={searchQuery}
            clearable
            onClear={() => onChangeSearchQuery('')}
            onChange={(e) => onChangeSearchQuery(e.target.value)}
            placeholder="Nhập tên bài giảng hoặc Unit..."
          />
        </div>
      </div>
    </Card>
  );
}

