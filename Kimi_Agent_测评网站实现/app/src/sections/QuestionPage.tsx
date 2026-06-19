import { useState, useEffect, useCallback } from 'react';
import { questions } from '../data/questions';

interface QuestionPageProps {
  onComplete: (answers: number[]) => void;
}

export default function QuestionPage({ onComplete }: QuestionPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [visible, setVisible] = useState(true);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / totalQuestions) * 100;

  const handleSelect = useCallback((optionIndex: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(optionIndex);

    // 短暂延迟后切换
    setTimeout(() => {
      setVisible(false);

      setTimeout(() => {
        const newAnswers = [...answers, optionIndex];
        setAnswers(newAnswers);
        setSelectedOption(null);

        if (currentIndex < totalQuestions - 1) {
          setCurrentIndex(currentIndex + 1);
          setVisible(true);
        } else {
          onComplete(newAnswers);
        }
      }, 400);
    }, 300);
  }, [selectedOption, answers, currentIndex, totalQuestions, onComplete]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedOption !== null) return;
      if (e.key >= '1' && e.key <= '4') {
        const idx = parseInt(e.key) - 1;
        if (idx < currentQuestion.options.length) {
          handleSelect(idx);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, currentQuestion, handleSelect]);

  if (!currentQuestion) return null;

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      {/* 进度条 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'rgba(255, 255, 255, 0.05)',
          zIndex: 10,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, rgba(196, 163, 90, 0.6), #c4a35a)',
            transition: 'width 0.4s ease-out',
            boxShadow: '0 0 10px rgba(196, 163, 90, 0.3)',
          }}
        />
      </div>

      {/* 题号指示 */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          fontSize: '0.9rem',
          fontWeight: 300,
          color: 'rgba(160, 160, 184, 0.6)',
          letterSpacing: '0.1em',
          zIndex: 10,
        }}
      >
        {currentIndex + 1} / {totalQuestions}
      </div>

      {/* 题目卡片 */}
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
        }}
      >
        {/* 题目文本 */}
        <h2
          style={{
            fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
            fontWeight: 400,
            color: '#e8e8f0',
            textAlign: 'center',
            marginBottom: '48px',
            lineHeight: 1.6,
            letterSpacing: '0.02em',
          }}
        >
          {currentQuestion.text}
        </h2>

        {/* 选项列表 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {currentQuestion.options.map((option, index) => {
            const isHovered = hoveredOption === index;
            const isSelected = selectedOption === index;

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => setHoveredOption(index)}
                onMouseLeave={() => setHoveredOption(null)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '20px 24px',
                  textAlign: 'left',
                  fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)',
                  fontWeight: 300,
                  color: '#e8e8f0',
                  background: isSelected
                    ? 'rgba(196, 163, 90, 0.15)'
                    : isHovered
                      ? 'rgba(20, 24, 60, 0.85)'
                      : 'rgba(20, 24, 60, 0.6)',
                  border: `1px solid ${isSelected
                    ? 'rgba(196, 163, 90, 0.5)'
                    : isHovered
                      ? 'rgba(196, 163, 90, 0.3)'
                      : 'rgba(255, 255, 255, 0.08)'
                    }`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  lineHeight: 1.6,
                  transition: 'all 0.25s ease',
                  backdropFilter: 'blur(10px)',
                  transform: isSelected
                    ? 'scale(0.98)'
                    : isHovered
                      ? 'translateY(-2px)'
                      : 'translateY(0)',
                  boxShadow: isSelected
                    ? '0 0 20px rgba(196, 163, 90, 0.15), inset 0 0 20px rgba(196, 163, 90, 0.05)'
                    : isHovered
                      ? '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(196, 163, 90, 0.1)'
                      : '0 2px 10px rgba(0, 0, 0, 0.2)',
                  letterSpacing: '0.01em',
                }}
              >
                {option.text}
              </button>
            );
          })}
        </div>

        {/* 键盘提示 */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '32px',
            fontSize: '0.75rem',
            fontWeight: 300,
            color: 'rgba(160, 160, 184, 0.35)',
            letterSpacing: '0.05em',
          }}
        >
          按 1-4 键快速选择
        </p>
      </div>
    </div>
  );
}
