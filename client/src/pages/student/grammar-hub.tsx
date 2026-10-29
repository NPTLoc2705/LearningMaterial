import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AssignmentService } from '../../Service/AssignmentService';
import { GrammarService } from '../../Service/GrammarService';
import type {
  GrammarTopicDto,
  StudentAssignedLessonDto,
} from '../../types/api';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

interface EnrichedTopicItem {
  topic: GrammarTopicDto;
  lesson: StudentAssignedLessonDto;
}

export function StudentGrammarHubPage() {
  const [items, setItems] = useState<EnrichedTopicItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function loadAllGrammar() {
      setIsLoading(true);
      setError(null);
      try {
        const assignments = await AssignmentService.getMyAssignments();
        const enriched: EnrichedTopicItem[] = [];

        // For each assigned lesson, fetch its grammar topics
        await Promise.all(
          assignments.map(async (assign) => {
            try {
              const topics = await GrammarService.getLessonGrammarTopics(
                assign.lessonId
              );
              for (const t of topics) {
                enriched.push({
                  topic: t,
                  lesson: assign,
                });
              }
            } catch {
              // Ignore lessons without accessible grammar topics
            }
          })
        );

        if (active) {
          // Sort by unitNo, lessonNo, sortOrder
          enriched.sort((a, b) => {
            if (a.lesson.unitNo !== b.lesson.unitNo) {
              return a.lesson.unitNo - b.lesson.unitNo;
            }
            if (a.lesson.lessonNo !== b.lesson.lessonNo) {
              return a.lesson.lessonNo - b.lesson.lessonNo;
            }
            return a.topic.sortOrder - b.topic.sortOrder;
          });
          setItems(enriched);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : 'Không thể tải danh sách ngữ pháp.'
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadAllGrammar();

    return () => {
      active = false;
    };
  }, []);

  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.topic.title.toLowerCase().includes(q) ||
      (item.topic.summary && item.topic.summary.toLowerCase().includes(q)) ||
      item.lesson.title.toLowerCase().includes(q) ||
      (item.lesson.unitTitle && item.lesson.unitTitle.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white p-6 sm:p-8 shadow-subtle space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="blue" size="sm">
            Ngữ pháp chuyên sâu
          </Badge>
          <span className="font-mono text-xs uppercase tracking-wider text-indigo-200">
            Học · Luyện tập · Kiểm tra · Ôn tập
          </span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
          Sổ tay Ngữ pháp
        </h1>
        <p className="text-indigo-100 text-sm sm:text-base max-w-2xl">
          Tổng hợp tất cả các chủ đề ngữ pháp từ các bài học đã được phân công. Hãy nắm chắc công thức và vượt qua bài kiểm tra với điểm số trên 70%!
        </p>
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="max-w-md w-full">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm chủ đề hoặc công thức ngữ pháp..."
          />
        </div>
        <span className="text-xs font-mono text-[#6B6A66]">
          {filteredItems.length} chủ đề khả dụng
        </span>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-16 text-center font-mono text-xs text-[#9E9D97] animate-pulse">
          Đang tải dữ liệu ngữ pháp...
        </div>
      ) : filteredItems.length === 0 ? (
        <Card innerClassName="p-12 text-center space-y-3">
          <p className="text-4xl">📚</p>
          <h3 className="font-serif text-lg font-bold text-gray-800">
            {searchQuery ? 'Không tìm thấy chủ đề phù hợp.' : 'Chưa có chủ đề ngữ pháp nào.'}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Các chuyên đề ngữ pháp sẽ xuất hiện tại đây khi giáo viên giao bài học mới.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map(({ topic, lesson }) => (
            <Card
              key={`${lesson.lessonId}-${topic.id}`}
              innerClassName="p-5 flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-all border border-gray-200"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    Unit {lesson.unitNo} · Lesson {lesson.lessonNo}
                  </span>
                  <span className="text-xs text-gray-400">
                    {topic.rules.length} quy tắc
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-gray-900">
                  {topic.title}
                </h3>

                {topic.summary && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {topic.summary}
                  </p>
                )}

                {/* Formula snippet preview if available */}
                {topic.rules[0]?.formula && (
                  <div className="p-2 bg-gray-50 border rounded-lg font-mono text-xs font-bold text-gray-800 truncate">
                    📐 {topic.rules[0].formula}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t flex items-center justify-between gap-2">
                <span className="text-xs text-gray-500 truncate">
                  Bài học: {lesson.title}
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() =>
                    navigate(
                      `/student/grammar/${topic.id}?lessonId=${lesson.lessonId}&classroomId=${lesson.classroomId}`
                    )
                  }
                  className="shrink-0"
                >
                  Học ngay ➔
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentGrammarHubPage;
