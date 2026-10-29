import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../lib/authFetch';
import { ExtractionService } from '../Service/ExtractionService';
import type {
  ExtractionDraftDto,
  ExtractionJobDto,
} from '../types/api';

export function useExtractionJob(lessonId: number) {
  const [job, setJob] = useState<ExtractionJobDto | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const pollJobStatus = useCallback(async (jobId: number) => {
    try {
      const data = await ExtractionService.getExtractionJob(jobId);
      setJob(data);
      return data;
    } catch (err) {
      setError(
        err instanceof ApiError ? err.detail : 'Không thể tải trạng thái trích xuất.'
      );
      return null;
    }
  }, []);

  useEffect(() => {
    if (!job || (job.status !== 'Uploaded' && job.status !== 'Extracting')) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void pollJobStatus(job.id);
    }, 2000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [job, pollJobStatus]);

  const uploadSlideDeck = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setError(null);
      try {
        const response = await ExtractionService.uploadSlideDeck(lessonId, file);
        const initialJob = await ExtractionService.getExtractionJob(response.jobId);
        setJob(initialJob);
        return initialJob;
      } catch (err) {
        const message =
          err instanceof ApiError ? err.detail : 'Không thể tải lên file slide/PDF.';
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [lessonId]
  );

  const updateDraft = useCallback(
    async (draft: ExtractionDraftDto) => {
      if (!job) return;
      setIsProcessingAction(true);
      setError(null);
      try {
        const updated = await ExtractionService.updateDraft(job.id, { draft });
        setJob(updated);
        return updated;
      } catch (err) {
        const message =
          err instanceof ApiError ? err.detail : 'Không thể cập nhật bản nháp trích xuất.';
        setError(message);
        throw err;
      } finally {
        setIsProcessingAction(false);
      }
    },
    [job]
  );

  const approveJob = useCallback(async () => {
    if (!job) return;
    setIsProcessingAction(true);
    setError(null);
    try {
      const approved = await ExtractionService.approveJob(job.id);
      setJob(approved);
      return approved;
    } catch (err) {
      const message =
        err instanceof ApiError ? err.detail : 'Không thể duyệt nội dung trích xuất.';
      setError(message);
      throw err;
    } finally {
      setIsProcessingAction(false);
    }
  }, [job]);

  const discardJob = useCallback(async () => {
    if (!job) return;
    setIsProcessingAction(true);
    setError(null);
    try {
      const discarded = await ExtractionService.discardJob(job.id);
      setJob(discarded);
      return discarded;
    } catch (err) {
      const message =
        err instanceof ApiError ? err.detail : 'Không thể hủy bản nháp trích xuất.';
      setError(message);
      throw err;
    } finally {
      setIsProcessingAction(false);
    }
  }, [job]);

  const resetJob = useCallback(() => {
    setJob(null);
    setError(null);
  }, []);

  return {
    job,
    isUploading,
    isProcessingAction,
    error,
    clearError: () => setError(null),
    uploadSlideDeck,
    updateDraft,
    approveJob,
    discardJob,
    resetJob,
  };
}

