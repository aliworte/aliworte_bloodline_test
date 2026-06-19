import { useState, useEffect } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [visible, setVisible] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

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
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
    >
      {/* 主标题 */}
      <h1
        style={{
          fontSize: 'clamp(1.8rem, 5vw, 3rem)',
          fontWeight: 400,
          color: '#e8e8f0',
          textAlign: 'center',
          marginBottom: '16px',
          letterSpacing: '0.05em',
          lineHeight: 1.4,
          textShadow: '0 0 30px rgba(196, 163, 90, 0.2)',
        }}
      >
        你在另一个世界，长什么样？
      </h1>

      {/* 副标题 */}
      <p
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
          fontWeight: 300,
          color: '#c4a35a',
          textAlign: 'center',
          marginBottom: '48px',
          letterSpacing: '0.15em',
        }}
      >
        艾利沃特血脉测试
      </p>

      {/* 装饰线 */}
      <div
        style={{
          width: '60px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(196, 163, 90, 0.6), transparent)',
          marginBottom: '48px',
        }}
      />

      {/* 开始按钮 */}
      <button
        onClick={onStart}
        onMouseEnter={() => setButtonHover(true)}
        onMouseLeave={() => setButtonHover(false)}
        style={{
          padding: '14px 56px',
          fontSize: '1.1rem',
          fontWeight: 400,
          color: '#e8e8f0',
          background: buttonHover
            ? 'rgba(196, 163, 90, 0.2)'
            : 'rgba(20, 24, 60, 0.6)',
          border: `1px solid ${buttonHover ? 'rgba(196, 163, 90, 0.6)' : 'rgba(255, 255, 255, 0.15)'}`,
          borderRadius: '4px',
          cursor: 'pointer',
          letterSpacing: '0.1em',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          boxShadow: buttonHover
            ? '0 0 30px rgba(196, 163, 90, 0.15), inset 0 0 20px rgba(196, 163, 90, 0.05)'
            : '0 4px 20px rgba(0, 0, 0, 0.3)',
          transform: buttonHover ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        开始测试
      </button>

      {/* 底部小字 */}
      <p
        style={{
          position: 'absolute',
          bottom: '40px',
          fontSize: '0.85rem',
          fontWeight: 300,
          color: 'rgba(160, 160, 184, 0.6)',
          textAlign: 'center',
          letterSpacing: '0.05em',
        }}
      >
        共18题，约需3-5分钟
      </p>
    </div>
  );
}
