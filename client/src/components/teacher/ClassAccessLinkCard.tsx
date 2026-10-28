import { useMemo, useState } from 'react';
import type { CreatedClassAccessLinkDto } from '../../types/api';
import { generateQrMatrix } from '../../utils/qrCode';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface ClassAccessLinkCardProps {
  isArchived: boolean;
  isMutating: boolean;
  latestAccessLink: CreatedClassAccessLinkDto | null;
  linkRevokedNotice: boolean;
  onCreateOrRotate: () => Promise<CreatedClassAccessLinkDto>;
  onRevoke: () => Promise<void>;
}

export function ClassAccessLinkCard({
  isArchived,
  isMutating,
  latestAccessLink,
  linkRevokedNotice,
  onCreateOrRotate,
  onRevoke,
}: ClassAccessLinkCardProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = useMemo(() => {
    if (!latestAccessLink) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}${latestAccessLink.relativePath}`;
  }, [latestAccessLink]);

  const qrMatrix = useMemo(() => {
    return fullUrl ? generateQrMatrix(fullUrl) : null;
  }, [fullUrl]);

  const handleCopy = async () => {
    if (!fullUrl) return;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback ignored
    }
  };

  return (
    <Card innerClassName="p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg font-semibold text-[#141413]">
              Đường dẫn vào lớp &amp; Mã QR
            </h2>
            <Badge variant="green" size="sm">Khối Young</Badge>
          </div>
          <p className="text-xs text-[#6B6A66] mt-1">
            Học sinh chạm vào hình đại diện của mình để vào học, không cần mật khẩu.
          </p>
        </div>

        {!isArchived && (
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => void onCreateOrRotate()} disabled={isMutating}>
              {isMutating
                ? 'Đang xử lý...'
                : latestAccessLink
                  ? 'Tạo lại đường dẫn (Rotate)'
                  : 'Tạo / Đổi đường dẫn mới'}
            </Button>
            <Button size="sm" variant="danger" onClick={() => void onRevoke()} disabled={isMutating}>
              Thu hồi link
            </Button>
          </div>
        )}
      </div>

      {linkRevokedNotice && !latestAccessLink && (
        <div className="rounded-lg bg-[#F4F3EF] border border-[#E8E7E4] px-3.5 py-2.5 text-xs text-[#141413]">
          Đường dẫn truy cập lớp học trước đó đã được thu hồi thành công.
        </div>
      )}

      {latestAccessLink && fullUrl && (
        <div className="rounded-xl bg-[#FFFDF7] border border-[#F5E0A3] p-4 space-y-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#9F580A] font-semibold block">
              ⚠ Lưu ý quan trọng: Đường dẫn chỉ hiển thị một lần duy nhất
            </span>
            <p className="text-xs text-[#6B6A66] mt-1">
              Vì lý do bảo mật, hệ thống chỉ lưu mã băm trên máy chủ. Hãy sao chép
              đường dẫn hoặc tải mã QR ngay bây giờ để gửi cho phụ huynh.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
            {qrMatrix && (
              <div className="bg-white p-3 rounded-xl border border-[#E8E7E4] shrink-0">
                <svg
                  viewBox={`0 0 ${qrMatrix.length + 4} ${qrMatrix.length + 4}`}
                  className="w-36 h-36"
                  role="img"
                  aria-label="Mã QR truy cập lớp học"
                >
                  <rect width={qrMatrix.length + 4} height={qrMatrix.length + 4} fill="#FFFFFF" />
                  {qrMatrix.map((row, r) =>
                    row.map((dark, c) =>
                      dark ? <rect key={`${r}-${c}`} x={c + 2} y={r + 2} width={1} height={1} fill="#141413" /> : null
                    )
                  )}
                </svg>
              </div>
            )}

            <div className="flex-1 w-full space-y-2.5">
              <div className="font-mono text-xs bg-white border border-[#E8E7E4] rounded-lg px-3 py-2.5 break-all text-[#141413]">
                {fullUrl}
              </div>
              <Button size="sm" variant="primary" onClick={() => void handleCopy()}>
                {copied ? '✓ Đã sao chép đường dẫn' : 'Sao chép đường dẫn'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
