import { useState, useCallback } from 'react';
import { SessionService } from '../Service/SessionService';
import type {
  ActivityType,
  ClientQuestionDto,
  CompleteSessionResponseDto,
  StartSessionResponseDto,
  SubmitAnswerResponseDto,
} from '../types/api';

export interface UseGameSessionResult {
  session: StartSessionResponseDto | null;
  questions: ClientQuestionDto[];
  currentIndex: number;
  currentQuestion: ClientQuestionDto | null;
  feedback: SubmitAnswerResponseDto | null;
  isSubmitting: boolean;
  isLoading: boolean;
  isCompleted: boolean;
  result: CompleteSessionResponseDto | null;
  error: string | null;
  start: (lessonId: number, classroomId: number, activityType: ActivityType) => Promise<void>;
  submitAnswer: (answer: string) => Promise<SubmitAnswerResponseDto | null>;
  nextQuestion: () => Promise<void>;
}

export function useGameSession(): UseGameSessionResult {
  const [session, setSession] = useState<StartSessionResponseDto | null>(null);
  const [questions, setQuestions] = useState<ClientQuestionDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<SubmitAnswerResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [result, setResult] = useState<CompleteSessionResponseDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async (lessonId: number, classroomId: number, activityType: ActivityType) => {
    setIsLoading(true);
    setError(null);
    setFeedback(null);
    setResult(null);
    setIsCompleted(false);
    setCurrentIndex(0);

    try {
      const resp = await SessionService.startSession({
        lessonId,
        classroomId,
        activityType,
      });
      setSession(resp);
      setQuestions(resp.questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start game session.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const currentQuestion = questions[currentIndex] || null;

  const submitAnswer = useCallback(async (answer: string) => {
    if (!session || !currentQuestion || isSubmitting || feedback) return null;

    setIsSubmitting(true);
    setError(null);

    try {
      const resp = await SessionService.submitAnswer(session.sessionId, {
        sessionQuestionId: currentQuestion.id,
        answer,
      });
      setFeedback(resp);
      return resp;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit answer.');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [session, currentQuestion, isSubmitting, feedback]);

  const nextQuestion = useCallback(async () => {
    if (!session) return;

    setFeedback(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed all questions
      setIsLoading(true);
      try {
        const comp = await SessionService.completeSession(session.sessionId);
        setResult(comp);
        setIsCompleted(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not complete session.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [session, currentIndex, questions.length]);

  return {
    session,
    questions,
    currentIndex,
    currentQuestion,
    feedback,
    isSubmitting,
    isLoading,
    isCompleted,
    result,
    error,
    start,
    submitAnswer,
    nextQuestion,
  };
}
