import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseSpeechOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
}

export interface UseSpeechResult {
  isSupported: boolean;
  isSpeaking: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  speak: (text: string, overrideOptions?: UseSpeechOptions) => void;
  stop: () => void;
  error: string | null;
}

export function useSpeech(defaultOptions?: UseSpeechOptions): UseSpeechResult {
  const [isSupported] = useState<boolean>(
    () => typeof window !== 'undefined' && 'speechSynthesis' in window
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [error, setError] = useState<string | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // Pick best English voice for young learners
        const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
        const preferred = englishVoices.find(v =>
          /natural|google|samantha|karen|daniel/i.test(v.name)
        ) || englishVoices[0] || availableVoices[0] || null;

        setSelectedVoice(preferred);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback((text: string, overrideOptions?: UseSpeechOptions) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setError('Web Speech Synthesis is not supported in this browser.');
      return;
    }

    if (!text.trim()) return;

    // Direct user-gesture triggered speak
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    const rate = overrideOptions?.rate ?? defaultOptions?.rate ?? 0.85; // Slowed down for children
    const pitch = overrideOptions?.pitch ?? defaultOptions?.pitch ?? 1.0;
    const lang = overrideOptions?.lang ?? defaultOptions?.lang ?? 'en-US';

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = lang;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setError(null);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      setIsSpeaking(false);
      setError(`Speech synthesis error: ${e.error}`);
    };

    window.speechSynthesis.speak(utterance);
  }, [defaultOptions, selectedVoice]);

  return {
    isSupported,
    isSpeaking,
    voices,
    selectedVoice,
    speak,
    stop,
    error,
  };
}
