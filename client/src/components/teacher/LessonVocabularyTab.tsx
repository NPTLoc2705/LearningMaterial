import { AddVocabularyItemForm } from './AddVocabularyItemForm';
import { VocabularyEditorRow } from './VocabularyEditorRow';
import { Card } from '../ui/Card';
import type {
  CreateVocabularyItemRequestDto,
  UpdateVocabularyItemRequestDto,
  VocabularyItemDto,
} from '../../types/api';

export interface LessonVocabularyTabProps {
  vocabulary: VocabularyItemDto[];
  isReadOnly: boolean;
  onAdd: (payload: CreateVocabularyItemRequestDto) => Promise<VocabularyItemDto | undefined>;
  onSave: (id: number, payload: UpdateVocabularyItemRequestDto) => Promise<unknown>;
  onUploadImage: (id: number, file: File) => Promise<unknown>;
  onMove: (id: number, direction: 'up' | 'down') => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function LessonVocabularyTab({
  vocabulary,
  isReadOnly,
  onAdd,
  onSave,
  onUploadImage,
  onMove,
  onDelete,
}: LessonVocabularyTabProps) {
  return (
    <div className="space-y-4">
      {!isReadOnly && (
        <AddVocabularyItemForm onAdd={onAdd} onUploadImage={onUploadImage} />
      )}

      {vocabulary.length === 0 ? (
        <Card innerClassName="p-8 text-center text-sm text-[#6B6A66]">
          Chưa có từ vựng nào trong bài giảng này. Hãy thêm ít nhất 4 từ vựng hoặc tải lên slide để trích xuất tự động.
        </Card>
      ) : (
        <div className="space-y-2.5">
          {vocabulary.map((item, idx) => (
            <VocabularyEditorRow
              key={item.id}
              item={item}
              isFirst={idx === 0}
              isLast={idx === vocabulary.length - 1}
              isReadOnly={isReadOnly}
              onSave={onSave}
              onUploadImage={onUploadImage}
              onMove={onMove}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
