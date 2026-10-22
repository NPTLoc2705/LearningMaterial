import { useEffect } from 'react';

interface KeyboardNavOptions {
  onFlip?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onMarkReview?: () => void;
  onMarkKnown?: () => void;
  enabled?: boolean;
}

export function useKeyboardNav({
  onFlip,
  onNext,
  onPrev,
  onMarkReview,
  onMarkKnown,
  enabled = true,
}: KeyboardNavOptions) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onFlip?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext?.();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrev?.();
          break;
        case 'Digit1':
        case 'Numpad1':
          e.preventDefault();
          onMarkReview?.();
          break;
        case 'Digit2':
        case 'Numpad2':
          e.preventDefault();
          onMarkKnown?.();
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onFlip, onNext, onPrev, onMarkReview, onMarkKnown]);
}
