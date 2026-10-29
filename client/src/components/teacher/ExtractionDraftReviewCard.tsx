import { useState } from 'react';
import { ExtractionWarningsBanner } from './ExtractionWarningsBanner';
import { IgnoredSlidesSummaryBadge } from './IgnoredSlidesSummaryBadge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type {
  ExtractionDraftDto,
  ExtractionJobDto,
} from '../../types/api';

export interface ExtractionDraftReviewCardProps {
  job: ExtractionJobDto;
  isProcessing: boolean;
  onUpdateDraft: (draft: ExtractionDraftDto) => Promise<unknown>;
  onApprove: () => Promise<unknown>;
  onDiscard: () => Promise<unknown>;
}

export function ExtractionDraftReviewCard({
  job,
  isProcessing,
  onUpdateDraft,
  onApprove,
  onDiscard,
}: ExtractionDraftReviewCardProps) {
  const [draft, setDraft] = useState<ExtractionDraftDto>(
    job.draft ?? {
      vocabulary: [],
      sentencePatterns: [],
      ignoredSlides: [],
      warnings: [],
    }
  );

  // Vocabulary handlers
  const handleToggleApproved = (id: string) => {
    const nextDraft: ExtractionDraftDto = {
      ...draft,
      vocabulary: draft.vocabulary.map((item) =>
        item.id === id ? { ...item, isApproved: !item.isApproved } : item
      ),
    };
    setDraft(nextDraft);
    void onUpdateDraft(nextDraft);
  };

  const handleFieldChange = (
    id: string,
    field: 'word' | 'meaningVi',
    value: string
  ) => {
    const nextDraft: ExtractionDraftDto = {
      ...draft,
      vocabulary: draft.vocabulary.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    };
    setDraft(nextDraft);
    void onUpdateDraft(nextDraft);
  };

  // Sentence pattern handlers
  const handleTogglePatternApproved = (index: number) => {
    const nextDraft: ExtractionDraftDto = {
      ...draft,
      sentencePatterns: draft.sentencePatterns.map((pat, idx) =>
        idx === index
          ? { ...pat, isApproved: pat.isApproved === false ? true : false }
          : pat
      ),
    };
    setDraft(nextDraft);
    void onUpdateDraft(nextDraft);
  };

  const handlePatternFieldChange = (
    index: number,
    field: 'title' | 'summary',
    value: string
  ) => {
    const nextDraft: ExtractionDraftDto = {
      ...draft,
      sentencePatterns: draft.sentencePatterns.map((pat, idx) =>
        idx === index ? { ...pat, [field]: value } : pat
      ),
    };
    setDraft(nextDraft);
    void onUpdateDraft(nextDraft);
  };

  const handleExampleChange = (
    patternIndex: number,
    exampleIndex: number,
    value: string
  ) => {
    const nextDraft: ExtractionDraftDto = {
      ...draft,
      sentencePatterns: draft.sentencePatterns.map((pat, pIdx) => {
        if (pIdx !== patternIndex) return pat;
        const nextExamples = pat.examples.map((ex, eIdx) =>
          eIdx === exampleIndex ? value : ex
        );
        return { ...pat, examples: nextExamples };
      }),
    };
    setDraft(nextDraft);
    void onUpdateDraft(nextDraft);
  };

  const handleAddExample = (patternIndex: number) => {
    const nextDraft: ExtractionDraftDto = {
      ...draft,
      sentencePatterns: draft.sentencePatterns.map((pat, pIdx) => {
        if (pIdx !== patternIndex) return pat;
        return { ...pat, examples: [...(pat.examples ?? []), ''] };
      }),
    };
    setDraft(nextDraft);
    void onUpdateDraft(nextDraft);
  };

  const handleDeleteExample = (
    patternIndex: number,
    exampleIndex: number
  ) => {
    const nextDraft: ExtractionDraftDto = {
      ...draft,
      sentencePatterns: draft.sentencePatterns.map((pat, pIdx) => {
        if (pIdx !== patternIndex) return pat;
        return {
          ...pat,
          examples: pat.examples.filter((_, eIdx) => eIdx !== exampleIndex),
        };
      }),
    };
    setDraft(nextDraft);
    void onUpdateDraft(nextDraft);
  };

  const handleDeletePattern = (patternIndex: number) => {
    const nextDraft: ExtractionDraftDto = {
      ...draft,
      sentencePatterns: draft.sentencePatterns.filter(
        (_, pIdx) => pIdx !== patternIndex
      ),
    };
    setDraft(nextDraft);
    void onUpdateDraft(nextDraft);
  };

  const handleAddPattern = () => {
    const nextDraft: ExtractionDraftDto = {
      ...draft,
      sentencePatterns: [
        ...(draft.sentencePatterns ?? []),
        {
          title: '',
          summary: '',
          sourcePage: null,
          examples: [''],
          isApproved: true,
        },
      ],
    };
    setDraft(nextDraft);
    void onUpdateDraft(nextDraft);
  };

  const approvedVocabCount = draft.vocabulary.filter((v) => v.isApproved).length;
  const approvedPatternCount = (draft.sentencePatterns ?? []).filter(
    (p) => p.isApproved !== false
  ).length;

  return (
    <Card innerClassName="p-5 sm:p-6 space-y-6">
      {/* Header and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E7E4] pb-4">
        <div>
          <h2 className="font-serif text-lg font-semibold text-[#141413]">
            Xem trước bản nháp trích xuất ({draft.vocabulary.length} từ vựng,{' '}
            {draft.sentencePatterns?.length ?? 0} mẫu câu)
          </h2>
          <p className="text-xs text-[#6B6A66] mt-0.5">
            Giáo viên có thể sửa từ vựng, mẫu câu ngữ pháp, hoặc bỏ chọn những mục không phù hợp trước khi nhập vào bài giảng.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            disabled={isProcessing}
            onClick={() => void onDiscard()}
          >
            Hủy bản nháp
          </Button>
          <Button
            size="sm"
            disabled={isProcessing || (approvedVocabCount === 0 && approvedPatternCount === 0)}
            onClick={() => void onApprove()}
          >
            {isProcessing
              ? 'Đang nhập...'
              : `Duyệt (${approvedVocabCount} từ${
                  approvedPatternCount > 0 ? `, ${approvedPatternCount} mẫu câu` : ''
                }) và lưu`}
          </Button>
        </div>
      </div>

      <ExtractionWarningsBanner warnings={draft.warnings} />
      <IgnoredSlidesSummaryBadge ignoredSlides={draft.ignoredSlides} />

      {/* Section 1: Vocabulary */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base font-semibold text-[#141413]">
            Từ vựng (Vocabulary) ({draft.vocabulary.length})
          </h3>
          <span className="text-xs text-[#6B6A66]">
            Đã chọn {approvedVocabCount} / {draft.vocabulary.length}
          </span>
        </div>

        <div className="space-y-2">
          {draft.vocabulary.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                item.isApproved
                  ? 'border-[#E8E7E4] bg-white'
                  : 'border-[#F4F3EF] bg-[#FBFBFA] opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  aria-label={`Duyệt từ ${item.word}`}
                  checked={item.isApproved}
                  onChange={() => handleToggleApproved(item.id)}
                  className="w-4 h-4 rounded border-[#E8E7E4] text-[#141413] cursor-pointer"
                />

                {item.imagePreviewUrl ? (
                  <img
                    src={item.imagePreviewUrl}
                    alt={item.word}
                    className="w-12 h-12 rounded-lg object-cover border border-[#E8E7E4] bg-[#F4F3EF]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-[#F4F3EF] border border-[#E8E7E4] flex items-center justify-center text-sm">
                    🖼️
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                  <input
                    type="text"
                    aria-label="Từ tiếng Anh"
                    value={item.word}
                    onChange={(e) => handleFieldChange(item.id, 'word', e.target.value)}
                    className="rounded-lg border border-[#E8E7E4] px-2.5 py-1 text-sm font-semibold text-[#141413]"
                  />
                  <input
                    type="text"
                    aria-label="Nghĩa tiếng Việt"
                    value={item.meaningVi ?? ''}
                    onChange={(e) => handleFieldChange(item.id, 'meaningVi', e.target.value)}
                    placeholder="Nghĩa tiếng Việt"
                    className="rounded-lg border border-[#E8E7E4] px-2.5 py-1 text-sm text-[#141413]"
                  />
                </div>
              </div>

              <span className="font-mono text-xs text-[#6B6A66] shrink-0 sm:text-right">
                Trang {item.sourcePage ?? '?'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Sentence Patterns (Mẫu câu ngữ pháp) */}
      <div className="space-y-3 pt-4 border-t border-[#E8E7E4]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-semibold text-[#141413]">
              Mẫu câu ngữ pháp (Sentence Patterns) ({draft.sentencePatterns?.length ?? 0})
            </h3>
            <p className="text-xs text-[#6B6A66] mt-0.5">
              Mẫu câu giao tiếp được phát hiện từ tài liệu. Có thể chỉnh sửa tiêu đề, tóm tắt và danh sách câu ví dụ.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddPattern}
            className="text-xs shrink-0"
          >
            + Thêm mẫu câu
          </Button>
        </div>

        {(!draft.sentencePatterns || draft.sentencePatterns.length === 0) ? (
          <div className="rounded-xl border border-dashed border-[#E8E7E4] p-6 text-center text-xs text-[#6B6A66]">
            Không phát hiện mẫu câu ngữ pháp nào trong tài liệu này. Nhấn "+ Thêm mẫu câu" nếu muốn tạo thủ công.
          </div>
        ) : (
          <div className="space-y-3">
            {draft.sentencePatterns.map((pattern, pIdx) => {
              const isPatternApproved = pattern.isApproved !== false;

              return (
                <div
                  key={`pattern-${pIdx}`}
                  className={`rounded-xl border p-4 space-y-3 transition-colors ${
                    isPatternApproved
                      ? 'border-[#E8E7E4] bg-white'
                      : 'border-[#F4F3EF] bg-[#FBFBFA] opacity-60'
                  }`}
                >
                  {/* Pattern Header: Checkbox, Title, Source Page, Delete */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      aria-label={`Duyệt mẫu câu ${pattern.title || `#${pIdx + 1}`}`}
                      checked={isPatternApproved}
                      onChange={() => handleTogglePatternApproved(pIdx)}
                      className="w-4 h-4 rounded border-[#E8E7E4] text-[#141413] cursor-pointer"
                    />

                    <input
                      type="text"
                      aria-label={`Tên mẫu câu ${pIdx + 1}`}
                      placeholder="Mẫu câu (ví dụ: Who's this? → This is a ...)"
                      value={pattern.title}
                      onChange={(e) =>
                        handlePatternFieldChange(pIdx, 'title', e.target.value)
                      }
                      className="flex-1 rounded-lg border border-[#E8E7E4] px-2.5 py-1 text-sm font-semibold text-[#141413]"
                    />

                    <span className="font-mono text-xs text-[#6B6A66] shrink-0">
                      Trang {pattern.sourcePage ?? '?'}
                    </span>

                    <button
                      type="button"
                      aria-label={`Xóa mẫu câu ${pIdx + 1}`}
                      onClick={() => handleDeletePattern(pIdx)}
                      className="text-xs text-[#9F2F2D] hover:underline px-1.5 py-1"
                    >
                      Xóa mẫu
                    </button>
                  </div>

                  {/* Summary / Usage input */}
                  <div>
                    <input
                      type="text"
                      aria-label={`Tóm tắt mẫu câu ${pIdx + 1}`}
                      placeholder="Tóm tắt cách dùng / ngữ cảnh (ví dụ: Usage-first question to identify people)"
                      value={pattern.summary ?? ''}
                      onChange={(e) =>
                        handlePatternFieldChange(pIdx, 'summary', e.target.value)
                      }
                      className="w-full rounded-lg border border-[#E8E7E4] px-2.5 py-1 text-xs text-[#141413]"
                    />
                  </div>

                  {/* Examples Section */}
                  <div className="space-y-1.5 pl-6 border-l-2 border-[#E8E7E4]">
                    <div className="text-xs font-semibold text-[#6B6A66]">
                      Câu ví dụ minh họa (Examples):
                    </div>

                    {(pattern.examples ?? []).map((example, eIdx) => (
                      <div
                        key={`ex-${pIdx}-${eIdx}`}
                        className="flex items-center gap-2"
                      >
                        <span className="text-xs text-[#6B6A66] w-4 shrink-0">
                          {eIdx + 1}.
                        </span>
                        <input
                          type="text"
                          aria-label={`Ví dụ ${eIdx + 1} của mẫu ${pIdx + 1}`}
                          placeholder="Câu ví dụ tiếng Anh"
                          value={example}
                          onChange={(e) =>
                            handleExampleChange(pIdx, eIdx, e.target.value)
                          }
                          className="flex-1 rounded-md border border-[#E8E7E4] px-2.5 py-1 text-xs text-[#141413]"
                        />
                        <button
                          type="button"
                          aria-label={`Xóa ví dụ ${eIdx + 1}`}
                          onClick={() => handleDeleteExample(pIdx, eIdx)}
                          className="text-xs text-[#9F2F2D] hover:underline px-1 py-0.5"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddExample(pIdx)}
                      className="text-xs text-[#2A7E5C] hover:underline inline-flex items-center gap-1 font-medium pt-1"
                    >
                      + Thêm ví dụ
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
