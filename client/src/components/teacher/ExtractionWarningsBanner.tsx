import type { ValidationDiagnosticDto } from '../../types/api';

export interface ExtractionWarningsBannerProps {
  warnings: ValidationDiagnosticDto[];
}

export function ExtractionWarningsBanner({
  warnings,
}: ExtractionWarningsBannerProps) {
  if (warnings.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#FAD4D6] bg-[#FDEBEC] p-3.5 space-y-1.5">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#9F2F2D]">
        <span aria-hidden="true">⚠️</span>
        <span>Phát hiện {warnings.length} điểm cần lưu ý từ slide:</span>
      </div>
      <ul className="list-disc list-inside space-y-1 text-xs text-[#9F2F2D]">
        {warnings.map((w, idx) => (
          <li key={`${w.path}-${idx}`}>
            <span className="font-mono font-medium">{w.path}:</span> {w.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
