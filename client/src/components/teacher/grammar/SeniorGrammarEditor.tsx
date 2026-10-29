import React, { useCallback, useState } from 'react';
import { GrammarService } from '../../../Service/GrammarService';
import type {
  CreateGrammarExampleRequest,
  CreateGrammarRuleRequest,
  CreateGrammarTopicRequest,
  GrammarTopicDto,
  QuestionDto,
} from '../../../types/api';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { SeniorQuestionEditor } from './SeniorQuestionEditor';

interface SeniorGrammarEditorProps {
  lessonId: number;
  topics: GrammarTopicDto[];
  isReadOnly?: boolean;
  onRefresh: () => Promise<void>;
}

export function SeniorGrammarEditor({
  lessonId,
  topics,
  isReadOnly = false,
  onRefresh,
}: SeniorGrammarEditorProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(
    topics[0]?.id ?? null
  );
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [isAddingTopic, setIsAddingTopic] = useState<boolean>(false);
  const [newTopicTitle, setNewTopicTitle] = useState<string>('');
  const [newTopicSummary, setNewTopicSummary] = useState<string>('');
  const [isAddingRule, setIsAddingRule] = useState<boolean>(false);
  const [ruleTitle, setRuleTitle] = useState<string>('');
  const [ruleFormula, setRuleFormula] = useState<string>('');
  const [ruleExplanation, setRuleExplanation] = useState<string>('');
  const [rulePitfall, setRulePitfall] = useState<string>('');
  const [activeRuleForExample, setActiveRuleForExample] = useState<number | null>(null);
  const [exTextEn, setExTextEn] = useState<string>('');
  const [exTextVi, setExTextVi] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const activeTopic = topics.find((t) => t.id === selectedTopicId) ?? topics[0] ?? null;

  const refreshQuestions = useCallback(async () => {
    if (activeTopic) {
      try {
        const qList = await GrammarService.getTopicQuestions(activeTopic.id);
        setQuestions(qList);
      } catch {
        setQuestions([]);
      }
    }
  }, [activeTopic]);

  React.useEffect(() => {
    let active = true;
    if (activeTopic) {
      GrammarService.getTopicQuestions(activeTopic.id)
        .then((qList) => {
          if (active) setQuestions(qList);
        })
        .catch(() => {
          if (active) setQuestions([]);
        });
    }
    return () => {
      active = false;
    };
  }, [activeTopic]);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const payload: CreateGrammarTopicRequest = {
        title: newTopicTitle.trim(),
        summary: newTopicSummary.trim() || null,
      };
      const created = await GrammarService.createGrammarTopic(lessonId, payload);
      setNewTopicTitle('');
      setNewTopicSummary('');
      setIsAddingTopic(false);
      await onRefresh();
      setSelectedTopicId(created.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tạo chủ đề');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId: number) => {
    if (!window.confirm('Xoá toàn bộ chủ đề ngữ pháp này kèm theo các quy tắc và câu hỏi?')) return;
    setLoading(true);
    try {
      await GrammarService.deleteGrammarTopic(topicId);
      await onRefresh();
      if (selectedTopicId === topicId) setSelectedTopicId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xoá chủ đề');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopic || !ruleTitle.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const payload: CreateGrammarRuleRequest = {
        title: ruleTitle.trim(),
        formula: ruleFormula.trim() || null,
        explanation: ruleExplanation.trim() || null,
        pitfallNote: rulePitfall.trim() || null,
      };
      await GrammarService.createGrammarRule(activeTopic.id, payload);
      setRuleTitle('');
      setRuleFormula('');
      setRuleExplanation('');
      setRulePitfall('');
      setIsAddingRule(false);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tạo quy tắc');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (ruleId: number) => {
    if (!window.confirm('Xoá quy tắc này?')) return;
    setLoading(true);
    try {
      await GrammarService.deleteGrammarRule(ruleId);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xoá quy tắc');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRuleForExample || !exTextEn.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const payload: CreateGrammarExampleRequest = {
        textEn: exTextEn.trim(),
        textVi: exTextVi.trim() || null,
      };
      await GrammarService.createGrammarExample(activeRuleForExample, payload);
      setExTextEn('');
      setExTextVi('');
      setActiveRuleForExample(null);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi thêm ví dụ');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExample = async (exId: number) => {
    setLoading(true);
    try {
      await GrammarService.deleteGrammarExample(exId);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xoá ví dụ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Topics pill selection */}
      <div className="flex flex-wrap items-center gap-2">
        {topics.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedTopicId(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTopic?.id === t.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-[#F4F3EF] text-[#6B6A66] hover:bg-[#E8E7E4]'
            }`}
          >
            📘 {t.title}
          </button>
        ))}

        {!isReadOnly && !isAddingTopic && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddingTopic(true)}
          >
            + Thêm chủ đề
          </Button>
        )}
      </div>

      {/* Add Topic Form */}
      {isAddingTopic && !isReadOnly && (
        <Card innerClassName="p-4 space-y-3 bg-indigo-50/50 border border-indigo-200">
          <h4 className="font-bold text-sm text-gray-800">
            Thêm chủ đề ngữ pháp mới (VD: Present Simple, Past Simple...)
          </h4>
          <form onSubmit={handleCreateTopic} className="space-y-2">
            <Input
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              placeholder="Tên chủ đề..."
              required
              autoFocus
            />
            <Input
              value={newTopicSummary}
              onChange={(e) => setNewTopicSummary(e.target.value)}
              placeholder="Tóm tắt ngắn (tùy chọn)..."
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsAddingTopic(false)}
              >
                Hủy
              </Button>
              <Button type="submit" size="sm" variant="primary" disabled={loading}>
                Lưu chủ đề
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Active Topic Details */}
      {activeTopic && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-gray-900">
                {activeTopic.title}
              </h3>
              {activeTopic.summary && (
                <p className="text-xs text-gray-600 mt-0.5">{activeTopic.summary}</p>
              )}
            </div>
            {!isReadOnly && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeleteTopic(activeTopic.id)}
              >
                Xóa chủ đề này
              </Button>
            )}
          </div>

          {/* Section: Rules */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-gray-800">
                Các quy tắc ngữ pháp ({activeTopic.rules.length})
              </h4>
              {!isReadOnly && !isAddingRule && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsAddingRule(true)}
                >
                  + Thêm quy tắc
                </Button>
              )}
            </div>

            {isAddingRule && !isReadOnly && (
              <Card innerClassName="p-4 space-y-3 bg-blue-50/50 border border-blue-200">
                <h5 className="font-bold text-sm text-gray-800">Tạo quy tắc mới</h5>
                <form onSubmit={handleCreateRule} className="space-y-2">
                  <Input
                    value={ruleTitle}
                    onChange={(e) => setRuleTitle(e.target.value)}
                    placeholder="Tiêu đề quy tắc (VD: Thể khẳng định / Affirmative form)"
                    required
                  />
                  <Input
                    value={ruleFormula}
                    onChange={(e) => setRuleFormula(e.target.value)}
                    placeholder="Công thức (Formula, VD: S + V(s/es) + O)"
                  />
                  <Input
                    value={ruleExplanation}
                    onChange={(e) => setRuleExplanation(e.target.value)}
                    placeholder="Giải thích cách dùng..."
                  />
                  <Input
                    value={rulePitfall}
                    onChange={(e) => setRulePitfall(e.target.value)}
                    placeholder="Lỗi thường gặp (Pitfall note, VD: Không dùng don't với he/she/it)..."
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAddingRule(false)}
                    >
                      Hủy
                    </Button>
                    <Button type="submit" size="sm" variant="primary" disabled={loading}>
                      Lưu quy tắc
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* List of rules */}
            <div className="space-y-4">
              {activeTopic.rules.map((rule) => (
                <Card key={rule.id} innerClassName="p-4 space-y-3 border-l-4 border-l-indigo-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-bold text-base text-gray-900">{rule.title}</h5>
                      {rule.formula && (
                        <div className="mt-1 inline-block px-3 py-1 bg-amber-50 border border-amber-200 rounded-md font-mono text-xs text-amber-900 font-bold">
                          {rule.formula}
                        </div>
                      )}
                      {rule.explanation && (
                        <p className="text-xs text-gray-700 mt-2">{rule.explanation}</p>
                      )}
                      {rule.pitfallNote && (
                        <p className="text-xs text-orange-700 bg-orange-50 p-2 rounded mt-2 border border-orange-200">
                          ⚠️ Lưu ý lỗi thường gặp: {rule.pitfallNote}
                        </p>
                      )}
                    </div>
                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-gray-400 hover:text-red-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Examples for this rule */}
                  <div className="pt-2 border-t space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-600">
                        Ví dụ minh họa ({rule.examples.length})
                      </span>
                      {!isReadOnly && activeRuleForExample !== rule.id && (
                        <button
                          type="button"
                          onClick={() => setActiveRuleForExample(rule.id)}
                          className="text-xs font-bold text-indigo-600 hover:underline"
                        >
                          + Thêm ví dụ
                        </button>
                      )}
                    </div>

                    {activeRuleForExample === rule.id && !isReadOnly && (
                      <form onSubmit={handleCreateExample} className="p-3 bg-gray-50 rounded-lg space-y-2 border">
                        <Input
                          value={exTextEn}
                          onChange={(e) => setExTextEn(e.target.value)}
                          placeholder="Câu tiếng Anh (VD: He plays football every Sunday.)"
                          required
                        />
                        <Input
                          value={exTextVi}
                          onChange={(e) => setExTextVi(e.target.value)}
                          placeholder="Dịch tiếng Việt (VD: Anh ấy chơi bóng đá vào mỗi Chủ nhật.)"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveRuleForExample(null)}
                          >
                            Hủy
                          </Button>
                          <Button type="submit" size="sm" variant="primary" disabled={loading}>
                            Lưu
                          </Button>
                        </div>
                      </form>
                    )}

                    <div className="space-y-1">
                      {rule.examples.map((ex) => (
                        <div
                          key={ex.id}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded bg-gray-50"
                        >
                          <div>
                            <span className="font-semibold text-gray-800">{ex.textEn}</span>
                            {ex.textVi && (
                              <span className="text-gray-500 italic ml-2">({ex.textVi})</span>
                            )}
                          </div>
                          {!isReadOnly && (
                            <button
                              type="button"
                              onClick={() => handleDeleteExample(ex.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}

              {activeTopic.rules.length === 0 && !isAddingRule && (
                <p className="text-xs text-gray-400 italic py-2">
                  Chưa có quy tắc ngữ pháp nào. Bấm &quot;Thêm quy tắc&quot; để thiết lập công thức và giải thích.
                </p>
              )}
            </div>
          </div>

          {/* Section: Questions Editor */}
          <SeniorQuestionEditor
            topicId={activeTopic.id}
            questions={questions}
            isReadOnly={isReadOnly}
            onQuestionsChanged={refreshQuestions}
          />
        </div>
      )}
    </div>
  );
}
