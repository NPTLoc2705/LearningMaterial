import { useEffect, useState } from 'react';
import { ReportService } from '../../Service/ReportService';
import { SignedMediaImage } from '../common/SignedMediaImage';
import type { WeakVocabularyReportDto, AssignmentCompletionReportDto } from '../../types/api';

export interface ClassReportsTabProps {
  classroomId: number;
}

export function ClassReportsTab({ classroomId }: ClassReportsTabProps) {
  const [weakWords, setWeakWords] = useState<WeakVocabularyReportDto[]>([]);
  const [completions, setCompletions] = useState<AssignmentCompletionReportDto[]>([]);
  const [minAttempts, setMinAttempts] = useState<number>(3);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReports() {
      setIsLoading(true);
      setError(null);
      try {
        const [words, comp] = await Promise.all([
          ReportService.getWeakVocabularyReport(classroomId, undefined, minAttempts),
          ReportService.getAssignmentCompletions(classroomId, 1),
        ]);
        setWeakWords(words);
        setCompletions(comp);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không tải được báo cáo.');
      } finally {
        setIsLoading(false);
      }
    }
    loadReports();
  }, [classroomId, minAttempts]);

  if (isLoading) {
    return <div className="py-8 text-center text-xs font-mono text-gray-500 animate-pulse">Đang tải báo cáo từ vựng...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Weak Words Section */}
      <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-gray-900">Từ vựng học sinh hay làm sai</h3>
            <p className="text-xs text-gray-500">Xếp hạng theo tỷ lệ làm sai trên tổng số lượt trả lời</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 font-medium">Số lượt thử tối thiểu:</label>
            <select
              value={minAttempts}
              onChange={(e) => setMinAttempts(Number(e.target.value))}
              className="text-xs border rounded px-2 py-1 bg-gray-50"
            >
              <option value="1">1 lượt</option>
              <option value="3">3 lượt (chuẩn)</option>
              <option value="5">5 lượt</option>
            </select>
          </div>
        </div>

        {weakWords.length === 0 ? (
          <p className="text-xs text-gray-500 py-4 text-center">Chưa có từ vựng nào đạt ngưỡng làm sai.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-700 font-semibold">
                  <th className="py-2.5 px-3">Hình ảnh</th>
                  <th className="py-2.5 px-3">Từ vựng</th>
                  <th className="py-2.5 px-3">Nghĩa tiếng Việt</th>
                  <th className="py-2.5 px-3">Kỹ năng</th>
                  <th className="py-2.5 px-3">Tỷ lệ sai</th>
                  <th className="py-2.5 px-3">Số lần làm</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {weakWords.map((item) => (
                  <tr key={`${item.vocabularyItemId}-${item.skill}`} className="hover:bg-gray-50/70">
                    <td className="py-2 px-3">
                      {item.imageKey ? (
                        <div className="w-10 h-10 rounded overflow-hidden border bg-white flex items-center justify-center">
                          <SignedMediaImage imageKey={item.imageKey} alt={item.word} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-bold text-gray-900">{item.word}</td>
                    <td className="py-2 px-3 text-gray-600">{item.meaningVi || '—'}</td>
                    <td className="py-2 px-3 text-gray-600 font-mono text-[11px]">{item.skill}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                        item.errorRate >= 0.5 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {Math.round(item.errorRate * 100)}%
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-700 font-mono">
                      {item.wrongCount}/{item.totalAttempts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Completions Section */}
      {completions.length > 0 && (
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-gray-900">Tiến độ bài học theo học sinh</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-700 font-semibold">
                  <th className="py-2 px-3">Học sinh</th>
                  <th className="py-2 px-3">Nghe & Nhắc lại</th>
                  <th className="py-2 px-3">Luyện tập</th>
                  <th className="py-2 px-3">Sao / Điểm</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {completions.map((c) => (
                  <tr key={c.studentId}>
                    <td className="py-2 px-3 font-semibold text-gray-900">{c.studentNickname || `Học sinh #${c.studentId}`}</td>
                    <td className="py-2 px-3">{c.hasCompletedLearn ? '✅ Đã học' : '⏳ Chưa'}</td>
                    <td className="py-2 px-3">{c.hasCompletedPractice ? '✅ Đã làm' : '⏳ Chưa'}</td>
                    <td className="py-2 px-3">
                      {c.bestStars ? `${c.bestStars} ⭐` : (c.bestScorePercent ? `${c.bestScorePercent}%` : '—')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

