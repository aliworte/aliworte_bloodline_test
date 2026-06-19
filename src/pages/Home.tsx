import { useState, useRef, useCallback, useEffect } from 'react';
import EmberBackground from '@/components/EmberBackground';
import ArmillarySphere from '@/components/ArmillarySphere';
import DecodingText from '@/components/DecodingText';
import { QUESTIONS, RACE_DATA } from '@/data/quizData';
import { calculateResult } from '@/lib/calculateResult';
import type { CalculationResult } from '@/types/quiz';

type Screen = 'hero' | 'quiz' | 'loading' | 'result';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('hero');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setScreen('quiz');
    setCurrentQuestion(0);
    setChoices([]);
  };

  const handleOptionSelect = useCallback(
    (optionIndex: number) => {
      if (selectedOption !== null) return;
      setSelectedOption(optionIndex);

      const option = QUESTIONS[currentQuestion].options[optionIndex];
      const newChoices = [...choices, option.label];
      setChoices(newChoices);

      setTimeout(() => {
        if (currentQuestion < QUESTIONS.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
          setSelectedOption(null);
        } else {
          const calcResult = calculateResult(newChoices);
          setResult(calcResult);
          setScreen('loading');

          setTimeout(() => {
            setScreen('result');
          }, 3500);
        }
      }, 800);
    },
    [currentQuestion, choices, selectedOption]
  );

  const handleRestart = () => {
    setScreen('hero');
    setCurrentQuestion(0);
    setChoices([]);
    setResult(null);
    setSelectedOption(null);
  };

  useEffect(() => {
    if (screen === 'quiz' && quizRef.current) {
      const qEl = quizRef.current.querySelector(`[data-qindex="${currentQuestion}"]`);
      if (qEl) {
        qEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentQuestion, screen]);

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: '#000000', color: '#ffffff' }}
    >
      <EmberBackground />

      {/* ===== HERO SCREEN ===== */}
      {screen === 'hero' && (
        <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4">
          <div className="mb-4 text-center">
            <h1
              className="mb-6 text-5xl leading-tight font-bold md:text-7xl"
              style={{
                fontFamily: "'Inter', 'Noto Sans SC', sans-serif",
                color: '#ffffff',
                letterSpacing: '0.05em',
              }}
            >
              标题
            </h1>
            <p
              className="mx-auto max-w-lg text-lg"
              style={{ color: '#7a8fa6', fontFamily: "'Inter', sans-serif" }}
            >
              副标题
            </p>
          </div>

          <button
            onClick={handleStart}
            className="group relative mt-8 cursor-pointer overflow-hidden rounded-full px-16 py-6 text-xl font-bold tracking-wider text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(100,149,237,0.3)]"
            style={{
              background: 'rgba(60, 80, 120, 0.5)',
              border: '1px solid rgba(100, 149, 237, 0.3)',
              fontFamily: "'Inter', 'Noto Sans SC', sans-serif",
              backdropFilter: 'blur(10px)',
            }}
          >
            <span className="relative z-10">按钮</span>
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: 'rgba(80, 110, 160, 0.6)' }}
            />
          </button>

          <p className="mt-6 text-sm" style={{ color: '#333344' }}>
            说明文字
          </p>
        </section>
      )}

      {/* ===== QUIZ SCREEN ===== */}
      {screen === 'quiz' && (
        <section ref={quizRef} className="relative z-20 min-h-screen px-4 py-12">
          {/* Progress bar */}
          <div className="fixed top-0 left-0 z-30 h-1 w-full" style={{ background: '#1a1a2e' }}>
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: '#6495ed',
                boxShadow: '0 0 8px rgba(100,149,237,0.4)',
              }}
            />
          </div>

          {/* Question counter */}
          <div className="mb-8 text-center">
            <p
              className="text-xl tracking-wider"
              style={{ color: '#6495ed', fontFamily: "'Inter', sans-serif" }}
            >
              {currentQuestion + 1} / {QUESTIONS.length}
            </p>
          </div>

          {/* Current question */}
          <div
            className="mx-auto flex max-w-2xl flex-col items-center"
            data-qindex={currentQuestion}
          >
            <h2
              className="mb-12 text-center text-3xl leading-relaxed font-bold md:text-4xl"
              style={{
                fontFamily: "'Inter', 'Noto Sans SC', sans-serif",
                color: '#ffffff',
                letterSpacing: '0.02em',
              }}
            >
              {QUESTIONS[currentQuestion].text}
            </h2>

            {/* Options */}
            <div className="w-full space-y-4">
              {QUESTIONS[currentQuestion].options.map((opt, idx) => (
                <button
                  key={opt.label}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={selectedOption !== null}
                  className="group relative w-full cursor-pointer overflow-hidden rounded-lg border px-8 py-6 text-left transition-all duration-300 disabled:cursor-not-allowed"
                  style={{
                    borderColor: selectedOption === idx ? '#6495ed' : '#2a2a3e',
                    background:
                      selectedOption === idx
                        ? 'rgba(100,149,237,0.08)'
                        : 'rgba(0,0,0,0.3)',
                  }}
                >
                  {selectedOption === idx ? (
                    <DecodingText
                      text={opt.text}
                      trigger={true}
                    />
                  ) : (
                    <span
                      className="text-lg md:text-xl"
                      style={{
                        fontFamily: "'Inter', 'Noto Sans SC', sans-serif",
                        color: '#c8d4e0',
                      }}
                    >
                      {opt.text}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== LOADING SCREEN ===== */}
      {screen === 'loading' && (
        <section className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4">
          <ArmillarySphere size={280} />
          <p
            className="mt-10 text-center text-xl tracking-wider"
            style={{
              fontFamily: "'Courier New', monospace",
              color: '#7a8fa6',
              letterSpacing: '0.15em',
            }}
          >
            加载中...
          </p>
          <div className="mt-6 h-1 w-48 overflow-hidden rounded-full" style={{ background: '#1a1a2e' }}>
            <div
              className="h-full animate-[loading_3s_ease-in-out_infinite]"
              style={{ background: '#6495ed' }}
            />
          </div>
        </section>
      )}

      {/* ===== RESULT SCREEN ===== */}
      {screen === 'result' && result && (
        <ResultScreen result={result} onRestart={handleRestart} />
      )}

      <style>{`
        @keyframes loading {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 100%; margin-left: 0%; }
          100% { width: 0%; margin-left: 100%; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ===== RESULT SCREEN SUB-COMPONENT ===== */
function ResultScreen({
  result,
  onRestart,
}: {
  result: CalculationResult;
  onRestart: () => void;
}) {
  const blessingRace = result.blessing;
  const topRaces = result.sorted.slice(0, 3);

  const getBloodlineDescription = () => {
    switch (result.bloodlineType) {
      case '纯血':
        return `结果描述一`;
      case '双血脉':
        return `结果描述二`;
      case '三血脉':
        return `结果描述三`;
      default:
        return `结果描述四`;
    }
  };

  return (
    <section className="relative z-20 flex min-h-screen flex-col items-center px-4 py-12">
      {/* Result badge */}
      <div
        className="mb-6"
        style={{ animation: 'fadeInUp 1s ease-out' }}
      >
        <ArmillarySphere size={200} />
      </div>

      {/* Title */}
      <h1
        className="mb-2 text-center text-4xl font-bold md:text-5xl"
        style={{
          fontFamily: "'Inter', 'Noto Sans SC', sans-serif",
          color: '#ffffff',
          animation: 'fadeInUp 1s ease-out 0.3s both',
        }}
      >
        结果标题
      </h1>

      <p
        className="mb-8 text-lg tracking-wider"
        style={{
          color: '#6495ed',
          fontFamily: "'Inter', sans-serif",
          animation: 'fadeInUp 1s ease-out 0.5s both',
        }}
      >
        {result.bloodlineType}
      </p>

      {/* Result Card */}
      <div
        className="mx-auto w-full max-w-lg overflow-hidden rounded-xl border p-8"
        style={{
          borderColor: '#2a2a3e',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          animation: 'fadeInUp 1s ease-out 0.7s both',
        }}
      >
        {/* Bloodline races display */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          {result.bloodlineRaces.map((race) => (
            <div
              key={race}
              className="rounded-full px-5 py-2 text-sm font-bold"
              style={{
                background: 'rgba(100,149,237,0.12)',
                border: '1px solid rgba(100,149,237,0.3)',
                color: '#6495ed',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {RACE_DATA[race].name}
            </div>
          ))}
          {result.bloodlineRaces.length === 0 && (
            <div
              className="rounded-full px-5 py-2 text-sm font-bold"
              style={{
                background: 'rgba(156,156,156,0.1)',
                border: '1px solid rgba(156,156,156,0.3)',
                color: '#9c9c9c',
              }}
            >
              混沌未分化
            </div>
          )}
        </div>

        {/* Description */}
        <p
          className="mb-8 text-center leading-relaxed"
          style={{
            color: '#7a8fa6',
            fontFamily: "'Inter', 'Noto Sans SC', sans-serif",
            fontSize: '16px',
          }}
        >
          {getBloodlineDescription()}
        </p>

        {/* Blessing section */}
        {blessingRace && blessingRace !== 'human' && (
          <div
            className="mb-8 rounded-lg border p-5 text-center"
            style={{
              borderColor: 'rgba(100,149,237,0.2)',
              background: 'rgba(100,149,237,0.05)',
            }}
          >
            <p
              className="mb-2 text-sm tracking-wider"
              style={{ color: '#6495ed', fontFamily: "'Inter', sans-serif" }}
            >
              赐福
            </p>
            <p
              className="text-xl font-bold"
              style={{ color: '#6495ed', fontFamily: "'Inter', 'Noto Sans SC', sans-serif" }}
            >
              {RACE_DATA[blessingRace].blessing}
            </p>
          </div>
        )}

        {/* Score breakdown */}
        <div className="space-y-3">
          <p
            className="mb-3 text-center text-sm tracking-wider"
            style={{ color: '#333355', fontFamily: "'Inter', sans-serif" }}
          >
            分数
          </p>
          {topRaces.map((item) => {
            const pct = (item.score / 180) * 100;
            const isTop = result.bloodlineRaces.includes(item.race);
            return (
              <div key={item.race} className="flex items-center gap-3">
                <span
                  className="w-16 text-sm"
                  style={{
                    color: isTop ? '#6495ed' : '#7a8fa6',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {RACE_DATA[item.race].name}
                </span>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full" style={{ background: '#1a1a2e' }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${pct}%`,
                      background: isTop
                        ? 'linear-gradient(90deg, #6495ed, #7aa8f0)'
                        : 'linear-gradient(90deg, #2a2a3e, #3a3a4e)',
                      boxShadow: isTop ? '0 0 6px rgba(100,149,237,0.3)' : 'none',
                    }}
                  />
                </div>
                <span
                  className="w-12 text-right text-sm tabular-nums"
                  style={{ color: isTop ? '#6495ed' : '#7a8fa6' }}
                >
                  {item.score}
                </span>
              </div>
            );
          })}
        </div>

        {/* Ekura info */}
        {result.bloodlineRaces.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: '#333355' }}>
              伊库拉:
              <span className="ml-2" style={{ color: '#6495ed' }}>
                {result.bloodlineRaces
                  .filter((r) => r !== 'human')
                  .map((r) => RACE_DATA[r].ekura)
                  .join(' / ') || '无'}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Restart button */}
      <button
        onClick={onRestart}
        className="group relative mt-10 cursor-pointer overflow-hidden rounded-full px-12 py-4 text-lg font-bold tracking-wider text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(100,149,237,0.3)]"
        style={{
          background: 'rgba(60, 80, 120, 0.5)',
          border: '1px solid rgba(100, 149, 237, 0.3)',
          fontFamily: "'Inter', 'Noto Sans SC', sans-serif",
          backdropFilter: 'blur(10px)',
          animation: 'fadeInUp 1s ease-out 1.2s both',
        }}
      >
        <span className="relative z-10">再次测试</span>
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: 'rgba(80, 110, 160, 0.6)' }}
        />
      </button>
    </section>
  );
}
