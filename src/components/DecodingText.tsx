import { useState, useRef, useEffect, useCallback } from 'react';

interface DecodingTextProps {
  text: string;
  className?: string;
  onComplete?: () => void;
  trigger?: boolean;
}

export default function DecodingText({ text, className = '', onComplete, trigger = true }: DecodingTextProps) {
  const [displayText, setDisplayText] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasStarted = useRef(false);

  const startDecode = useCallback(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText('');

    const charset = '☽✦⚚⬡⧗⌘⍟⏣⬭⬮⬯◈⟡';
    const finalText = text;
    let iteration = 0;

    intervalRef.current = setInterval(() => {
      let decoded = finalText.slice(0, Math.floor(iteration));
      const remaining = finalText.length - Math.floor(iteration);
      for (let i = 0; i < remaining; i++) {
        decoded += charset[Math.floor(Math.random() * charset.length)];
      }
      setDisplayText(decoded);

      if (iteration >= finalText.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(finalText);
        onComplete?.();
      }
      iteration += 1 / 3;
    }, 30);
  }, [text, onComplete]);

  useEffect(() => {
    if (trigger) {
      // Small delay to make the effect visible
      const timer = setTimeout(() => startDecode(), 100);
      return () => clearTimeout(timer);
    }
  }, [trigger, startDecode]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span
      className={className}
      style={{
        fontFamily: "'Courier New', monospace",
        letterSpacing: '2px',
        color: displayText === text && displayText !== '' ? '#ffffff' : '#6495ed',
        transition: 'color 0.3s',
      }}
    >
      {displayText || text}
    </span>
  );
}
