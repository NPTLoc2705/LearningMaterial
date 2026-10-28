import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type {
  CreateVocabularyItemRequestDto,
  VocabularyItemDto,
} from '../../types/api';

export interface AddVocabularyItemFormProps {
  onAdd: (payload: CreateVocabularyItemRequestDto) => Promise<VocabularyItemDto | undefined>;
  onUploadImage: (id: number, file: File) => Promise<unknown>;
}

export function AddVocabularyItemForm({
  onAdd,
  onUploadImage,
}: AddVocabularyItemFormProps) {
  const [word, setWord] = useState('');
  const [meaningVi, setMeaningVi] = useState('');
  const [exampleEn, setExampleEn] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedWord = word.trim();
    const trimmedMeaningVi = meaningVi.trim();

    if (!trimmedWord) {
      setLocalError('Vui lòng nhập từ vựng tiếng Anh.');
      return;
    }

    if (!trimmedMeaningVi && !selectedFile) {
      setLocalError('Vui lòng nhập nghĩa tiếng Việt hoặc chọn hình ảnh minh họa.');
      return;
    }

    setLocalError(null);
    setIsSubmitting(true);
    try {
      const created = await onAdd({
        word: trimmedWord,
        meaningVi: trimmedMeaningVi || (selectedFile ? trimmedWord : null),
        partOfSpeech: 'noun',
        exampleEn: exampleEn.trim() || null,
      });

      if (created && selectedFile) {
        await onUploadImage(created.id, selectedFile);
      }

      setWord('');
      setMeaningVi('');
      setExampleEn('');
      setSelectedFile(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card innerClassName="p-4 sm:p-5 bg-[#FBFBFA] space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B6A66]">
          Thêm nhanh từ vựng (nhấn Enter để lưu)
        </span>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-center"
      >
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Từ vựng (VD: teacher) *"
          className="rounded-lg border border-[#E8E7E4] bg-white px-3 py-2 text-sm text-[#141413]"
        />
        <input
          type="text"
          value={meaningVi}
          onChange={(e) => setMeaningVi(e.target.value)}
          placeholder="Nghĩa tiếng Việt (VD: giáo viên)"
          className="rounded-lg border border-[#E8E7E4] bg-white px-3 py-2 text-sm text-[#141413]"
        />
        <input
          type="text"
          value={exampleEn}
          onChange={(e) => setExampleEn(e.target.value)}
          placeholder="Câu ví dụ (VD: This is my teacher.)"
          className="rounded-lg border border-[#E8E7E4] bg-white px-3 py-2 text-sm text-[#141413]"
        />
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          className="text-xs text-[#6B6A66] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#F4F3EF] file:text-[#141413]"
        />
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? 'Đang thêm...' : '+ Thêm từ'}
        </Button>
      </form>

      {localError && (
        <p className="text-xs text-[#9F2F2D] font-medium">{localError}</p>
      )}
    </Card>
  );
}

