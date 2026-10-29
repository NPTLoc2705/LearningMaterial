import { authFetch } from '../lib/authFetch';
import type {
  AssignmentCompletionReportDto,
  StudentProgressReportDto,
  WeakVocabularyReportDto,
} from '../types/api';

export const ReportService = {
  async getWeakVocabularyReport(
    classroomId: number,
    lessonId?: number,
    minAttempts: number = 3
  ): Promise<WeakVocabularyReportDto[]> {
    const params = new URLSearchParams();
    if (lessonId) params.set('lessonId', String(lessonId));
    params.set('minAttempts', String(minAttempts));

    return authFetch<WeakVocabularyReportDto[]>(
      `/classrooms/${classroomId}/reports/weak-vocabulary?${params.toString()}`,
      { method: 'GET' }
    );
  },

  async getStudentProgress(
    classroomId: number,
    studentId: number
  ): Promise<StudentProgressReportDto[]> {
    return authFetch<StudentProgressReportDto[]>(
      `/classrooms/${classroomId}/students/${studentId}/progress`,
      { method: 'GET' }
    );
  },

  async getAssignmentCompletions(
    classroomId: number,
    lessonId: number
  ): Promise<AssignmentCompletionReportDto[]> {
    return authFetch<AssignmentCompletionReportDto[]>(
      `/classrooms/${classroomId}/reports/completions?lessonId=${lessonId}`,
      { method: 'GET' }
    );
  },
};

