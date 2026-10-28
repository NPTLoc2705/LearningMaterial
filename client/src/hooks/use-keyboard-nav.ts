import { useEffect, useRef } from 'react';

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
  const handlersRef = useRef({
    onFlip,
    onNext,
    onPrev,
    onMarkReview,
    onMarkKnown,
  });

  // Synchronize latest callbacks in effect to keep render pure
  useEffect(() => {
    handlersRef.current = {
      onFlip,
      onNext,
      onPrev,
      onMarkReview,
      onMarkKnown,
    };
  });

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
          handlersRef.current.onFlip?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handlersRef.current.onNext?.();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlersRef.current.onPrev?.();
          break;
        case 'Digit1':
        case 'Numpad1':
          e.preventDefault();
          handlersRef.current.onMarkReview?.();
          break;
        case 'Digit2':
        case 'Numpad2':
          e.preventDefault();
          handlersRef.current.onMarkKnown?.();
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}
