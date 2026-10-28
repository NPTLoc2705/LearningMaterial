import React, { useState } from 'react';
import type { CreateClassroomRequestDto, LevelDto } from '../../types/api';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

export interface CreateClassroomFormProps {
  levels: LevelDto[];
  isCreating: boolean;
  onSubmit: (payload: CreateClassroomRequestDto) => Promise<void>;
  onCancel: () => void;
}

export function CreateClassroomForm({
  levels,
  isCreating,
  onSubmit,
  onCancel,
}: CreateClassroomFormProps) {
  const defaultLevelId =
    levels.find((l) => l.code === 'explore-1')?.id ?? levels[0]?.id ?? 0;

  const [name, setName] = useState('');
  const [levelId, setLevelId] = useState<number>(defaultLevelId);
  const [termName, setTermName] = useState('');

  const selectedLevel = levels.find((l) => l.id === levelId) ?? levels[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedLevel) return;
    await onSubmit({
      name: name.trim(),
      levelId: selectedLevel.id,
      termName: termName.trim() || null,
    });
  };

  return (
    <Card innerClassName="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-lg font-semibold text-[#141413]">
          Tạo lớp học mới
        </h2>
        {selectedLevel && (
          <Badge
            variant={
              selectedLevel.settings.accessMode === 'ClassLink' ? 'green' : 'blue'
            }
            size="sm"
          >
            {selectedLevel.settings.accessMode === 'ClassLink'
              ? 'Vào lớp bằng QR / Link (Young)'
              : 'Tài khoản & Mật khẩu (Senior)'}
          </Badge>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="classroom-level"
              className="block text-xs font-medium text-[#141413] mb-1.5"
            >
              Cấp độ (Level)
            </label>
            <select
              id="classroom-level"
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
            <label
              htmlFor="classroom-name"
              className="block text-xs font-medium text-[#141413] mb-1.5"
            >
              Tên lớp học
            </label>
            <Input
              id="classroom-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Explore 1 - T7CN"
            />
          </div>

          <div>
            <label
              htmlFor="classroom-term"
              className="block text-xs font-medium text-[#141413] mb-1.5"
            >
              Học kỳ / Khóa (tùy chọn)
            </label>
            <Input
              id="classroom-term"
              value={termName}
              onChange={(e) => setTermName(e.target.value)}
              placeholder="Ví dụ: Hè 2026"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isCreating}
          >
            Hủy
          </Button>
          <Button type="submit" size="sm" disabled={isCreating || !name.trim()}>
            {isCreating ? 'Đang tạo...' : 'Xác nhận tạo lớp'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

