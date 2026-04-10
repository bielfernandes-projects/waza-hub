'use client';

import { useState, useEffect, useCallback } from 'react';

export function useTTS() {
  const [supported, setSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Check if running in browser and if API is available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
      
      // Some browsers need this to trigger voice loading initially
      window.speechSynthesis.getVoices();
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!supported) return;

    // Interromper qualquer áudio anterior
    window.speechSynthesis.cancel();
    // Atraso curto para que o navegador lide bem com o cancelamento imediato antes de falar de novo
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      
      // Strict rule: Only use Japanese voice for Judo technique names
      const selectedVoice = voices.find(v => v.lang.startsWith('ja') || v.lang === 'ja_JP');
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.lang = 'ja-JP'; // Explicitly set lang to ja-JP as a secondary driver for accuracy

      utterance.rate = 0.9; // Levemente reduzido para melhor dicção
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      
      // Cleanup de estado quando terminar ou der erro
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [supported]);

  return { speak, isSpeaking, supported };
}
