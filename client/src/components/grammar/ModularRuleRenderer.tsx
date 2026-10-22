import type { GrammarTopic, ModularRuleCard } from '../../types/grammar';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { IconSparkles, IconInfo, IconCheck } from '../ui/Icons';
import { FormattedText } from '../ui/FormattedText';

export interface ModularRuleRendererProps {
  topic: GrammarTopic;
  modularRules?: ModularRuleCard[];
}

export function ModularRuleRenderer({
  topic,
  modularRules,
}: ModularRuleRendererProps) {
  const hasModularRules = modularRules && modularRules.length > 0;

  return (
    <div className="space-y-6">
      {/* Topic Overview Summary */}
      {topic.summaryText && (
        <div className="p-4 bg-[#F6F5F2] border border-[#E8E7E4] rounded-xl flex items-start gap-3">
          <IconSparkles size={16} className="text-[#141413] flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#141413] leading-relaxed font-normal">
            <FormattedText text={topic.summaryText} />
          </div>
        </div>
      )}

      {/* Modular Rule Cards */}
      {hasModularRules ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-1 border-b border-[#EFEFEA]">
            <h3 className="font-serif text-lg font-semibold text-[#141413]">
              Hệ thống công thức &amp; Hướng dẫn áp dụng
            </h3>
            <span className="font-mono text-xs text-[#9E9D97]">
              {modularRules.length} quy tắc trọng tâm
            </span>
          </div>

          {modularRules.map((rule, idx) => (
            <Card key={rule.id} innerClassName="p-5 sm:p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#EFEFEA]">
                <div className="flex items-center gap-2">
                  <Badge variant="slate" size="sm">
                    Quy tắc {idx + 1}
                  </Badge>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#141413]">
                    {rule.title}
                  </h4>
                </div>
              </div>

              {/* Formula Block */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D97] block mb-1">
                  Công thức chuẩn:
                </span>
                <div className="bg-[#1E1D1B] text-[#FBFBFA] px-4 py-2.5 rounded-lg font-mono text-xs sm:text-sm tracking-wide border border-[#2E2D2A] shadow-inner">
                  <code>{rule.formula}</code>
                </div>
              </div>

              {/* Contextual Example */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D97] block mb-1">
                  Ví dụ minh họa cụ thể:
                </span>
                <div className="p-3 bg-[#FBFBFA] rounded-lg border border-[#E8E7E4] text-xs sm:text-sm space-y-1">
                  <p className="font-serif italic text-[#141413] font-medium text-[13px] sm:text-sm">
                    "{rule.exampleEn}"
                  </p>
                  {rule.exampleVi && (
                    <p className="text-[#6B6A66] text-xs">
                      → {rule.exampleVi}
                    </p>
                  )}
                </div>
              </div>

              {/* Explanation of Why */}
              <div className="text-xs sm:text-sm text-[#141413] leading-relaxed space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#9E9D97] block">
                  Tại sao lại dùng như vậy?
                </span>
                <p className="text-[#403F3B]">
                  {rule.explanation}
                </p>
              </div>

              {/* Common Pitfall Warning Box */}
              {rule.commonPitfall && (
                <div className="p-4 bg-[#FBF3DB] border border-[#F5E6BF] rounded-xl text-xs sm:text-sm text-[#956400] space-y-2">
                  <div className="flex items-center gap-1.5 font-bold font-mono text-[11px] uppercase tracking-wider text-[#8A5D00]">
                    <IconInfo size={14} className="flex-shrink-0" />
                    <span>Lưu ý bẫy hay nhầm lẫn nhất ({rule.commonPitfall.confusedWith}):</span>
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <p className="font-mono text-xs bg-white/60 p-2 rounded border border-[#EEDDB0] text-[#A23B38]">
                      {rule.commonPitfall.mistakeExample}
                    </p>
                    <p className="font-medium leading-relaxed text-[#7C5300]">
                      {rule.commonPitfall.ruleTip}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : null}

      {/* Special Patterns & Context Notes from Source */}
      {topic.patterns && topic.patterns.length > 0 && (
        <div className="p-4 bg-[#FBF3DB] border border-[#F5E6BF] rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 font-bold font-mono text-[11px] uppercase tracking-wider text-[#8A5D00] mb-1">
            <IconInfo size={14} />
            <span>Mẫu câu &amp; Lưu ý bổ sung:</span>
          </div>
          {topic.patterns.map((pattern, pIdx) => (
            <p key={pIdx} className="text-xs sm:text-sm text-[#956400] leading-relaxed">
              <FormattedText text={pattern} />
            </p>
          ))}
        </div>
      )}

      {/* Lesson Examples List */}
      {topic.examples && topic.examples.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#9E9D97] flex items-center gap-1.5">
            <IconCheck size={14} className="text-[#346538]" />
            Thêm các câu ví dụ từ bài học:
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
    </div>
  );
}
