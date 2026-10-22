import { NavLink } from 'react-router-dom';
import type { GrammarTopic } from '../../types/grammar';
import type { GrammarProgress } from '../../types/progress';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { IconCheck, IconChevronRight, IconPen } from '../ui/Icons';
import { FormattedText } from '../ui/FormattedText';

export interface GrammarTopicCardProps {
  topic: GrammarTopic;
  progress?: GrammarProgress;
}

export function GrammarTopicCard({ topic, progress }: GrammarTopicCardProps) {
  const isCompleted = progress?.completed;

  const categoryVariants: Record<string, 'slate' | 'blue' | 'amber' | 'green'> = {
    'Main grammar': 'slate',
    'Speaking strategy': 'blue',
    'Reading strategy': 'amber',
    'Extra grammar': 'slate',
    'Language notes': 'slate',
  };

  const categoryTranslations: Record<string, string> = {
    'Main grammar': 'Ngữ pháp chính',
    'Speaking strategy': 'Kỹ năng nói',
    'Reading strategy': 'Kỹ năng đọc',
    'Extra grammar': 'Ngữ pháp mở rộng',
    'Language notes': 'Ghi chú ngôn ngữ',
  };

  const badgeVariant = categoryVariants[topic.category] || 'slate';
  const categoryLabel = categoryTranslations[topic.category] || topic.category;

  return (
    <NavLink to={`/grammar/${topic.id}`} className="block h-full group touch-manipulation">
      <Card
        hoverable
        innerClassName={`p-5 flex flex-col justify-between h-full ${
          isCompleted ? 'bg-[#FAFDF9]' : ''
        }`}
      >
        <div>
          {/* Badges */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="slate" size="sm">
                Unit {topic.unit}
              </Badge>
              {topic.lesson && (
                <Badge variant="slate" size="sm">
                  {topic.lesson}
                </Badge>
              )}
              <Badge variant={badgeVariant} size="sm">
                {categoryLabel}
              </Badge>
            </div>

            {isCompleted && (
              <span className="flex items-center gap-1 font-mono text-[11px] text-[#346538] bg-[#EDF3EC] px-2 py-0.5 rounded border border-[#DCE8DA]">
                <IconCheck size={11} />
                ĐÃ HỌC
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif text-xl font-bold tracking-tight text-[#141413] group-hover:underline transition-all mb-2">
            <FormattedText text={topic.title} />
          </h3>

          {/* Snippet */}
          {topic.summaryText && (
            <p className="text-xs text-[#6B6A66] line-clamp-2 leading-relaxed mb-4">
              {topic.summaryText}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#EFEFEA] flex items-center justify-between font-mono text-xs text-[#9E9D97]">
          <div className="flex items-center gap-1.5">
            {topic.practiceExercises.length > 0 ? (
              <span className="flex items-center gap-1 text-[#141413] font-medium">
                <IconPen size={12} />
                {topic.practiceExercises.length} bài luyện tập
              </span>
            ) : (
              <span className="text-[#9E9D97]">Lý thuyết</span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[#6B6A66] group-hover:text-[#141413] transition-colors">
            <span>Xem bài</span>
            <IconChevronRight size={13} />
          </div>
        </div>
      </Card>
    </NavLink>
  );
}
