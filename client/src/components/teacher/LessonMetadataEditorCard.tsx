import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { LessonDto, UpdateLessonRequestDto } from '../../types/api';

export interface LessonMetadataEditorCardProps {
  lesson: LessonDto;
  isReadOnly: boolean;
  onSave: (payload: UpdateLessonRequestDto) => Promise<void>;
}

export function LessonMetadataEditorCard({
  lesson,
  isReadOnly,
  onSave,
}: LessonMetadataEditorCardProps) {
  const [unitNo, setUnitNo] = useState<number>(lesson.unitNo);
  const [unitTitle, setUnitTitle] = useState<string>(lesson.unitTitle ?? '');
  const [lessonNo, setLessonNo] = useState<number>(lesson.lessonNo);
  const [title, setTitle] = useState<string>(lesson.title);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly || !title.trim()) return;
    setIsSaving(true);
    try {
      await onSave({
        unitNo,
        lessonNo,
        title: title.trim(),
        unitTitle: unitTitle.trim() ? unitTitle.trim() : null,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card innerClassName="p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-base font-semibold text-[#141413]">
            Thông tin bài giảng
          </h2>
          <p className="text-xs text-[#6B6A66] mt-0.5">
            Chỉnh sửa Unit, số thứ tự Lesson và tiêu đề bài giảng.
          </p>
        </div>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[#6B6A66] mb-1">
              Unit số
            </label>
            <input
              type="number"
              min={1}
              max={100}
              disabled={isReadOnly}
              value={unitNo}
              onChange={(e) => setUnitNo(Number(e.target.value) || 1)}
              className="w-full rounded-lg border border-[#E8E7E4] bg-white px-3 py-2 text-sm text-[#141413] disabled:bg-[#F4F3EF]"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[#6B6A66] mb-1">
              Tên Unit (tùy chọn)
            </label>
            <input
              type="text"
              maxLength={150}
              disabled={isReadOnly}
              value={unitTitle}
              onChange={(e) => setUnitTitle(e.target.value)}
              placeholder="VD: People"
              className="w-full rounded-lg border border-[#E8E7E4] bg-white px-3 py-2 text-sm text-[#141413] disabled:bg-[#F4F3EF]"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[#6B6A66] mb-1">
              Lesson số
            </label>
            <input
              type="number"
              min={1}
              max={100}
              disabled={isReadOnly}
              value={lessonNo}
              onChange={(e) => setLessonNo(Number(e.target.value) || 1)}
              className="w-full rounded-lg border border-[#E8E7E4] bg-white px-3 py-2 text-sm text-[#141413] disabled:bg-[#F4F3EF]"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-wider text-[#6B6A66] mb-1">
            Tiêu đề bài giảng *
          </label>
          <input
            type="text"
            required
            maxLength={200}
            disabled={isReadOnly}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-[#E8E7E4] bg-white px-3 py-2 text-sm text-[#141413] disabled:bg-[#F4F3EF]"
          />
        </div>

        {!isReadOnly && (
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
}

