import React, { useState } from 'react';
import type { CreateLessonRequestDto, LevelDto } from '../../types/api';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

export interface CreateLessonFormProps {
  levels: LevelDto[];
  isCreating: boolean;
  onSubmit: (payload: CreateLessonRequestDto) => Promise<void>;
  onCancel: () => void;
}

export function CreateLessonForm({
  levels,
  isCreating,
  onSubmit,
  onCancel,
}: CreateLessonFormProps) {
  const defaultLevelId =
    levels.find((l) => l.code === 'explore-1')?.id ?? levels[0]?.id ?? 0;

  const [levelId, setLevelId] = useState<number>(defaultLevelId);
  const [unitNo, setUnitNo] = useState<string>('1');
  const [unitTitle, setUnitTitle] = useState<string>('');
  const [lessonNo, setLessonNo] = useState<string>('1');
  const [title, setTitle] = useState<string>('');

  const selectedLevel = levels.find((l) => l.id === levelId) ?? levels[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLevel || !title.trim()) return;
    await onSubmit({
      levelId: selectedLevel.id,
      unitNo: Math.max(1, Number(unitNo) || 1),
      lessonNo: Math.max(1, Number(lessonNo) || 1),
      title: title.trim(),
      unitTitle: unitTitle.trim() || null,
    });
  };

  return (
    <Card innerClassName="p-5 sm:p-6">
      <h2 className="font-serif text-lg font-semibold text-[#141413] mb-4">
        Tạo bài giảng mới (Bản nháp)
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="lesson-level" className="block text-xs font-medium text-[#141413] mb-1.5">
              Cấp độ (Level)
            </label>
            <select
              id="lesson-level"
              value={selectedLevel?.id ?? ''}
              onChange={(e) => setLevelId(Number(e.target.value))}
              className="w-full rounded-lg border border-[#E8E7E4] bg-white px-3 py-2 text-xs sm:text-sm text-[#141413] focus:border-[#141413] focus:outline-none"
            >
              {levels.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.displayName} ({lvl.group})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="lesson-unit-no" className="block text-xs font-medium text-[#141413] mb-1.5">
              Unit số
            </label>
            <Input
              id="lesson-unit-no"
              type="number"
              min={1}
              required
              value={unitNo}
              onChange={(e) => setUnitNo(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="lesson-no" className="block text-xs font-medium text-[#141413] mb-1.5">
              Lesson số
            </label>
            <Input
              id="lesson-no"
              type="number"
              min={1}
              required
              value={lessonNo}
              onChange={(e) => setLessonNo(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="lesson-unit-title" className="block text-xs font-medium text-[#141413] mb-1.5">
              Tên Unit (tùy chọn)
            </label>
            <Input
              id="lesson-unit-title"
              value={unitTitle}
              onChange={(e) => setUnitTitle(e.target.value)}
              placeholder="Ví dụ: Winter Clothes"
            />
          </div>

          <div>
            <label htmlFor="lesson-title" className="block text-xs font-medium text-[#141413] mb-1.5">
              Tiêu đề bài giảng (Title)
            </label>
            <Input
              id="lesson-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Gloves, Scarf & Coat"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={isCreating}>
            Hủy
          </Button>
          <Button type="submit" size="sm" disabled={isCreating || !title.trim()}>
            {isCreating ? 'Đang tạo...' : 'Tạo bài giảng'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
