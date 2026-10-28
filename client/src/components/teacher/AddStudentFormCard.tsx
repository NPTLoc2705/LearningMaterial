import React, { useState } from 'react';
import { KID_AVATARS } from '../../data/kid-avatars';
import type {
  AccessMode,
  CreateClassroomStudentRequestDto,
  CreatedUserResponseDto,
} from '../../types/api';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

export interface AddStudentFormCardProps {
  accessMode: AccessMode;
  isArchived: boolean;
  isSubmitting: boolean;
  latestCreatedStudent: CreatedUserResponseDto | null;
  onDismissLatestPassword: () => void;
  onAddStudent: (
    payload: CreateClassroomStudentRequestDto
  ) => Promise<CreatedUserResponseDto>;
}

export function AddStudentFormCard({
  accessMode,
  isArchived,
  isSubmitting,
  latestCreatedStudent,
  onDismissLatestPassword,
  onAddStudent,
}: AddStudentFormCardProps) {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarKey, setAvatarKey] = useState<string>(KID_AVATARS[0].key);
  const [copiedPwd, setCopiedPwd] = useState(false);

  if (isArchived) return null;

  const isClassLinkMode = accessMode === 'ClassLink';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    if (!isClassLinkMode && !username.trim()) return;

    await onAddStudent({
      displayName: displayName.trim(),
      username: isClassLinkMode ? null : username.trim(),
      avatarKey,
    });

    setDisplayName('');
    setUsername('');
    const currentIndex = KID_AVATARS.findIndex((a) => a.key === avatarKey);
    const nextAvatar = KID_AVATARS[(currentIndex + 1) % KID_AVATARS.length];
    setAvatarKey(nextAvatar.key);
  };

  const handleCopyTempPassword = async (pwd: string) => {
    try {
      await navigator.clipboard.writeText(pwd);
      setCopiedPwd(true);
      window.setTimeout(() => setCopiedPwd(false), 2500);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <Card innerClassName="p-5 sm:p-6 space-y-5">
      <div>
        <h2 className="font-serif text-lg font-semibold text-[#141413]">
          {isClassLinkMode
            ? 'Thêm hồ sơ học sinh (Young)'
            : 'Tạo tài khoản học sinh (Senior)'}
        </h2>
        <p className="text-xs text-[#6B6A66] mt-1">
          {isClassLinkMode
            ? 'Chỉ sử dụng biệt danh (Nickname) và hình đại diện để bảo vệ quyền riêng tư của trẻ.'
            : 'Hệ thống tự sinh mật khẩu tạm thời (hiển thị 1 lần) và yêu cầu học sinh đổi khi đăng nhập lần đầu.'}
        </p>
      </div>

      {latestCreatedStudent?.temporaryPassword && (
        <div className="rounded-xl bg-[#FFFDF7] border border-[#F5E0A3] p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#9F580A] font-semibold">
              ⚠ Mật khẩu tạm thời (Chỉ hiển thị một lần)
            </span>
            <button
              type="button"
              onClick={onDismissLatestPassword}
              className="text-xs text-[#6B6A66] hover:text-[#141413]"
            >
              Đóng
            </button>
          </div>
          <p className="text-xs text-[#141413]">
            Học sinh: <strong>{latestCreatedStudent.user.displayName}</strong> (
            <code className="font-mono">{latestCreatedStudent.user.username}</code>)
          </p>
          <div className="flex items-center gap-2">
            <code className="font-mono text-sm font-semibold bg-white border border-[#E8E7E4] px-3 py-1.5 rounded-lg text-[#141413]">
              {latestCreatedStudent.temporaryPassword}
            </code>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                void handleCopyTempPassword(
                  latestCreatedStudent.temporaryPassword ?? ''
                )
              }
            >
              {copiedPwd ? '✓ Đã chép' : 'Sao chép mật khẩu'}
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="student-display-name"
              className="block text-xs font-medium text-[#141413] mb-1.5"
            >
              {isClassLinkMode
                ? 'Biệt danh (Nickname trên lớp)'
                : 'Tên hiển thị học sinh'}
            </label>
            <Input
              id="student-display-name"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={
                isClassLinkMode ? 'Ví dụ: Bé Bơ, Minh B...' : 'Ví dụ: Minh Khôi'
              }
            />
          </div>

          {!isClassLinkMode && (
            <div>
              <label
                htmlFor="student-username"
                className="block text-xs font-medium text-[#141413] mb-1.5"
              >
                Tên đăng nhập (Username)
              </label>
              <Input
                id="student-username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ví dụ: minhkhoi_p1"
              />
            </div>
          )}
        </div>

        <div>
          <span className="block text-xs font-medium text-[#141413] mb-2">
            Chọn hình đại diện (Avatar)
          </span>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
            {KID_AVATARS.map((item) => {
              const selected = avatarKey === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setAvatarKey(item.key)}
                  title={item.labelVi}
                  className={`h-11 rounded-xl border flex items-center justify-center text-xl transition-all ${
                    item.bgClass
                  } ${
                    selected
                      ? 'ring-2 ring-[#141413] scale-105 shadow-subtle'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <span aria-hidden="true">{item.emoji}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            size="sm"
            disabled={
              isSubmitting ||
              !displayName.trim() ||
              (!isClassLinkMode && !username.trim())
            }
          >
            {isSubmitting ? 'Đang thêm học sinh...' : '+ Thêm vào danh sách lớp'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
