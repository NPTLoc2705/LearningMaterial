import { useRef, useState } from 'react';
import { SignedMediaImage } from '../common/SignedMediaImage';
import { Button } from '../ui/Button';
import type {
  UpdateVocabularyItemRequestDto,
  VocabularyItemDto,
} from '../../types/api';

export interface VocabularyEditorRowProps {
  item: VocabularyItemDto;
  isFirst: boolean;
  isLast: boolean;
  isReadOnly: boolean;
  onSave: (id: number, payload: UpdateVocabularyItemRequestDto) => Promise<unknown>;
  onUploadImage: (id: number, file: File) => Promise<unknown>;
  onMove: (id: number, direction: 'up' | 'down') => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const INPUT_CLASS =
  'rounded-lg border border-[#E8E7E4] px-3 py-1.5 text-sm text-[#141413] disabled:bg-[#F4F3EF]';

export function VocabularyEditorRow({
  item,
  isFirst,
  isLast,
  isReadOnly,
  onSave,
  onUploadImage,
  onMove,
  onDelete,
}: VocabularyEditorRowProps) {
  const [word, setWord] = useState(item.word);
  const [meaningVi, setMeaningVi] = useState(item.meaningVi ?? '');
  const [partOfSpeech, setPartOfSpeech] = useState(item.partOfSpeech ?? '');
  const [exampleEn, setExampleEn] = useState(item.exampleEn ?? '');
  const [inlineError, setInlineError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const commitIfDirty = async () => {
    if (isReadOnly) return;
    const trimmedWord = word.trim();
    const trimmedMeaningVi = meaningVi.trim();
    if (!trimmedWord) {
      setInlineError('Từ vựng không được để trống.');
      return;
    }
    if (!trimmedMeaningVi && !item.imageKey) {
      setInlineError('Cần có ít nhất hình ảnh hoặc nghĩa tiếng Việt.');
      return;
    }
    const unchanged =
      trimmedWord === item.word &&
      (trimmedMeaningVi || null) === item.meaningVi &&
      (partOfSpeech.trim() || null) === item.partOfSpeech &&
      (exampleEn.trim() || null) === item.exampleEn;
    setInlineError(null);
    if (unchanged) return;
    await onSave(item.id, {
      ...item,
      word: trimmedWord,
      meaningVi: trimmedMeaningVi || null,
      partOfSpeech: partOfSpeech.trim() || null,
      exampleEn: exampleEn.trim() || null,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInlineError(null);
    await onUploadImage(item.id, file);
    e.target.value = '';
  };

  const fields = [
    { label: 'Từ vựng tiếng Anh', value: word, set: setWord, placeholder: 'Từ vựng (EN) *', bold: true },
    { label: 'Nghĩa tiếng Việt', value: meaningVi, set: setMeaningVi, placeholder: 'Nghĩa tiếng Việt', bold: false },
    { label: 'Từ loại', value: partOfSpeech, set: setPartOfSpeech, placeholder: 'Từ loại (noun, verb...)', bold: false },
    { label: 'Câu ví dụ tiếng Anh', value: exampleEn, set: setExampleEn, placeholder: 'Câu ví dụ (EN)', bold: false },
  ];

  return (
    <div className="rounded-xl border border-[#E8E7E4] bg-white p-3.5 space-y-2">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-xs text-[#6B6A66] w-6 text-center">#{item.sortOrder}</span>
          <SignedMediaImage imageKey={item.imageKey} alt={item.word} />
          {!isReadOnly && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => void handleFileChange(e)}
              />
              <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                {item.imageKey ? 'Đổi ảnh' : 'Tải ảnh'}
              </Button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 flex-1">
          {fields.map((f) => (
            <input
              key={f.label}
              type="text"
              aria-label={f.label}
              disabled={isReadOnly}
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              onBlur={() => void commitIfDirty()}
              placeholder={f.placeholder}
              className={`${INPUT_CLASS}${f.bold ? ' font-medium' : ''}`}
            />
          ))}
        </div>

        {!isReadOnly && (
          <div className="flex items-center gap-1.5 shrink-0">
            <Button size="sm" variant="outline" disabled={isFirst} onClick={() => void onMove(item.id, 'up')} title="Di chuyển lên">
              ↑
            </Button>
            <Button size="sm" variant="outline" disabled={isLast} onClick={() => void onMove(item.id, 'down')} title="Di chuyển xuống">
              ↓
            </Button>
            <Button size="sm" variant="outline" onClick={() => void onDelete(item.id)}>
              Xóa
            </Button>
          </div>
        )}
      </div>

      {inlineError && <p className="text-xs text-[#9F2F2D] font-medium">{inlineError}</p>}
    </div>
  );
}
