import { useState, useEffect } from 'react';

interface LoadingPageProps {
  onComplete: () => void;
}

const loadingTexts = [
  '正在读取星轨...',
  '解析血脉印记...',
  '追溯古老契约...',
  '唤醒沉睡记忆...',
  '编织命运丝线...',
];

export default function LoadingPage({ onComplete }: LoadingPageProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dots, setDots] = useState('');

  useEffect(() => {
    // 文字轮播
    const textInterval = setInterval(() => {
      setTextIndex(prev => {
        if (prev >= loadingTexts.length - 1) return prev;
        return prev + 1;
      });
    }, 350);

    // 跳点动画
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 400);

    // 1.8秒后完成
    const completeTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 400);
    }, 1800);

    return () => {
      clearInterval(textInterval);
      clearInterval(dotsInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

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
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease-out',
      }}
    >
      {/* 旋转光点 */}
      <div
        style={{
          width: '60px',
          height: '60px',
          marginBottom: '40px',
          position: 'relative',
        }}
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'rgba(196, 163, 90, 0.8)',
              boxShadow: '0 0 10px rgba(196, 163, 90, 0.5)',
              top: '50%',
              left: '50%',
              marginTop: '-4px',
              marginLeft: '-4px',
              animation: `loadingOrbit 1.5s linear infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* 加载文字 */}
      <p
        style={{
          fontSize: '1.1rem',
          fontWeight: 300,
          color: '#a0a0b8',
          letterSpacing: '0.1em',
          minHeight: '1.6em',
        }}
      >
        {loadingTexts[textIndex]}{dots}
      </p>

      {/* CSS动画 */}
      <style>{`
        @keyframes loadingOrbit {
          0% {
            transform: rotate(0deg) translateX(25px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(25px) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
}
