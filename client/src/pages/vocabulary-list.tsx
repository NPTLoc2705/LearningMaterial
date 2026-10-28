import { NavLink } from 'react-router-dom';
import vocabData from '../data/vocabulary.json';
import type { VocabularyItem } from '../types/vocabulary';
import { useVocabFilter } from '../hooks/use-vocab-filter';
import { VocabFilterBar } from '../components/vocabulary/VocabFilterBar';
import { VocabCard } from '../components/vocabulary/VocabCard';
import { Button } from '../components/ui/Button';
import { IconCards, IconQuiz } from '../components/ui/Icons';
import type { useProgress } from '../hooks/use-progress';

const vocabItems = vocabData as VocabularyItem[];

export interface VocabularyListPageProps {
  progressHook: ReturnType<typeof useProgress>;
}

export function VocabularyListPage({ progressHook }: VocabularyListPageProps) {
  const { progress, setWordStatus } = progressHook;

  const {
    searchQuery,
    setSearchQuery,
    unitFilter,
    setUnitFilter,
    posFilter,
    setPosFilter,
    statusFilter,
    setStatusFilter,
    filteredItems,
    totalCount,
    filteredCount,
  } = useVocabFilter(vocabItems, progress);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E7E4] pb-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E9D97] block mb-1">
            Kho Từ Vựng Trọng Tâm
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#141413]">
            Danh Sách Từ Vựng
          </h1>
          <p className="text-xs text-[#6B6A66] mt-1 font-normal max-w-xl">
            Tuyển tập 58 từ vựng Units 7 &amp; 8 kèm định nghĩa tiếng Việt, ví dụ minh họa và ngữ cảnh sử dụng chuẩn xác.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <NavLink to="/vocabulary/flashcards">
            <Button variant="primary" size="sm" className="gap-1.5">
              <IconCards size={13} />
              <span>Học với Thẻ</span>
            </Button>
          </NavLink>
          <NavLink to="/vocabulary/quiz">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <IconQuiz size={13} />
              <span>Luyện kiểm tra</span>
            </Button>
          </NavLink>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <VocabFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        unitFilter={unitFilter}
        onUnitChange={setUnitFilter}
        posFilter={posFilter}
        onPosChange={setPosFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        totalCount={totalCount}
        filteredCount={filteredCount}
      />

      {/* Word Cards Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const currentStatus = progress.words[item.id]?.status || 'new';
            return (
              <VocabCard
                key={item.id}
                item={item}
                status={currentStatus}
                onSetStatus={setWordStatus}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E8E7E4] p-12 text-center max-w-md mx-auto space-y-3 shadow-subtle">
          <p className="font-serif text-lg text-[#141413]">Không tìm thấy từ vựng phù hợp</p>
          <p className="text-xs text-[#6B6A66]">
            Hãy thử xóa bớt điều kiện lọc hoặc tìm kiếm bằng từ khóa khác.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setUnitFilter('all');
              setPosFilter('all');
              setStatusFilter('all');
            }}
          >
            Xóa bộ lọc
          </Button>
        </div>
      )}
    </div>
  );
}
