import { useState, useCallback } from 'react';
import Starfield from './components/Starfield';
import LandingPage from './sections/LandingPage';
import QuestionPage from './sections/QuestionPage';
import LoadingPage from './sections/LoadingPage';
import ResultPage from './sections/ResultPage';
import { calculateResult } from './data/quizUtils';
import type { QuizResult } from './data/quizUtils';

type Page = 'landing' | 'question' | 'loading' | 'result';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleStart = useCallback(() => {
    setPage('question');
  }, []);

  const handleComplete = useCallback((answers: number[]) => {
    const quizResult = calculateResult(answers);
    setResult(quizResult);
    setPage('loading');
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setPage('result');
  }, []);

  const handleRestart = useCallback(() => {
    setResult(null);
    setPage('landing');
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 星空背景 - 所有页面共享 */}
      <Starfield />

      {/* 页面内容 */}
      {page === 'landing' && <LandingPage onStart={handleStart} />}
      {page === 'question' && <QuestionPage onComplete={handleComplete} />}
      {page === 'loading' && <LoadingPage onComplete={handleLoadingComplete} />}
      {page === 'result' && result && <ResultPage result={result} onRestart={handleRestart} />}
    </div>
  );
}
