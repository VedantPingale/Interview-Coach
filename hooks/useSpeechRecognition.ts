import { useCallback, useEffect, useRef, useState } from 'react';

type SpeechRecognitionType = typeof window extends any
  ? (window & { webkitSpeechRecognition?: any }).webkitSpeechRecognition | any
  : any;

interface UseSpeechRecognitionOptions {
  lang?: string;
  interimResults?: boolean;
  continuous?: boolean;
  autoStopSilenceMs?: number; // if provided, stop after this silence window
}

interface UseSpeechRecognitionResult {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionResult {
  const { lang = 'en-US', interimResults = true, continuous = true, autoStopSilenceMs } = options;

  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const silenceTimeoutRef = useRef<number | null>(null);

  // Initialize API availability
  useEffect(() => {
    const SpeechRecognitionImpl: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionImpl) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognitionImpl();
      recognitionRef.current.lang = lang;
      recognitionRef.current.interimResults = interimResults;
      recognitionRef.current.continuous = continuous;
    } else {
      setIsSupported(false);
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.stop?.();
        } catch (_) {}
      }
      if (silenceTimeoutRef.current) {
        window.clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, [lang, interimResults, continuous]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (_) {}
    setIsListening(false);
    if (silenceTimeoutRef.current) {
      window.clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  }, []);

  const scheduleSilenceStop = useCallback(() => {
    if (!autoStopSilenceMs) return;
    if (silenceTimeoutRef.current) {
      window.clearTimeout(silenceTimeoutRef.current);
    }
    silenceTimeoutRef.current = window.setTimeout(() => {
      stopListening();
    }, autoStopSilenceMs);
  }, [autoStopSilenceMs, stopListening]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    setInterimTranscript('');
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err: any) {
      // calling start twice throws; ignore if already active
      if (err?.name !== 'InvalidStateError') {
        setError(err?.message || 'Speech recognition failed to start');
      }
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  // Wire up events
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.onresult = (event: any) => {
      let interim = '';
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += chunk;
        } else {
          interim += chunk;
        }
      }
      if (finalText) {
        setTranscript(prev => (prev ? `${prev} ${finalText}` : finalText));
      }
      setInterimTranscript(interim);
      scheduleSilenceStop();
    };

    recognition.onerror = (event: any) => {
      setError(event?.error || 'speech_recognition_error');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (!recognition) return;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, [scheduleSilenceStop]);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}

export default useSpeechRecognition;



