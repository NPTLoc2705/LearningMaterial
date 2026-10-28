import { useState, lazy, Suspense } from 'react';
import { NavLink } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import {
  IconBook,
  IconCards,
  IconQuiz,
  IconGrammar,
  IconRefresh,
  IconInfo,
} from '../components/ui/Icons';
import type { useProgress } from '../hooks/use-progress';

const Hero3D = lazy(() =>
  import('../components/3d/Hero3D').then((m) => ({ default: m.Hero3D }))
);

export interface DashboardPageProps {
  progressHook: ReturnType<typeof useProgress>;
}

export function DashboardPage({ progressHook }: DashboardPageProps) {
  const { stats, resetAllProgress } = progressHook;
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const masteryPercent = Math.round((stats.knownWords / stats.totalWords) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Editorial Hero Header */}
      <div className="border-b border-[#E8E7E4] pb-8 pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E9D97] block">
              Tài liệu học tập · Unit 7 &amp; 8
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#141413] leading-[1.1]">
              Cool Apps, Gadgets <br className="hidden sm:inline" />
              <span className="italic font-normal">&amp; Into the Past</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6A66] leading-relaxed max-w-xl">
              Cổng học tập chuyên sâu bám sát tài liệu bài học. Nắm vững 58 từ vựng trọng tâm và 11 chủ điểm ngữ pháp thông qua thẻ ghi nhớ (flashcards), bài tập trắc nghiệm và phản xạ chủ động.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-3 bg-white rounded-lg border border-[#E8E7E4] shadow-subtle flex-1 sm:flex-initial">
              <span className="text-[#9E9D97] block text-[10px] uppercase">Từ vựng đã thuộc</span>
              <span className="font-serif text-xl font-bold text-[#141413]">
                {stats.knownWords} <span className="text-xs font-normal text-[#9E9D97]">/ {stats.totalWords}</span>
              </span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#E8E7E4] shadow-subtle flex-1 sm:flex-initial">
              <span className="text-[#9E9D97] block text-[10px] uppercase">Chủ điểm ngữ pháp</span>
              <span className="font-serif text-xl font-bold text-[#141413]">
                {stats.completedGrammar} <span className="text-xs font-normal text-[#9E9D97]">/ {stats.totalGrammar}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D WebGL Product Showcase (Unit 7: Cool Apps and Gadgets) */}
      <Suspense
        fallback={
          <div className="w-full h-80 rounded-2xl bg-[#F4F3EF] border border-[#E8E7E4] animate-pulse flex items-center justify-center font-mono text-xs text-[#9E9D97]">
            Đang tải không gian 3D Hero...
          </div>
        }
      >
        <Hero3D />
      </Suspense>

      {/* Asymmetrical Bento Box Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Bento Block 1: Primary Vocabulary Progress (7 Cols) */}
        <Card innerClassName="p-6 flex flex-col justify-between" className="lg:col-span-7">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFEFEA]">
              <div className="flex items-center gap-2">
                <IconBook size={16} className="text-[#141413]" />
                <h2 className="font-serif text-lg font-semibold text-[#141413]">
                  Mức độ ghi nhớ từ vựng
                </h2>
              </div>
              <Badge variant="green" size="sm">
                {masteryPercent}% HOÀN THÀNH
              </Badge>
            </div>

            {/* Segmented flat bar */}
            <div className="w-full bg-[#F4F3EF] rounded-md h-2 flex overflow-hidden">
              <div
                className="bg-[#346538] transition-all duration-300"
                style={{ width: `${(stats.knownWords / stats.totalWords) * 100}%` }}
                title={`Đã thuộc: ${stats.knownWords}`}
              />
              <div
                className="bg-[#9F2F2D] transition-all duration-300"
                style={{ width: `${(stats.reviewWords / stats.totalWords) * 100}%` }}
                title={`Cần ôn lại: ${stats.reviewWords}`}
              />
              <div
                className="bg-[#1F6C9F] transition-all duration-300"
                style={{ width: `${(stats.learningWords / stats.totalWords) * 100}%` }}
                title={`Đang học: ${stats.learningWords}`}
              />
            </div>

            {/* Muted stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-2">
              <div className="p-2.5 bg-[#EDF3EC] rounded-lg border border-[#DCE8DA]">
                <span className="font-serif text-lg font-bold text-[#346538] block">{stats.knownWords}</span>
                <span className="font-mono text-[10px] uppercase text-[#346538]">Đã thuộc</span>
              </div>
              <div className="p-2.5 bg-[#FDEBEC] rounded-lg border border-[#FAD4D6]">
                <span className="font-serif text-lg font-bold text-[#9F2F2D] block">{stats.reviewWords}</span>
                <span className="font-mono text-[10px] uppercase text-[#9F2F2D]">Cần ôn lại</span>
              </div>
              <div className="p-2.5 bg-[#E1F3FE] rounded-lg border border-[#CCE9FD]">
                <span className="font-serif text-lg font-bold text-[#1F6C9F] block">{stats.learningWords}</span>
                <span className="font-mono text-[10px] uppercase text-[#1F6C9F]">Đang học</span>
              </div>
              <div className="p-2.5 bg-[#F4F3EF] rounded-lg border border-[#E8E7E4]">
                <span className="font-serif text-lg font-bold text-[#6B6A66] block">{stats.newWords}</span>
                <span className="font-mono text-[10px] uppercase text-[#6B6A66]">Chưa học</span>
              </div>
            </div>

            {/* Unit Breakdown */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FBFBFA] rounded-lg border border-[#E8E7E4]">
                <span className="font-mono text-[10px] uppercase text-[#9E9D97] block">Unit 7: Cool Apps</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-[#141413] font-medium">{stats.u7.known} / {stats.u7.total} từ đã thuộc</span>
                  <span className="font-mono font-bold text-[#141413]">
                    {Math.round((stats.u7.known / stats.u7.total) * 100)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-[#FBFBFA] rounded-lg border border-[#E8E7E4]">
                <span className="font-mono text-[10px] uppercase text-[#9E9D97] block">Unit 8: Into the Past</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-[#141413] font-medium">{stats.u8.known} / {stats.u8.total} từ đã thuộc</span>
                  <span className="font-mono font-bold text-[#141413]">
                    {Math.round((stats.u8.known / stats.u8.total) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#EFEFEA] flex items-center justify-between">
            <NavLink to="/vocabulary" className="text-xs font-mono font-medium text-[#141413] hover:underline">
              Xem danh sách toàn bộ 58 từ vựng →
            </NavLink>
          </div>
        </Card>

        {/* Bento Block 2: Study Modes Launch (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <NavLink to="/vocabulary/flashcards" className="group block">
            <Card hoverable innerClassName="p-5 flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <IconCards size={16} className="text-[#141413]" />
                  <h3 className="font-serif font-bold text-base text-[#141413] group-hover:underline">
                    Học với Thẻ ghi nhớ (Flashcards)
                  </h3>
                </div>
                <p className="text-xs text-[#6B6A66] leading-relaxed">
                  Lật thẻ 3D trực quan, có phát âm tiếng Anh chuẩn và hỗ trợ phím tắt tiện lợi (Phím cách, 1, 2).
                </p>
              </div>
              <span className="font-mono text-xs text-[#9E9D97] group-hover:text-[#141413] transition-colors ml-3 mt-1 flex-shrink-0">
                Bắt đầu
              </span>
            </Card>
          </NavLink>

          <NavLink to="/vocabulary/quiz" className="group block">
            <Card hoverable innerClassName="p-5 flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <IconQuiz size={16} className="text-[#141413]" />
                  <h3 className="font-serif font-bold text-base text-[#141413] group-hover:underline">
                    Luyện tập trắc nghiệm &amp; Gõ từ (Quiz)
                  </h3>
                </div>
                <p className="text-xs text-[#6B6A66] leading-relaxed">
                  Trắc nghiệm 4 đáp án và thử thách gõ đúng chính tả từ vựng với các phương án bám sát bài học.
                </p>
              </div>
              <span className="font-mono text-xs text-[#9E9D97] group-hover:text-[#141413] transition-colors ml-3 mt-1 flex-shrink-0">
                Làm bài
              </span>
            </Card>
          </NavLink>

          <NavLink to="/grammar" className="group block">
            <Card hoverable innerClassName="p-5 flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <IconGrammar size={16} className="text-[#141413]" />
                  <h3 className="font-serif font-bold text-base text-[#141413] group-hover:underline">
                    Bài học Ngữ pháp
                  </h3>
                </div>
                <p className="text-xs text-[#6B6A66] leading-relaxed">
                  11 chủ điểm ngữ pháp có bảng so sánh chi tiết, công thức chuẩn, ví dụ và bài tập thực hành.
                </p>
              </div>
              <span className="font-mono text-xs text-[#9E9D97] group-hover:text-[#141413] transition-colors ml-3 mt-1 flex-shrink-0">
                Khám phá
              </span>
            </Card>
          </NavLink>
        </div>
      </div>

      {/* Reset progress footer strip */}
      <div className="pt-6 border-t border-[#E8E7E4] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9E9D97]">
        <span className="font-mono">Dữ liệu học tập được lưu trực tiếp trên trình duyệt của bạn</span>
        <button
          type="button"
          onClick={() => setIsResetModalOpen(true)}
          className="font-mono text-xs text-[#9F2F2D] hover:underline flex items-center gap-1.5"
        >
          <IconRefresh size={12} />
          <span>Đặt lại tiến độ học tập</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Đặt lại tiến độ học tập?"
        description="Hành động này sẽ xóa toàn bộ trạng thái ghi nhớ từ vựng, điểm số bài quiz và các bài ngữ pháp đã hoàn thành trên trình duyệt của bạn."
        confirmLabel="Xác nhận đặt lại"
        confirmVariant="danger"
        onConfirm={resetAllProgress}
      >
        <div className="p-3 bg-[#FDEBEC] border border-[#FAD4D6] rounded-lg text-xs text-[#9F2F2D] flex items-center gap-2">
          <IconInfo size={14} className="flex-shrink-0" />
          <span>Toàn bộ tiến độ sẽ quay về trạng thái ban đầu chưa học.</span>
        </div>
      </Modal>
    </div>
  );
}
