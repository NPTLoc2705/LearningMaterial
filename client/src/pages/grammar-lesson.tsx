import { useState } from 'react';
import { useParams, NavLink, Navigate } from 'react-router-dom';
import grammarData from '../data/grammar.json';
import { GRAMMAR_EXTENDED_DATA } from '../data/grammar-extended';
import type { GrammarTopic } from '../types/grammar';
import { GrammarRuleRenderer } from '../components/grammar/GrammarRuleRenderer';
import { ModularRuleRenderer } from '../components/grammar/ModularRuleRenderer';
import { TopicPracticeDrill } from '../components/grammar/TopicPracticeDrill';
import { DynamicDrillEngine } from '../components/grammar/DynamicDrillEngine';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { IconArrowLeft, IconCheck, IconBook, IconPen } from '../components/ui/Icons';
import { FormattedText } from '../components/ui/FormattedText';
import type { useProgress } from '../hooks/use-progress';

const allTopics = grammarData as GrammarTopic[];
const TOPIC_MAP = new Map<string, GrammarTopic>(allTopics.map((t) => [t.id, t]));

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  'Main grammar': 'Ngữ pháp chính',
  'Speaking strategy': 'Kỹ năng nói',
  'Reading strategy': 'Kỹ năng đọc',
  'Extra grammar': 'Ngữ pháp mở rộng',
  'Language notes': 'Ghi chú ngôn ngữ',
};

export interface GrammarLessonPageProps {
  progressHook: ReturnType<typeof useProgress>;
}

export function GrammarLessonPage({ progressHook }: GrammarLessonPageProps) {
  const { topicId } = useParams<{ topicId: string }>();
  const { progress, setGrammarCompleted, recordGrammarScore } = progressHook;

  const topic = topicId ? TOPIC_MAP.get(topicId) : undefined;
  const [activeTab, setActiveTab] = useState<'rules' | 'practice'>('rules');

  if (!topic) {
    return <Navigate to="/grammar" replace />;
  }

  const extendedData = GRAMMAR_EXTENDED_DATA[topic.id];
  const topicProgress = progress.grammar[topic.id];
  const isCompleted = !!topicProgress?.completed;

  const toggleCompleted = () => {
    setGrammarCompleted(topic.id, !isCompleted);
  };

  const exerciseCount = extendedData?.drillBank?.length || topic.practiceExercises.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E7E4] pb-4">
        <NavLink
          to="/grammar"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#9E9D97] hover:text-[#141413] transition-colors"
        >
          <IconArrowLeft size={12} />
          <span>Tất cả chủ điểm ngữ pháp</span>
        </NavLink>

        <Button
          variant={isCompleted ? 'success' : 'outline'}
          size="sm"
          onClick={toggleCompleted}
          className="self-start sm:self-auto gap-1.5 touch-manipulation"
        >
          <IconCheck size={13} />
          <span>{isCompleted ? 'Đã hoàn thành' : 'Đánh dấu đã học'}</span>
        </Button>
      </div>

      {/* Lesson Header Card */}
      <Card innerClassName="p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="slate" size="sm">
            Unit {topic.unit}
          </Badge>
          {topic.lesson && (
            <Badge variant="slate" size="sm">
              {topic.lesson}
            </Badge>
          )}
          <Badge variant="blue" size="sm">
            {CATEGORY_TRANSLATIONS[topic.category] || topic.category}
          </Badge>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#141413]">
          <FormattedText text={topic.title} />
        </h1>
      </Card>

      {/* Editorial Tab Switcher */}
      <div className="flex items-center border-b border-[#E8E7E4] gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('rules')}
          className={`pb-3 text-xs sm:text-sm font-medium flex items-center gap-2 border-b-2 transition-all touch-manipulation ${
            activeTab === 'rules'
              ? 'border-[#141413] text-[#141413] font-semibold'
              : 'border-transparent text-[#9E9D97] hover:text-[#141413]'
          }`}
        >
          <IconBook size={14} />
          <span>Lý thuyết &amp; Công thức</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('practice')}
          className={`pb-3 text-xs sm:text-sm font-medium flex items-center gap-2 border-b-2 transition-all touch-manipulation ${
            activeTab === 'practice'
              ? 'border-[#141413] text-[#141413] font-semibold'
              : 'border-transparent text-[#9E9D97] hover:text-[#141413]'
          }`}
        >
          <IconPen size={14} />
          <span>Bài tập vận dụng</span>
          {exerciseCount > 0 && (
            <span className="font-mono text-[10px] bg-[#F4F3EF] text-[#6B6A66] px-1.5 py-0.5 rounded">
              {extendedData?.drillBank ? '6 câu / lượt' : exerciseCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'rules' ? (
        extendedData?.modularRules ? (
          <ModularRuleRenderer
            topic={topic}
            modularRules={extendedData.modularRules}
          />
        ) : (
          <GrammarRuleRenderer topic={topic} />
        )
      ) : extendedData?.drillBank && extendedData.drillBank.length > 0 ? (
        <DynamicDrillEngine
          key={topic.id}
          drillBank={extendedData.drillBank}
          onCompleteDrill={(score, total) => {
            recordGrammarScore(topic.id, score, total);
          }}
        />
      ) : (
        <TopicPracticeDrill
          key={topic.id}
          exercises={topic.practiceExercises}
          onCompleteDrill={(score, total) => {
            recordGrammarScore(topic.id, score, total);
          }}
        />
      )}
    </div>
  );
}
