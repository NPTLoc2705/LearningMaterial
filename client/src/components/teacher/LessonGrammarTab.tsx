import { useCallback, useEffect, useState } from 'react';
import { GrammarService } from '../../Service/GrammarService';
import type {
  GrammarTopicDto,
  LessonDto,
  QuestionDto,
} from '../../types/api';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { GrammarStudentPreviewModal } from './grammar/GrammarStudentPreviewModal';
import { SeniorGrammarEditor } from './grammar/SeniorGrammarEditor';
import { YoungGrammarEditor } from './grammar/YoungGrammarEditor';

interface LessonGrammarTabProps {
  lesson: LessonDto;
  isReadOnly?: boolean;
}

export function LessonGrammarTab({
  lesson,
  isReadOnly = false,
}: LessonGrammarTabProps) {
  const [topics, setTopics] = useState<GrammarTopicDto[]>([]);
  const [activeTopicQuestions, setActiveTopicQuestions] = useState<QuestionDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const loadTopics = useCallback(async () => {
    try {
      const data = await GrammarService.getLessonGrammarTopics(lesson.id);
      setTopics(data);
      if (data.length > 0) {
        try {
          const qs = await GrammarService.getTopicQuestions(data[0].id);
          setActiveTopicQuestions(qs);
        } catch {
          setActiveTopicQuestions([]);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không thể tải nội dung ngữ pháp.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [lesson.id]);

  useEffect(() => {
    let active = true;
    GrammarService.getLessonGrammarTopics(lesson.id)
      .then(async (data) => {
        if (!active) return;
        setTopics(data);
        if (data.length > 0) {
          try {
            const qs = await GrammarService.getTopicQuestions(data[0].id);
            if (active) setActiveTopicQuestions(qs);
          } catch {
            if (active) setActiveTopicQuestions([]);
          }
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : 'Không thể tải nội dung ngữ pháp.'
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [lesson.id]);

  const isYoung = lesson.levelGroup === 'Young';

  if (isLoading) {
    return (
      <div className="py-8 text-center font-mono text-xs text-[#9E9D97] animate-pulse">
        Đang tải dữ liệu ngữ pháp...
      </div>
    );
  }

  return (
    <Card innerClassName="p-6 space-y-6">
      {/* Tab Header & Preview Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-gray-900">
            {isYoung ? 'Mẫu câu giao tiếp & Ngữ pháp' : 'Ngữ pháp & Bài tập'}
          </h2>
          <p className="text-xs text-gray-500">
            {isYoung
              ? 'Khối Young: Thiết kế mẫu câu trực quan, kèm hình ảnh và âm thanh phát âm.'
              : 'Khối Senior: Định nghĩa quy tắc, công thức, giải thích và bộ câu hỏi luyện tập/kiểm tra.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={topics.length === 0}
            onClick={() => setIsPreviewOpen(true)}
          >
            👁️ Xem thử như học sinh
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Editor according to level group */}
      {isYoung ? (
        <YoungGrammarEditor
          lessonId={lesson.id}
          topics={topics}
          isReadOnly={isReadOnly}
          onRefresh={loadTopics}
        />
      ) : (
        <SeniorGrammarEditor
          lessonId={lesson.id}
          topics={topics}
          isReadOnly={isReadOnly}
          onRefresh={loadTopics}
        />
      )}

      {/* Preview modal */}
      <GrammarStudentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        levelGroup={lesson.levelGroup}
        topic={topics[0] ?? null}
        questions={activeTopicQuestions}
      />
    </Card>
  );
}

export default LessonGrammarTab;
