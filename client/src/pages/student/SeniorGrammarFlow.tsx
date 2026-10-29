import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { GrammarService } from '../../Service/GrammarService';
import type {
  CompleteSessionResponseDto,
  GrammarTopicDto,
} from '../../types/api';
import { Card } from '../../components/ui/Card';
import { SeniorGrammarLearnStep } from './grammar/SeniorGrammarLearnStep';
import { SeniorGrammarPracticeStep } from './grammar/SeniorGrammarPracticeStep';
import { SeniorGrammarTestStep } from './grammar/SeniorGrammarTestStep';
import { SeniorGrammarReviewStep } from './grammar/SeniorGrammarReviewStep';

export type GrammarFlowStep = 'learn' | 'practice' | 'test' | 'review';

export function SeniorGrammarFlowPage() {
  const { topicId: routeTopicId, id: routeLessonId } = useParams<{
    topicId?: string;
    id?: string;
  }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryLessonId = searchParams.get('lessonId');
  const queryClassroomId = searchParams.get('classroomId');
  const queryTopicId = searchParams.get('topicId');

  const topicId = parseInt(routeTopicId || queryTopicId || '0', 10);
  const lessonId = parseInt(routeLessonId || queryLessonId || '0', 10);
  const classroomId = parseInt(queryClassroomId || '0', 10);

  const [activeTopic, setActiveTopic] = useState<GrammarTopicDto | null>(null);
  const [currentStep, setCurrentStep] = useState<GrammarFlowStep>('learn');
  const [testResult, setTestResult] = useState<CompleteSessionResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        if (topicId > 0) {
          const t = await GrammarService.getGrammarTopic(topicId);
          if (active) setActiveTopic(t);
        } else if (lessonId > 0) {
          const topics = await GrammarService.getLessonGrammarTopics(lessonId);
          if (active) {
            if (topics.length > 0) {
              setActiveTopic(topics[0]);
            } else {
              setError('Bài học này chưa có chủ đề ngữ pháp nào.');
            }
          }
        } else {
          setError('Không tìm thấy thông tin bài học hoặc chủ đề ngữ pháp.');
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : 'Không thể tải nội dung ngữ pháp.'
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [topicId, lessonId]);

  if (isLoading) {
    return (
      <div className="py-16 text-center font-mono text-sm text-indigo-600 animate-pulse">
        Đang tải chuyên đề ngữ pháp...
      </div>
    );
  }

  if (error || !activeTopic) {
    return (
      <Card innerClassName="p-8 text-center space-y-4 max-w-md mx-auto">
        <p className="text-sm text-red-600 font-bold">{error ?? 'Không tìm thấy chủ đề.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-xl font-bold text-sm hover:bg-gray-300"
        >
          Quay lại
        </button>
      </Card>
    );
  }

  const effectiveLessonId = activeTopic.lessonId || lessonId;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Flow Progress Step Indicator */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-subtle flex items-center justify-between gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setCurrentStep('learn')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            currentStep === 'learn'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          1. Lý thuyết
        </button>
        <span className="text-gray-300">➜</span>
        <button
          type="button"
          onClick={() => setCurrentStep('practice')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            currentStep === 'practice'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          2. Luyện tập
        </button>
        <span className="text-gray-300">➜</span>
        <button
          type="button"
          onClick={() => setCurrentStep('test')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            currentStep === 'test'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          3. Kiểm tra (≥ 70%)
        </button>
        <span className="text-gray-300">➜</span>
        <button
          type="button"
          disabled={!testResult}
          onClick={() => testResult && setCurrentStep('review')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            currentStep === 'review'
              ? 'bg-indigo-600 text-white shadow-sm'
              : testResult
              ? 'text-gray-600 hover:bg-gray-100'
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          4. Xem lại
        </button>
      </div>

      {/* Step Contents */}
      {currentStep === 'learn' && (
        <SeniorGrammarLearnStep
          topic={activeTopic}
          onProceedToPractice={() => setCurrentStep('practice')}
        />
      )}

      {currentStep === 'practice' && (
        <SeniorGrammarPracticeStep
          lessonId={effectiveLessonId}
          classroomId={classroomId}
          topicId={activeTopic.id}
          onProceedToTest={() => setCurrentStep('test')}
          onBackToLearn={() => setCurrentStep('learn')}
        />
      )}

      {currentStep === 'test' && (
        <SeniorGrammarTestStep
          lessonId={effectiveLessonId}
          classroomId={classroomId}
          topicId={activeTopic.id}
          onProceedToReview={(res) => {
            setTestResult(res);
            setCurrentStep('review');
          }}
          onBackToPractice={() => setCurrentStep('practice')}
        />
      )}

      {currentStep === 'review' && testResult && (
        <SeniorGrammarReviewStep
          result={testResult}
          onRetakeTest={() => setCurrentStep('test')}
          onBackToLearn={() => setCurrentStep('learn')}
          onFinish={() => navigate('/student/grammar')}
        />
      )}
    </div>
  );
}

export default SeniorGrammarFlowPage;
