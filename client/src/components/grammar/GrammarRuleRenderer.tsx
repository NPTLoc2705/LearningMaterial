import type { GrammarTopic } from '../../types/grammar';
import { GrammarTable } from './GrammarTable';
import { IconBook, IconSparkles, IconCheck } from '../ui/Icons';
import { FormattedText } from '../ui/FormattedText';

export interface GrammarRuleRendererProps {
  topic: GrammarTopic;
}

export function GrammarRuleRenderer({ topic }: GrammarRuleRendererProps) {
  return (
    <div className="space-y-6">
      {/* Rule summary / Use definition */}
      {topic.summaryText && (
        <div className="p-4 bg-[#F6F5F2] border border-[#E8E7E4] rounded-xl flex items-start gap-3">
          <IconSparkles size={16} className="text-[#141413] flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#141413] leading-relaxed font-normal">
            <FormattedText text={topic.summaryText} />
          </div>
        </div>
      )}

      {/* Grammar Rule & Structure Tables */}
      {topic.ruleTables.map((table, tIdx) => (
        <div key={tIdx} className="space-y-2">
          <GrammarTable table={table} />
        </div>
      ))}

      {/* Special Patterns & Context Notes */}
      {topic.patterns && topic.patterns.length > 0 && (
        <div className="p-4 bg-[#FBF3DB] border border-[#F5E6BF] rounded-xl space-y-2">
          {topic.patterns.map((pattern, pIdx) => (
            <p key={pIdx} className="text-xs sm:text-sm text-[#956400] leading-relaxed">
              <FormattedText text={pattern} />
            </p>
          ))}
        </div>
      )}

      {/* Verbatim Examples from the Lesson */}
      {topic.examples.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#9E9D97] flex items-center gap-1.5">
            <IconBook size={14} className="text-[#141413]" />
            Ví dụ minh họa trong bài học:
          </h4>
          <ul className="space-y-2">
            {topic.examples.map((example, eIdx) => (
              <li
                key={eIdx}
                className="p-3 bg-white rounded-lg border border-[#E8E7E4] text-xs sm:text-sm text-[#141413] flex items-start gap-2.5 shadow-subtle"
              >
                <IconCheck size={14} className="text-[#346538] flex-shrink-0 mt-0.5" />
                <span className="font-serif italic text-[#141413] text-[13px] sm:text-sm">
                  <FormattedText text={example} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Language Notes */}
      {topic.notes && topic.notes.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#9E9D97] flex items-center gap-1.5">
            <IconSparkles size={14} className="text-[#141413]" />
            Điểm ngữ pháp &amp; lưu ý trọng tâm:
          </h4>
          <ul className="space-y-2">
            {topic.notes.map((note, nIdx) => (
              <li
                key={nIdx}
                className="p-3 bg-white rounded-lg border border-[#E8E7E4] text-xs sm:text-sm text-[#141413] leading-relaxed"
              >
                <FormattedText text={note} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
