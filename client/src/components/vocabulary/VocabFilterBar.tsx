import type { UnitFilter, POSFilter, WordStatusFilter } from '../../types/vocabulary';
import { Input } from '../ui/Input';
import { IconSearch } from '../ui/Icons';

export interface VocabFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unitFilter: UnitFilter;
  onUnitChange: (unit: UnitFilter) => void;
  posFilter: POSFilter;
  onPosChange: (pos: POSFilter) => void;
  statusFilter: WordStatusFilter;
  onStatusChange: (status: WordStatusFilter) => void;
  totalCount: number;
  filteredCount: number;
}

export function VocabFilterBar({
  searchQuery,
  onSearchChange,
  unitFilter,
  onUnitChange,
  posFilter,
  onPosChange,
  statusFilter,
  onStatusChange,
  totalCount,
  filteredCount,
}: VocabFilterBarProps) {
  const posOptions: { label: string; value: POSFilter }[] = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Danh từ (N)', value: 'N' },
    { label: 'Động từ (V)', value: 'V' },
    { label: 'Tính từ (Adj)', value: 'Adj' },
    { label: 'Khác', value: 'Other' },
  ];

  const statusOptions: { label: string; value: WordStatusFilter }[] = [
    { label: 'Tất cả trạng thái', value: 'all' },
    { label: 'Đã thuộc', value: 'known' },
    { label: 'Cần ôn lại', value: 'review' },
    { label: 'Đang học', value: 'learning' },
    { label: 'Chưa học', value: 'new' },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E8E7E4] p-4 mb-6 space-y-4 shadow-subtle">
      {/* Search and Unit Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:max-w-md">
          <Input
            icon={<IconSearch size={14} />}
            placeholder="Tìm từ vựng, nghĩa tiếng Việt, từ đồng nghĩa hoặc ví dụ..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            clearable
            onClear={() => onSearchChange('')}
          />
        </div>

        {/* Unit Selector Tabs */}
        <div className="flex items-center gap-1 bg-[#F4F3EF] p-1 rounded-lg w-full sm:w-auto justify-center overflow-x-auto">
          {(['all', 7, 8] as const).map((unit) => {
            const isActive = unitFilter === unit;
            return (
              <button
                key={unit}
                type="button"
                onClick={() => onUnitChange(unit)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all touch-manipulation whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[#141413] shadow-subtle font-semibold'
                    : 'text-[#6B6A66] hover:text-[#141413]'
                }`}
              >
                {unit === 'all' ? 'Tất cả Units' : `Unit ${unit}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* POS Filter Pills & Status Dropdown & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#EFEFEA]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E9D97] mr-1">
            Từ loại:
          </span>
          {posOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onPosChange(opt.value)}
              className={`px-2.5 py-1 text-xs rounded-md transition-all touch-manipulation ${
                posFilter === opt.value
                  ? 'bg-[#141413] text-white font-medium'
                  : 'bg-[#F4F3EF] text-[#6B6A66] hover:bg-[#EAE8E3] hover:text-[#141413]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as WordStatusFilter)}
            className="text-xs font-medium text-[#141413] bg-[#F4F3EF] border border-[#E8E7E4] rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#141413] touch-manipulation"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <span className="font-mono text-xs text-[#9E9D97] whitespace-nowrap">
            {filteredCount} / {totalCount} từ
          </span>
        </div>
      </div>
    </div>
  );
}
