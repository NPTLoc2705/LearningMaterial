import { Card } from '../ui/Card';
import type { ValidationDiagnosticDto } from '../../types/api';

export interface PublishValidationChecklistProps {
  diagnostics: ValidationDiagnosticDto[];
}

export function PublishValidationChecklist({
  diagnostics,
}: PublishValidationChecklistProps) {
  if (diagnostics.length === 0) return null;

  return (
    <Card innerClassName="p-4 sm:p-5 bg-[#FDEBEC] border border-[#FAD4D6] space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-sm font-semibold text-[#9F2F2D]">
          Chưa đủ điều kiện xuất bản bài giảng (HTTP 422)
        </h3>
        <span className="font-mono text-[11px] text-[#9F2F2D]">
          {diagnostics.length} mục cần bổ sung
        </span>
      </div>

      <ul className="space-y-1.5 text-xs text-[#9F2F2D] list-disc list-inside">
        {diagnostics.map((item, idx) => (
          <li key={`${item.path}-${idx}`}>
            <span className="font-mono font-semibold">{item.path}:</span>{' '}
            {item.message}
          </li>
        ))}
      </ul>
    </Card>
  );
}

