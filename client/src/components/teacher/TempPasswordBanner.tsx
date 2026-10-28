import { useState } from 'react';
import type { CreatedUserResponseDto } from '../../types/api';
import { Button } from '../ui/Button';

export interface TempPasswordBannerProps {
  createdStudent: CreatedUserResponseDto;
  onDismiss: () => void;
}

export function TempPasswordBanner({
  createdStudent,
  onDismiss,
}: TempPasswordBannerProps) {
  const [copiedPwd, setCopiedPwd] = useState(false);

  if (!createdStudent.temporaryPassword) return null;

  const handleCopy = async (pwd: string) => {
    try {
      await navigator.clipboard.writeText(pwd);
      setCopiedPwd(true);
      window.setTimeout(() => setCopiedPwd(false), 2500);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div className="rounded-xl bg-[#FFFDF7] border border-[#F5E0A3] p-4 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9F580A] font-semibold">
          ⚠ Mật khẩu tạm thời (Chỉ hiển thị một lần)
        </span>
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs text-[#6B6A66] hover:text-[#141413]"
        >
          Đóng
        </button>
      </div>
      <p className="text-xs text-[#141413]">
        Học sinh: <strong>{createdStudent.user.displayName}</strong> (
        <code className="font-mono">{createdStudent.user.username}</code>)
      </p>
      <div className="flex items-center gap-2">
        <code className="font-mono text-sm font-semibold bg-white border border-[#E8E7E4] px-3 py-1.5 rounded-lg text-[#141413]">
          {createdStudent.temporaryPassword}
        </code>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => void handleCopy(createdStudent.temporaryPassword ?? '')}
        >
          {copiedPwd ? '✓ Đã chép' : 'Sao chép mật khẩu'}
        </Button>
      </div>
    </div>
  );
}

