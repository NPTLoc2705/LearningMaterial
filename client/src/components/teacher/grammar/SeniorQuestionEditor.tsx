import React, { useState } from 'react';
import { GrammarService } from '../../../Service/GrammarService';
import type {
  CreateQuestionRequest,
  QuestionDto,
  QuestionPurpose,
  QuestionType,
} from '../../../types/api';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';

interface SeniorQuestionEditorProps {
  topicId: number;
  questions: QuestionDto[];
  isReadOnly?: boolean;
  onQuestionsChanged: () => Promise<void>;
}

export function SeniorQuestionEditor({
  topicId,
  questions,
  isReadOnly = false,
  onQuestionsChanged,
}: SeniorQuestionEditorProps) {
  const [filterPurpose, setFilterPurpose] = useState<QuestionPurpose>('GuidedPractice');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [qType, setQType] = useState<QuestionType>('MultipleChoice');
  const [explanation, setExplanation] = useState<string>('');
  const [mcChoices, setMcChoices] = useState<string[]>(['', '', '', '']);
  const [mcCorrectIdx, setMcCorrectIdx] = useState<number>(0);
  const [fillBlankAnswer, setFillBlankAnswer] = useState<string>('');
  const [sentenceOrderParts, setSentenceOrderParts] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const filteredQuestions = questions.filter((q) => q.purpose === filterPurpose);

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    if (!explanation.trim()) {
      setError('Khối Senior bắt buộc phải có phần Giải thích (Explanation).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let optionsPayload: CreateQuestionRequest['options'] = [];

      if (qType === 'MultipleChoice') {
        const validChoices = mcChoices.filter((c) => c.trim().length > 0);
        if (validChoices.length < 2) {
          setError('Trắc nghiệm cần ít nhất 2 lựa chọn.');
          setLoading(false);
          return;
        }
        optionsPayload = validChoices.map((c, idx) => ({
          text: c.trim(),
          isCorrect: idx === mcCorrectIdx,
          sortOrder: idx,
        }));
      } else if (qType === 'FillBlank') {
        if (!fillBlankAnswer.trim()) {
          setError('Cần nhập đáp án đúng cho câu điền từ.');
          setLoading(false);
          return;
        }
        optionsPayload = [
          {
            text: fillBlankAnswer.trim(),
            isCorrect: true,
            sortOrder: 0,
          },
        ];
      } else if (qType === 'SentenceOrder') {
        const parts = sentenceOrderParts
          .split('/')
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        if (parts.length < 2) {
          setError('Cần ít nhất 2 cụm từ (ngăn cách bởi dấu /) để sắp xếp câu.');
          setLoading(false);
          return;
        }
        optionsPayload = parts.map((part, idx) => ({
          text: part,
          isCorrect: true,
          position: idx,
          sortOrder: idx,
        }));
      }

      const payload: CreateQuestionRequest = {
        type: qType,
        purpose: filterPurpose,
        prompt: prompt.trim(),
        explanation: explanation.trim(),
        options: optionsPayload,
      };

      await GrammarService.createQuestion(topicId, payload);
      setPrompt('');
      setExplanation('');
      setMcChoices(['', '', '', '']);
      setFillBlankAnswer('');
      setSentenceOrderParts('');
      setIsAdding(false);
      await onQuestionsChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tạo câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (qId: number) => {
    if (!window.confirm('Xoá câu hỏi này?')) return;
    setLoading(true);
    try {
      await GrammarService.deleteQuestion(qId);
      await onQuestionsChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xoá câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-base text-gray-800">
            Ngân hàng câu hỏi ngữ pháp
          </h4>
          <p className="text-xs text-gray-500">
            Phân loại theo mục đích: Luyện tập (Guided Practice) và Kiểm tra (Mini Test)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
            <button
              type="button"
              onClick={() => setFilterPurpose('GuidedPractice')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                filterPurpose === 'GuidedPractice'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Luyện tập ({questions.filter((q) => q.purpose === 'GuidedPractice').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterPurpose('MiniTest')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                filterPurpose === 'MiniTest'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Kiểm tra ({questions.filter((q) => q.purpose === 'MiniTest').length})
            </button>
          </div>

          {!isReadOnly && !isAdding && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsAdding(true)}
            >
              + Tạo câu hỏi
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {isAdding && !isReadOnly && (
        <Card innerClassName="p-4 space-y-4 bg-purple-50/50 border border-purple-200">
          <h5 className="font-bold text-sm text-gray-800">
            Tạo câu hỏi mới ({filterPurpose === 'GuidedPractice' ? 'Luyện tập' : 'Kiểm tra'})
          </h5>

          <form onSubmit={handleCreateQuestion} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Dạng câu hỏi:
                </label>
                <select
                  value={qType}
                  onChange={(e) => setQType(e.target.value as QuestionType)}
                  className="w-full text-sm rounded-lg border border-gray-300 p-2 bg-white"
                >
                  <option value="MultipleChoice">Trắc nghiệm (Multiple Choice)</option>
                  <option value="FillBlank">Điền vào chỗ trống (Fill in Blank)</option>
                  <option value="SentenceOrder">Sắp xếp câu (Sentence Order)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Mục đích:
                </label>
                <input
                  type="text"
                  readOnly
                  value={filterPurpose === 'GuidedPractice' ? 'Luyện tập có hướng dẫn' : 'Bài kiểm tra ngắn'}
                  className="w-full text-sm rounded-lg border border-gray-200 p-2 bg-gray-100 text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Nội dung câu hỏi (Prompt):
              </label>
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="VD: She usually ___ to school by bike."
                required
              />
            </div>

            {/* Question options based on type */}
            {qType === 'MultipleChoice' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">
                  Các lựa chọn (chọn nút tròn để xác định đáp án đúng):
                </label>
                {mcChoices.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="seniorCorrectChoice"
                      checked={mcCorrectIdx === idx}
                      onChange={() => setMcCorrectIdx(idx)}
                      className="w-4 h-4 text-purple-600 cursor-pointer"
                    />
                    <Input
                      value={val}
                      onChange={(e) => {
                        const copy = [...mcChoices];
                        copy[idx] = e.target.value;
                        setMcChoices(copy);
                      }}
                      placeholder={`Lựa chọn ${idx + 1}`}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            )}

            {qType === 'FillBlank' && (
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Đáp án chính xác (từ cần điền):
                </label>
                <Input
                  value={fillBlankAnswer}
                  onChange={(e) => setFillBlankAnswer(e.target.value)}
                  placeholder="VD: goes"
                  required
                />
              </div>
            )}

            {qType === 'SentenceOrder' && (
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Các từ / cụm từ theo thứ tự đúng (phân tách bằng dấu gạch chéo /):
                </label>
                <Input
                  value={sentenceOrderParts}
                  onChange={(e) => setSentenceOrderParts(e.target.value)}
                  placeholder="VD: She / usually goes / to school / by bike"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Giải thích đáp án (Bắt buộc cho khối Senior):
              </label>
              <Input
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="VD: Chủ ngữ là ngôi thứ 3 số ít 'She', thì Hiện tại đơn động từ thêm -es..."
                required
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsAdding(false)}
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

      {/* Questions list */}
      <div className="space-y-2">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="p-3 bg-white border border-gray-200 rounded-xl space-y-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700 uppercase font-semibold">
                    {q.type}
                  </span>
                  <p className="font-bold text-sm text-gray-900">{q.prompt}</p>
                </div>
                {q.explanation && (
                  <p className="text-xs text-blue-700 mt-1 italic">
                    💡 Giải thích: {q.explanation}
                  </p>
                )}
              </div>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => handleDelete(q.id)}
                  className="text-gray-400 hover:text-red-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {q.options.map((opt) => (
                <span
                  key={opt.id}
                  className={`text-xs px-2.5 py-1 rounded-lg border ${
                    opt.isCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {opt.position !== null ? `${opt.position + 1}. ` : ''}
                  {opt.text} {opt.isCorrect && '✓'}
                </span>
              ))}
            </div>
          </div>
        ))}

        {filteredQuestions.length === 0 && !isAdding && (
          <p className="text-xs text-gray-400 italic py-2">
            Chưa có câu hỏi nào cho mục đích{' '}
            {filterPurpose === 'GuidedPractice' ? 'Luyện tập' : 'Kiểm tra'}.
          </p>
        )}
      </div>
    </div>
  );
}
