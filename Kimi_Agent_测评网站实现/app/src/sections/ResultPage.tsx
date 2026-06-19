import { useState, useEffect } from 'react';
import type { QuizResult } from '../data/quizUtils';
import { generateShareText, RACE_COLORS } from '../data/quizUtils';
import { RACE_NAMES } from '../data/questions';

interface ResultPageProps {
  result: QuizResult;
  onRestart: () => void;
}

export default function ResultPage({ result, onRestart }: ResultPageProps) {
  const [visible, setVisible] = useState(false);
  const [chartAnimated, setChartAnimated] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [descVisible, setDescVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    const chartTimer = setTimeout(() => setChartAnimated(true), 500);
    const descTimer = setTimeout(() => setDescVisible(true), 800);
    return () => {
      clearTimeout(timer);
      clearTimeout(chartTimer);
      clearTimeout(descTimer);
    };
  }, []);

  const handleShare = async () => {
    const text = generateShareText(result);
    try {
      await navigator.clipboard.writeText(text);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    } catch {
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    }
  };

  const maxScore = Math.max(...result.sorted.map(s => s.score));

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '40px 20px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.95)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
      }}
    >
      {/* 结果卡片 */}
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
        }}
      >
        {/* 血统类型标签 */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '4px 16px',
              fontSize: '0.85rem',
              fontWeight: 400,
              color: '#c4a35a',
              border: '1px solid rgba(196, 163, 90, 0.3)',
              borderRadius: '20px',
              letterSpacing: '0.1em',
              background: 'rgba(196, 163, 90, 0.08)',
            }}
          >
            {result.bloodlineType}
          </span>
        </div>

        {/* 结果标题 */}
        <h1
          style={{
            fontSize: 'clamp(1.4rem, 4vw, 2rem)',
            fontWeight: 400,
            color: '#e8e8f0',
            textAlign: 'center',
            marginBottom: '8px',
            lineHeight: 1.4,
            letterSpacing: '0.03em',
          }}
        >
          {result.resultTitle}
        </h1>

        {/* 副标题 */}
        <p
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            fontWeight: 300,
            color: '#c4a35a',
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          {result.resultSubtitle}
        </p>

        {/* 结果描述 */}
        <div
          style={{
            background: 'rgba(20, 24, 60, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '40px',
            backdropFilter: 'blur(10px)',
            opacity: descVisible ? 1 : 0,
            transition: 'opacity 0.6s ease-out',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
              fontWeight: 300,
              color: '#d0d0e0',
              lineHeight: 1.8,
              letterSpacing: '0.01em',
            }}
          >
            {result.resultText}
          </p>
        </div>

        {/* 柱状图 */}
        <div
          style={{
            marginBottom: '32px',
          }}
        >
          <h3
            style={{
              fontSize: '0.9rem',
              fontWeight: 400,
              color: 'rgba(160, 160, 184, 0.7)',
              marginBottom: '20px',
              letterSpacing: '0.1em',
            }}
          >
            血脉分布
          </h3>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              height: '180px',
              padding: '0 8px',
              gap: '8px',
            }}
          >
            {result.sorted.map((item, index) => {
              const isHighlighted =
                result.bloodlineType !== '混沌未分化' &&
                result.bloodlineRaces.includes(item.race);
              const barHeight = maxScore > 0
                ? (item.score / maxScore) * 140
                : 0;

              return (
                <div
                  key={item.race}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    maxWidth: '80px',
                  }}
                >
                  {/* 分数 */}
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 400,
                      color: isHighlighted ? '#c4a35a' : 'rgba(160, 160, 184, 0.5)',
                      marginBottom: '6px',
                      opacity: chartAnimated ? 1 : 0,
                      transition: `opacity 0.3s ease-out ${index * 0.1}s`,
                    }}
                  >
                    {item.score}
                  </span>

                  {/* 柱子 */}
                  <div
                    style={{
                      width: '100%',
                      height: `${chartAnimated ? barHeight : 0}px`,
                      background: isHighlighted
                        ? `linear-gradient(180deg, ${RACE_COLORS[item.race]}, ${RACE_COLORS[item.race]}88)`
                        : `linear-gradient(180deg, ${RACE_COLORS[item.race]}66, ${RACE_COLORS[item.race]}22)`,
                      borderRadius: '4px 4px 0 0',
                      transition: `height 0.8s ease-out ${index * 0.1}s`,
                      position: 'relative',
                      boxShadow: isHighlighted
                        ? `0 0 12px ${RACE_COLORS[item.race]}44`
                        : 'none',
                    }}
                  >
                    {isHighlighted && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#c4a35a',
                          boxShadow: '0 0 8px rgba(196, 163, 90, 0.6)',
                        }}
                      />
                    )}
                  </div>

                  {/* 种族名 */}
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 300,
                      color: isHighlighted
                        ? '#e8e8f0'
                        : 'rgba(160, 160, 184, 0.5)',
                      marginTop: '8px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {RACE_NAMES[item.race]?.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 详细数据展开 */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => setShowDetail(!showDetail)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '12px',
              fontSize: '0.85rem',
              fontWeight: 300,
              color: 'rgba(160, 160, 184, 0.6)',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '0.05em',
            }}
          >
            {showDetail ? '收起详细数据' : '查看详细数据'}
            <span style={{ marginLeft: '8px', transform: showDetail ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
              ▼
            </span>
          </button>

          {showDetail && (
            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                background: 'rgba(20, 24, 60, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '8px',
              }}
            >
              {result.sorted.map((item) => {
                const percentage = ((item.score / 270) * 100).toFixed(1);
                return (
                  <div
                    key={item.race}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: RACE_COLORS[item.race],
                        }}
                      />
                      <span style={{ fontSize: '0.85rem', color: '#a0a0b8' }}>
                        {RACE_NAMES[item.race]?.name}（{RACE_NAMES[item.race]?.display}）
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(160, 160, 184, 0.4)' }}>
                        {percentage}%
                      </span>
                      <span style={{ fontSize: '0.9rem', color: '#e8e8f0', minWidth: '36px', textAlign: 'right' }}>
                        {item.score}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 按钮组 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <button
            onClick={handleShare}
            style={{
              padding: '12px 48px',
              fontSize: '1rem',
              fontWeight: 400,
              color: '#e8e8f0',
              background: 'rgba(20, 24, 60, 0.6)',
              border: '1px solid rgba(196, 163, 90, 0.3)',
              borderRadius: '6px',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              transition: 'all 0.25s ease',
              backdropFilter: 'blur(10px)',
              width: '100%',
              maxWidth: '280px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(196, 163, 90, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(196, 163, 90, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(20, 24, 60, 0.6)';
              e.currentTarget.style.borderColor = 'rgba(196, 163, 90, 0.3)';
            }}
          >
            分享结果
          </button>

          <button
            onClick={onRestart}
            style={{
              padding: '12px 48px',
              fontSize: '1rem',
              fontWeight: 400,
              color: '#a0a0b8',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              transition: 'all 0.25s ease',
              width: '100%',
              maxWidth: '280px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#e8e8f0';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#a0a0b8';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            重新测试
          </button>

          <p
            style={{
              fontSize: '0.8rem',
              fontWeight: 300,
              color: 'rgba(160, 160, 184, 0.35)',
              marginTop: '16px',
              letterSpacing: '0.05em',
            }}
          >
            了解更多艾利沃特的世界 →
          </p>
        </div>
      </div>

      {/* Toast */}
      <div
        style={{
          position: 'fixed',
          bottom: '40px',
          left: '50%',
          transform: `translateX(-50%) translateY(${toastVisible ? 0 : '20px'})`,
          padding: '12px 24px',
          fontSize: '0.9rem',
          fontWeight: 300,
          color: '#e8e8f0',
          background: 'rgba(20, 24, 60, 0.9)',
          border: '1px solid rgba(196, 163, 90, 0.3)',
          borderRadius: '8px',
          opacity: toastVisible ? 1 : 0,
          transition: 'all 0.3s ease',
          pointerEvents: 'none',
          zIndex: 100,
          backdropFilter: 'blur(10px)',
        }}
      >
        已复制到剪贴板
      </div>
    </div>
  );
}
