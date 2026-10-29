import React, { useState } from 'react';
import { GrammarService } from '../../../Service/GrammarService';
import type {
  CreateGrammarExampleRequest,
  CreateGrammarTopicRequest,
  CreateQuestionRequest,
  GrammarExampleDto,
  GrammarTopicDto,
  QuestionDto,
} from '../../../types/api';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { SpeakerButton } from '../../kids/SpeakerButton';
import { SignedMediaImage } from '../../common/SignedMediaImage';

interface YoungGrammarEditorProps {
  lessonId: number;
  topics: GrammarTopicDto[];
  isReadOnly?: boolean;
  onRefresh: () => Promise<void>;
}

export function YoungGrammarEditor({
  lessonId,
  topics,
  isReadOnly = false,
  onRefresh,
}: YoungGrammarEditorProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(
    topics[0]?.id ?? null
  );
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [isAddingTopic, setIsAddingTopic] = useState<boolean>(false);
  const [newTopicTitle, setNewTopicTitle] = useState<string>('');
  const [isAddingExample, setIsAddingExample] = useState<boolean>(false);
  const [exampleEn, setExampleEn] = useState<string>('');
  const [exampleVi, setExampleVi] = useState<string>('');
  const [exampleImageKey, setExampleImageKey] = useState<string>('');
  const [isAddingQuestion, setIsAddingQuestion] = useState<boolean>(false);
  const [qPrompt, setQPrompt] = useState<string>('');
  const [qChoices, setQChoices] = useState<string[]>(['', '', '']);
  const [correctChoiceIndex, setCorrectChoiceIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const activeTopic = topics.find((t) => t.id === selectedTopicId) ?? topics[0] ?? null;

  // Load questions when active topic changes
  React.useEffect(() => {
    if (activeTopic) {
      GrammarService.getTopicQuestions(activeTopic.id)
        .then(setQuestions)
        .catch(() => setQuestions([]));
    }
  }, [activeTopic]);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const payload: CreateGrammarTopicRequest = {
        title: newTopicTitle.trim(),
      };
      const created = await GrammarService.createGrammarTopic(lessonId, payload);
      // Ensure Young topic has a default rule container for examples
      await GrammarService.createGrammarRule(created.id, {
        title: created.title,
      });
      setNewTopicTitle('');
      setIsAddingTopic(false);
      await onRefresh();
      setSelectedTopicId(created.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tạo mẫu câu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId: number) => {
    if (!window.confirm('Bạn có chắc muốn xoá mẫu câu này?')) return;
    setLoading(true);
    try {
      await GrammarService.deleteGrammarTopic(topicId);
      await onRefresh();
      if (selectedTopicId === topicId) {
        setSelectedTopicId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xoá mẫu câu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopic || !exampleEn.trim()) return;
    setLoading(true);
    setError(null);
    try {
      let targetRule = activeTopic.rules[0];
      if (!targetRule) {
        targetRule = await GrammarService.createGrammarRule(activeTopic.id, {
          title: activeTopic.title,
        });
      }
      const payload: CreateGrammarExampleRequest = {
        textEn: exampleEn.trim(),
        textVi: exampleVi.trim() || null,
        imageKey: exampleImageKey.trim() || null,
      };
      await GrammarService.createGrammarExample(targetRule.id, payload);
      setExampleEn('');
      setExampleVi('');
      setExampleImageKey('');
      setIsAddingExample(false);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi thêm câu mẫu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExample = async (exampleId: number) => {
    setLoading(true);
    try {
      await GrammarService.deleteGrammarExample(exampleId);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xoá câu ví dụ');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopic || !qPrompt.trim()) return;
    const filteredChoices = qChoices.filter((c) => c.trim().length > 0);
    if (filteredChoices.length < 2) {
      setError('Cần ít nhất 2 lựa chọn cho câu hỏi trắc nghiệm.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload: CreateQuestionRequest = {
        type: 'MultipleChoice',
        purpose: 'GuidedPractice',
        prompt: qPrompt.trim(),
        options: filteredChoices.map((text, idx) => ({
          text: text.trim(),
          isCorrect: idx === correctChoiceIndex,
          sortOrder: idx,
        })),
      };
      const created = await GrammarService.createQuestion(activeTopic.id, payload);
      setQuestions((prev) => [...prev, created]);
      setQPrompt('');
      setQChoices(['', '', '']);
      setCorrectChoiceIndex(0);
      setIsAddingQuestion(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tạo câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (qId: number) => {
    setLoading(true);
    try {
      await GrammarService.deleteQuestion(qId);
      setQuestions((prev) => prev.filter((q) => q.id !== qId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xoá câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const allExamples: GrammarExampleDto[] = activeTopic
    ? activeTopic.rules.flatMap((r) => r.examples)
    : [];

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
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-[#F4F3EF] text-[#6B6A66] hover:bg-[#E8E7E4]'
            }`}
          >
            💬 {t.title}
          </button>
        ))}

        {!isReadOnly && !isAddingTopic && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddingTopic(true)}
          >
            + Thêm mẫu câu
          </Button>
        )}
      </div>

      {/* Add Topic Form */}
      {isAddingTopic && !isReadOnly && (
        <Card innerClassName="p-4 space-y-3 bg-amber-50/50 border border-amber-200">
          <h4 className="font-bold text-sm text-gray-800">
            Thêm nhóm mẫu câu mới (Ví dụ: &quot;Hỏi tên - What is your name?&quot;)
          </h4>
          <form onSubmit={handleCreateTopic} className="flex gap-2">
            <Input
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              placeholder="Tên nhóm mẫu câu..."
              className="flex-1"
              autoFocus
            />
            <Button type="submit" size="sm" variant="primary" disabled={loading}>
              Lưu
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsAddingTopic(false)}
            >
              Hủy
            </Button>
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
              <p className="text-xs text-gray-500">
                Dành cho khối Young (Mẫu câu trực quan, hình ảnh, phát âm)
              </p>
            </div>
            {!isReadOnly && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeleteTopic(activeTopic.id)}
              >
                Xóa mẫu câu này
              </Button>
            )}
          </div>

          {/* Section: Example Sentences */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-gray-800">
                Câu mẫu và hình ảnh ({allExamples.length})
              </h4>
              {!isReadOnly && !isAddingExample && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsAddingExample(true)}
                >
                  + Thêm câu mẫu
                </Button>
              )}
            </div>

            {isAddingExample && !isReadOnly && (
              <Card innerClassName="p-4 space-y-3 bg-blue-50/50 border border-blue-200">
                <h5 className="font-bold text-sm text-gray-800">Thêm câu mẫu</h5>
                <form onSubmit={handleAddExample} className="space-y-2">
                  <Input
                    value={exampleEn}
                    onChange={(e) => setExampleEn(e.target.value)}
                    placeholder="Câu tiếng Anh (VD: What is this? / It is a cat.)"
                    required
                  />
                  <Input
                    value={exampleVi}
                    onChange={(e) => setExampleVi(e.target.value)}
                    placeholder="Dịch nghĩa tiếng Việt (VD: Đây là cái gì? / Đó là con mèo.)"
                  />
                  <Input
                    value={exampleImageKey}
                    onChange={(e) => setExampleImageKey(e.target.value)}
                    placeholder="Khóa hình ảnh (tùy chọn: key lưu trữ media)"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAddingExample(false)}
                    >
                      Hủy
                    </Button>
                    <Button type="submit" size="sm" variant="primary" disabled={loading}>
                      Lưu câu mẫu
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allExamples.map((ex) => (
                <div
                  key={ex.id}
                  className="p-3 rounded-xl border border-gray-200 bg-white shadow-sm flex items-start gap-3 justify-between"
                >
                  <div className="flex items-start gap-3">
                    {ex.imageKey && (
                      <SignedMediaImage
                        imageKey={ex.imageKey}
                        alt={ex.textEn}
                        className="w-14 h-14 rounded-lg object-cover border shrink-0 bg-gray-50"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">
                          {ex.textEn}
                        </span>
                        <SpeakerButton text={ex.textEn} size="md" />
                      </div>
                      {ex.textVi && (
                        <p className="text-xs text-gray-500 mt-0.5">{ex.textVi}</p>
                      )}
                    </div>
                  </div>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => handleDeleteExample(ex.id)}
                      className="text-gray-400 hover:text-red-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {allExamples.length === 0 && !isAddingExample && (
                <p className="text-xs text-gray-400 italic py-2 col-span-2">
                  Chưa có câu mẫu nào. Nhấn &quot;Thêm câu mẫu&quot; để bổ sung câu giao tiếp.
                </p>
              )}
            </div>
          </div>

          {/* Section: Simple Question Creator */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-base text-gray-800">
                  Câu hỏi luyện tập trắc nghiệm ({questions.length})
                </h4>
                <p className="text-xs text-gray-500">
                  Câu hỏi dành cho hoạt động luyện mẫu câu của học sinh
                </p>
              </div>
              {!isReadOnly && !isAddingQuestion && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsAddingQuestion(true)}
                >
                  + Tạo câu hỏi
                </Button>
              )}
            </div>

            {isAddingQuestion && !isReadOnly && (
              <Card innerClassName="p-4 space-y-4 bg-emerald-50/50 border border-emerald-200">
                <h5 className="font-bold text-sm text-gray-800">
                  Tạo câu hỏi trắc nghiệm đơn giản
                </h5>
                <form onSubmit={handleAddQuestion} className="space-y-3">
                  <Input
                    value={qPrompt}
                    onChange={(e) => setQPrompt(e.target.value)}
                    placeholder="Nội dung câu hỏi (VD: What is this? It is a ___.)"
                    required
                  />

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 block">
                      Các lựa chọn (chọn nút tròn để đánh dấu đáp án đúng):
                    </label>
                    {qChoices.map((choice, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctChoice"
                          checked={correctChoiceIndex === idx}
                          onChange={() => setCorrectChoiceIndex(idx)}
                          className="w-4 h-4 text-emerald-600 cursor-pointer"
                        />
                        <Input
                          value={choice}
                          onChange={(e) => {
                            const val = e.target.value;
                            setQChoices((prev) => {
                              const copy = [...prev];
                              copy[idx] = val;
                              return copy;
                            });
                          }}
                          placeholder={`Lựa chọn ${idx + 1}`}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAddingQuestion(false)}
                    >
                      Hủy
                    </Button>
                    <Button type="submit" size="sm" variant="primary" disabled={loading}>
                      Lưu câu hỏi
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <div className="space-y-2">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-gray-800">{q.prompt}</p>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((opt) => (
                        <span
                          key={opt.id}
                          className={`text-xs px-2.5 py-1 rounded-lg border ${
                            opt.isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                        >
                          {opt.text} {opt.isCorrect && '✓'}
                        </span>
                      ))}
                    </div>
                  </div>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="text-gray-400 hover:text-red-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {questions.length === 0 && !isAddingQuestion && (
                <p className="text-xs text-gray-400 italic py-2">
                  Chưa có câu hỏi nào. Hệ thống có thể tự động tạo câu hỏi trắc nghiệm từ các câu mẫu bên trên khi học sinh luyện tập.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
