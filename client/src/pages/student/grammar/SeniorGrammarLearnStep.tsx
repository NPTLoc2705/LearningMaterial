import type { GrammarTopicDto } from '../../../types/api';
import { Button } from '../../../components/ui/Button';

interface SeniorGrammarLearnStepProps {
  topic: GrammarTopicDto;
  onProceedToPractice: () => void;
}

export function SeniorGrammarLearnStep({
  topic,
  onProceedToPractice,
}: SeniorGrammarLearnStepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-2">
        <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-mono tracking-wider uppercase font-semibold">
          Bước 1 · Học lý thuyết & Công thức
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
          {topic.title}
        </h1>
        {topic.summary && (
          <p className="text-indigo-100 text-sm sm:text-base max-w-2xl">
            {topic.summary}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {topic.rules.map((rule) => (
          <div
            key={rule.id}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4 hover:border-indigo-200 transition-all"
          >
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-gray-900">
                {rule.title}
              </h3>
            </div>

            {/* Formula box */}
            {rule.formula && (
              <div className="p-4 bg-indigo-50 border-2 border-indigo-100 rounded-xl font-mono text-sm sm:text-base font-bold text-indigo-950 flex items-center gap-3">
                <span className="text-xl">📐</span>
                <span>{rule.formula}</span>
              </div>
            )}

            {/* Explanation */}
            {rule.explanation && (
              <div className="text-gray-700 text-sm sm:text-base leading-relaxed bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                <p className="font-semibold text-gray-800 mb-1">Cách sử dụng & Quy tắc:</p>
                <p>{rule.explanation}</p>
              </div>
            )}

            {/* Common pitfall note */}
            {rule.pitfallNote && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-amber-800">
                  <span>⚠️</span> Lưu ý lỗi thường gặp (Common Pitfall):
                </p>
                <p>{rule.pitfallNote}</p>
              </div>
            )}

            {/* Examples */}
            {rule.examples.length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Ví dụ minh họa:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {rule.examples.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                    >
                      <span className="font-bold text-gray-900 text-sm">
                        {ex.textEn}
                      </span>
                      {ex.textVi && (
                        <span className="text-xs text-gray-500 italic">
                          {ex.textVi}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          size="lg"
          variant="primary"
          onClick={onProceedToPractice}
          className="min-h-[52px] px-8 text-base font-bold shadow-md"
        >
          Tiếp tục: Luyện tập có hướng dẫn ➔
        </Button>
      </div>
    </div>
  );
}
