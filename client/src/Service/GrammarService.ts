import { authFetch } from '../lib/authFetch';
import type {
  CreateGrammarExampleRequest,
  CreateGrammarRuleRequest,
  CreateGrammarTopicRequest,
  CreateQuestionRequest,
  GrammarExampleDto,
  GrammarRuleDto,
  GrammarTopicDto,
  QuestionDto,
  UpdateGrammarExampleRequest,
  UpdateGrammarRuleRequest,
  UpdateGrammarTopicRequest,
  UpdateQuestionRequest,
} from '../types/api';

export const GrammarService = {
  async getLessonGrammarTopics(lessonId: number): Promise<GrammarTopicDto[]> {
    return authFetch<GrammarTopicDto[]>(`/lessons/${lessonId}/grammar-topics`, {
      method: 'GET',
    });
  },

  async getGrammarTopic(id: number): Promise<GrammarTopicDto> {
    return authFetch<GrammarTopicDto>(`/grammar-topics/${id}`, {
      method: 'GET',
    });
  },

  async createGrammarTopic(
    lessonId: number,
    data: CreateGrammarTopicRequest
  ): Promise<GrammarTopicDto> {
    return authFetch<GrammarTopicDto>(`/lessons/${lessonId}/grammar-topics`, {
      method: 'POST',
      body: data,
    });
  },

  async updateGrammarTopic(
    id: number,
    data: UpdateGrammarTopicRequest
  ): Promise<GrammarTopicDto> {
    return authFetch<GrammarTopicDto>(`/grammar-topics/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  async deleteGrammarTopic(id: number): Promise<void> {
    return authFetch<void>(`/grammar-topics/${id}`, {
      method: 'DELETE',
    });
  },

  async createGrammarRule(
    topicId: number,
    data: CreateGrammarRuleRequest
  ): Promise<GrammarRuleDto> {
    return authFetch<GrammarRuleDto>(`/grammar-topics/${topicId}/rules`, {
      method: 'POST',
      body: data,
    });
  },

  async updateGrammarRule(
    id: number,
    data: UpdateGrammarRuleRequest
  ): Promise<GrammarRuleDto> {
    return authFetch<GrammarRuleDto>(`/rules/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  async deleteGrammarRule(id: number): Promise<void> {
    return authFetch<void>(`/rules/${id}`, {
      method: 'DELETE',
    });
  },

  async createGrammarExample(
    ruleId: number,
    data: CreateGrammarExampleRequest
  ): Promise<GrammarExampleDto> {
    return authFetch<GrammarExampleDto>(`/rules/${ruleId}/examples`, {
      method: 'POST',
      body: data,
    });
  },

  async updateGrammarExample(
    id: number,
    data: UpdateGrammarExampleRequest
  ): Promise<GrammarExampleDto> {
    return authFetch<GrammarExampleDto>(`/examples/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  async deleteGrammarExample(id: number): Promise<void> {
    return authFetch<void>(`/examples/${id}`, {
      method: 'DELETE',
    });
  },

  async getTopicQuestions(topicId: number): Promise<QuestionDto[]> {
    return authFetch<QuestionDto[]>(`/grammar-topics/${topicId}/questions`, {
      method: 'GET',
    });
  },

  async createQuestion(
    topicId: number,
    data: CreateQuestionRequest
  ): Promise<QuestionDto> {
    return authFetch<QuestionDto>(`/grammar-topics/${topicId}/questions`, {
      method: 'POST',
      body: data,
    });
  },

  async updateQuestion(
    id: number,
    data: UpdateQuestionRequest
  ): Promise<QuestionDto> {
    return authFetch<QuestionDto>(`/questions/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  async deleteQuestion(id: number): Promise<void> {
    return authFetch<void>(`/questions/${id}`, {
      method: 'DELETE',
    });
  },
};
