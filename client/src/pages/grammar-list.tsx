import { useState } from 'react';
import grammarData from '../data/grammar.json';
import type { GrammarTopic } from '../types/grammar';
import type { UnitFilter } from '../types/vocabulary';
import { GrammarTopicCard } from '../components/grammar/GrammarTopicCard';
import { IconCheck, IconSparkles } from '../components/ui/Icons';
import type { useProgress } from '../hooks/use-progress';

const allTopics = grammarData as GrammarTopic[];

export interface GrammarListPageProps {
  progressHook: ReturnType<typeof useProgress>;
}

export function GrammarListPage({ progressHook }: GrammarListPageProps) {
  const { progress } = progressHook;
  const [unitFilter, setUnitFilter] = useState<UnitFilter>('all');

  const unit7Topics = allTopics.filter((t) => t.unit === 7);
  const unit8Topics = allTopics.filter((t) => t.unit === 8);

  const completedCount = allTopics.filter(
    (t) => progress.grammar[t.id]?.completed
  ).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E7E4] pb-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#9E9D97] block mb-1">
            Hệ Thống Ngữ Pháp &amp; Cấu Trúc
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#141413]">
            Chủ Điểm Ngữ Pháp
          </h1>
          <p className="text-xs text-[#6B6A66] mt-1 max-w-xl">
            Quy tắc ngữ pháp, bảng so sánh trực quan và bài tập vận dụng cho 11 chủ điểm Units 7 &amp; 8.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs text-[#346538] bg-[#EDF3EC] px-2.5 py-1 rounded border border-[#DCE8DA]">
            <IconCheck size={12} />
            <span>
              {completedCount} / {allTopics.length} Đã học
            </span>
          </span>

          <div className="flex items-center bg-[#F4F3EF] p-1 rounded-lg">
            {(['all', 7, 8] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnitFilter(u)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all touch-manipulation ${
                  unitFilter === u
                    ? 'bg-white text-[#141413] shadow-subtle font-semibold'
                    : 'text-[#6B6A66] hover:text-[#141413]'
                }`}
              >
                {u === 'all' ? 'Tất cả' : `Unit ${u}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Unit 7 Topics */}
      {(unitFilter === 'all' || unitFilter === 7) && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2">
            <IconSparkles size={14} className="text-[#141413]" />
            <h2 className="font-serif text-xl font-semibold text-[#141413]">
              Unit 7: Cool Apps and Gadgets
            </h2>
            <span className="font-mono text-xs text-[#9E9D97]">
              ({unit7Topics.length} chủ điểm)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unit7Topics.map((topic) => (
              <GrammarTopicCard
                key={topic.id}
                topic={topic}
                progress={progress.grammar[topic.id]}
              />
            ))}
          </div>
        </section>
      )}

      {/* Unit 8 Topics */}
      {(unitFilter === 'all' || unitFilter === 8) && (
        <section className="space-y-4 pt-4 border-t border-[#EFEFEA]">
          <div className="flex items-center gap-2 pb-2">
            <IconSparkles size={14} className="text-[#141413]" />
            <h2 className="font-serif text-xl font-semibold text-[#141413]">
              Unit 8: Into the Past
            </h2>
            <span className="font-mono text-xs text-[#9E9D97]">
              ({unit8Topics.length} chủ điểm)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unit8Topics.map((topic) => (
              <GrammarTopicCard
                key={topic.id}
                topic={topic}
                progress={progress.grammar[topic.id]}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
