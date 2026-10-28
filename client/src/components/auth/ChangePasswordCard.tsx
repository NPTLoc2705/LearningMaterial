import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

export interface ChangePasswordCardProps {
  displayName: string;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>;
  onLogout: () => void;
}

export function ChangePasswordCard({
  displayName,
  isSubmitting,
  error,
  onSubmit,
  onLogout,
}: ChangePasswordCardProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (newPassword.length < 8) {
      setLocalError('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError('Mật khẩu xác nhận không khớp.');
      return;
    }

    await onSubmit(currentPassword, newPassword);
  };

  const activeError = localError ?? error;

  return (
    <Card className="max-w-md w-full mx-auto" innerClassName="p-6 sm:p-8">
      <div className="mb-6">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9F2F2D] bg-[#FDEBEC] px-2.5 py-1 rounded-md inline-block mb-3">
          Bảo mật bắt buộc
        </span>
        <h1 className="font-serif text-xl sm:text-2xl font-semibold text-[#141413]">
          Đổi mật khẩu lần đầu
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6A66] mt-1.5">
          Xin chào <strong>{displayName}</strong>, vui lòng cập nhật mật khẩu mới
          trước khi tiếp tục sử dụng hệ thống.
        </p>
      </div>

      {activeError && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-[#FDEBEC] border border-[#FAD4D6] px-3.5 py-2.5 text-xs text-[#9F2F2D]"
        >
          {activeError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="current-password"
            className="block text-xs font-medium text-[#141413] mb-1.5"
          >
            Mật khẩu tạm thời hiện tại
          </label>
          <Input
            id="current-password"
            type="password"
            autoComplete="current-password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Nhập mật khẩu hiện tại"
          />
        </div>

        <div>
          <label
            htmlFor="new-password"
            className="block text-xs font-medium text-[#141413] mb-1.5"
          >
            Mật khẩu mới (tối thiểu 8 ký tự)
          </label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
          />
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="block text-xs font-medium text-[#141413] mb-1.5"
          >
            Xác nhận mật khẩu mới
          </label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu mật khẩu...' : 'Cập nhật mật khẩu'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            fullWidth
            onClick={onLogout}
            disabled={isSubmitting}
          >
            Đăng xuất
          </Button>
        </div>
      </form>
    </Card>
  );
}

