import { useEffect, useState } from 'react';
import { VocabularyService } from '../../Service/VocabularyService';

export interface SignedMediaImageProps {
  imageKey: string | null | undefined;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export function SignedMediaImage({
  imageKey,
  alt,
  className = 'w-14 h-14 rounded-xl object-cover border border-[#E8E7E4] bg-[#F4F3EF]',
  fallbackText = '🖼️',
}: SignedMediaImageProps) {
  const [resolvedState, setResolvedState] = useState<{
    key: string;
    url: string | null;
    failed: boolean;
  } | null>(null);

  useEffect(() => {
    if (!imageKey) return;

    let cancelled = false;
    VocabularyService.getSignedMediaUrl(imageKey)
      .then((url) => {
        if (!cancelled) {
          setResolvedState({ key: imageKey, url, failed: false });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResolvedState({ key: imageKey, url: null, failed: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [imageKey]);

  const activeUrl =
    imageKey && resolvedState?.key === imageKey && !resolvedState.failed
      ? resolvedState.url
      : null;

  if (!imageKey || !activeUrl) {
    return (
      <div
        aria-label={alt}
        className={`inline-flex items-center justify-center text-lg select-none ${className}`}
      >
        <span aria-hidden="true">{fallbackText}</span>
      </div>
    );
  }

  return (
    <img
      src={activeUrl}
      alt={alt}
      loading="lazy"
      onError={() =>
        setResolvedState({ key: imageKey, url: null, failed: true })
      }
      className={className}
    />
  );
}

