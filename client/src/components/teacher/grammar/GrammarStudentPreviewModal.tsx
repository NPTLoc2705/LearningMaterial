import { useState } from 'react';
import type {
  GrammarTopicDto,
  LevelGroup,
  QuestionDto,
} from '../../../types/api';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { SpeakerButton } from '../../kids/SpeakerButton';
import { BigChoice } from '../../kids/BigChoice';
import { SignedMediaImage } from '../../common/SignedMediaImage';

interface GrammarStudentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelGroup: LevelGroup;
  topic: GrammarTopicDto | null;
  questions: QuestionDto[];
}

export function GrammarStudentPreviewModal({
  isOpen,
  onClose,
  levelGroup,
  topic,
  questions,
}: GrammarStudentPreviewModalProps) {
  const [selectedKidChoice, setSelectedKidChoice] = useState<string | null>(null);
  const [seniorStep, setSeniorStep] = useState<1 | 2 | 3>(1);
  const [selectedSeniorOption, setSelectedSeniorOption] = useState<number | null>(null);
  const [showSeniorFeedback, setShowSeniorFeedback] = useState<boolean>(false);

  if (!topic) return null;

  const allExamples = topic.rules.flatMap((r) => r.examples);
  const sampleQuestion = questions[0] ?? null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Xem trước giao diện học sinh (${levelGroup === 'Young' ? 'Young / Kids' : 'Senior'})`}
    >
      <div className="space-y-6 max-h-[75vh] overflow-y-auto p-1">
        {levelGroup === 'Young' ? (
          /* Young student preview */
          <div className="space-y-6">
            <div className="text-center p-4 bg-amber-50 rounded-2xl border-2 border-amber-200">
              <span className="text-xs uppercase tracking-wider font-extrabold text-amber-700">
                Mẫu câu giao tiếp
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{topic.title}</h3>
            </div>

            {/* Examples preview */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-gray-700 uppercase tracking-wide">
                🗣️ Luyện nghe & Nói mẫu câu
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allExamples.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm flex items-center justify-between gap-3 min-h-[72px]"
                  >
                    <div className="flex items-center gap-3">
                      {ex.imageKey && (
                        <SignedMediaImage
                          imageKey={ex.imageKey}
                          alt={ex.textEn}
                          className="w-14 h-14 rounded-xl object-cover border"
                        />
                      )}
                      <div>
                        <p className="font-black text-base text-gray-900">{ex.textEn}</p>
                        {ex.textVi && (
                          <p className="text-xs font-semibold text-gray-500">{ex.textVi}</p>
                        )}
                      </div>
                    </div>
                    <SpeakerButton text={ex.textEn} size="md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Question Preview */}
            {sampleQuestion && (
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-extrabold text-sm text-gray-700 uppercase tracking-wide">
                  🎮 Luyện tập mẫu câu (Usage Practice)
                </h4>
                <div className="p-4 bg-white rounded-2xl border-2 border-amber-100 shadow-sm space-y-4">
                  <p className="text-lg font-black text-center text-gray-800">
                    {sampleQuestion.prompt}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {sampleQuestion.options.map((opt) => (
                      <BigChoice
                        key={opt.id}
                        choiceKey={String(opt.id)}
                        text={opt.text}
                        imageKey={opt.imageKey}
                        isSelected={selectedKidChoice === String(opt.id)}
                        isCorrect={
                          selectedKidChoice === String(opt.id) ? opt.isCorrect : null
                        }
                        onClick={(key) => setSelectedKidChoice(key)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Senior student preview */
          <div className="space-y-4">
            {/* Steps indicator */}
            <div className="flex items-center gap-2 border-b pb-2">
              <button
                type="button"
                onClick={() => setSeniorStep(1)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  seniorStep === 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                1. Học lý thuyết
              </button>
              <button
                type="button"
                onClick={() => setSeniorStep(2)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  seniorStep === 2
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                2. Luyện tập
              </button>
              <button
                type="button"
                onClick={() => setSeniorStep(3)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  seniorStep === 3
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                3. Kiểm tra (70%)
              </button>
            </div>

            {/* Step 1 Preview */}
            {seniorStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-serif text-gray-900">
                  {topic.title}
                </h3>
                {topic.summary && (
                  <p className="text-sm text-gray-600">{topic.summary}</p>
                )}

                <div className="space-y-3">
                  {topic.rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-4 rounded-xl border border-indigo-200 bg-white shadow-sm space-y-2"
                    >
                      <h4 className="font-bold text-base text-indigo-900">
                        {rule.title}
                      </h4>
                      {rule.formula && (
                        <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg font-mono text-sm font-bold text-indigo-950">
                          {rule.formula}
                        </div>
                      )}
                      {rule.explanation && (
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {rule.explanation}
                        </p>
                      )}
                      {rule.pitfallNote && (
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                          <strong>⚠️ Lỗi thường gặp:</strong> {rule.pitfallNote}
                        </div>
                      )}
                      {rule.examples.length > 0 && (
                        <div className="pt-2 border-t space-y-1">
                          <span className="text-[11px] font-bold text-gray-500 uppercase">
                            Ví dụ:
                          </span>
                          {rule.examples.map((ex) => (
                            <p key={ex.id} className="text-xs text-gray-800">
                              • <strong>{ex.textEn}</strong>
                              {ex.textVi && ` — ${ex.textVi}`}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 or 3 Preview */}
            {(seniorStep === 2 || seniorStep === 3) && (
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-gray-500">
                      {seniorStep === 2 ? 'Luyện tập có hướng dẫn' : 'Bài kiểm tra ngắn'}
                    </span>
                    <span className="text-xs font-bold text-indigo-600">
                      {seniorStep === 3 ? 'Ngưỡng đạt: 70%' : 'Giải thích tức thì'}
                    </span>
                  </div>

                  <p className="font-bold text-base text-gray-900">
                    {sampleQuestion?.prompt || 'She usually ___ breakfast at 7 AM.'}
                  </p>

                  <div className="space-y-2">
                    {(
                      sampleQuestion?.options || [
                        { id: 1, text: 'eat', isCorrect: false },
                        { id: 2, text: 'eats', isCorrect: true },
                        { id: 3, text: 'eating', isCorrect: false },
                      ]
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSelectedSeniorOption(opt.id);
                          if (seniorStep === 2) setShowSeniorFeedback(true);
                        }}
                        className={`w-full p-3 rounded-lg border text-left text-sm font-medium transition-all ${
                          selectedSeniorOption === opt.id
                            ? 'border-indigo-600 bg-indigo-50 font-bold'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>

                  {seniorStep === 2 && showSeniorFeedback && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 mt-2">
                      <strong>💡 Giải thích:</strong>{' '}
                      {sampleQuestion?.explanation ||
                        'Chủ ngữ ngôi thứ ba số ít (She) đi với động từ thêm -s/es ở thì Hiện tại đơn.'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" size="sm" onClick={onClose}>
            Đóng xem thử
          </Button>
        </div>
      </div>
    </Modal>
  );
}
