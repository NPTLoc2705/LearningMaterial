import React from 'react';
import { useSpeech } from '../../hooks/use-speech';

export interface SpeakerButtonProps {
  text: string;
  size?: 'md' | 'lg';
  autoPlay?: boolean;
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  text,
  size = 'lg',
  autoPlay = false,
}) => {
  const { speak, isSpeaking, isSupported } = useSpeech({ rate: 0.85 });

  React.useEffect(() => {
    if (autoPlay && text && isSupported) {
      speak(text);
    }
  }, [autoPlay, text, isSupported, speak]);

  const sizeClasses = size === 'lg' ? 'w-20 h-20 text-3xl' : 'w-16 h-16 text-2xl';

  return (
    <button
      type="button"
      onClick={() => speak(text)}
      disabled={!isSupported}
      aria-label={`Listen to ${text}`}
      className={`${sizeClasses} rounded-full bg-blue-500 hover:bg-blue-600 active:scale-90 text-white flex items-center justify-center shadow-md transition-all duration-150 border-4 border-white ${
        isSpeaking ? 'ring-4 ring-blue-300 animate-pulse' : ''
      }`}
      style={{ touchAction: 'manipulation' }}
    >
      <span role="img" aria-label="speaker">
        🔊
      </span>
    </button>
  );
};

