import type { GrammarRuleTable } from '../../types/grammar';
import { FormattedText } from '../ui/FormattedText';

export interface GrammarTableProps {
  table: GrammarRuleTable;
}

export function GrammarTable({ table }: GrammarTableProps) {
  if (!table.headers || table.headers.length === 0) return null;

  return (
    <div className="overflow-x-auto my-4 rounded-xl border border-[#E8E7E4] shadow-subtle scrollbar-thin">
      {table.title && (
        <div className="bg-[#F6F5F2] px-4 py-2 text-xs font-mono font-medium text-[#6B6A66] border-b border-[#E8E7E4]">
          {table.title}
        </div>
      )}
      <table className="w-full text-left border-collapse text-sm min-w-[320px]">
        <thead>
          <tr className="bg-[#F6F5F2] text-[#6B6A66] font-mono text-[11px] uppercase tracking-wider border-b border-[#E8E7E4]">
            {table.headers.map((header, hIdx) => (
              <th key={hIdx} className="py-2.5 px-4 font-medium whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EFEFEA] bg-white">
          {table.rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-[#FBFBFA] transition-colors">
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  className="py-2.5 px-4 text-[#141413] text-xs sm:text-sm leading-relaxed"
                >
                  <FormattedText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
