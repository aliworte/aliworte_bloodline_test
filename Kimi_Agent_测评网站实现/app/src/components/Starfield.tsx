import { useRef, useEffect } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  layer: number;
  twinkleOffset: number;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  angle: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  opacity: number;
  breathOffset: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.scale(dpr, dpr);
    }

    resize();

    // 星星配置
    const isMobile = width <= 768;
    const starCounts = isMobile
      ? { far: 150, mid: 80, near: 30 }
      : { far: 250, mid: 120, near: 50 };

    const stars: Star[] = [];
    const meteors: Meteor[] = [];
    const nebulae: Nebula[] = [];

    // 初始化星星 - 3层视差
    function createStars() {
      stars.length = 0;

      // 远层 - 小星星，移动极慢，密度高
      for (let i = 0; i < starCounts.far; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1 + 0.3,
          opacity: Math.random() * 0.5 + 0.2,
          speed: 0.05,
          layer: 0,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }

      // 中层 - 中等星星，移动中等速度，密度中等
      for (let i = 0; i < starCounts.mid; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.8,
          opacity: Math.random() * 0.6 + 0.3,
          speed: 0.15,
          layer: 1,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }

      // 近层 - 大星星+星座连线，移动较快，密度低
      for (let i = 0; i < starCounts.near; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 1.2,
          opacity: Math.random() * 0.7 + 0.4,
          speed: 0.3,
          layer: 2,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    // 初始化星云
    function createNebulae() {
      nebulae.length = 0;
      const colors = [
        'rgba(139, 109, 177, 0.08)',
        'rgba(107, 155, 209, 0.08)',
        'rgba(209, 140, 140, 0.06)',
        'rgba(139, 109, 177, 0.06)',
        'rgba(107, 155, 209, 0.06)',
      ];

      for (let i = 0; i < 5; i++) {
        nebulae.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 200 + 150,
          color: colors[i % colors.length],
          opacity: 1,
          breathOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    createStars();
    createNebulae();

    let time = 0;
    let lastMeteorTime = 0;

    function draw() {
      if (!ctx) return;
      time += 0.016;

      // 清空画布
      ctx.clearRect(0, 0, width, height);

      // 背景渐变
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#0a0e27');
      bgGradient.addColorStop(0.5, '#0d1135');
      bgGradient.addColorStop(1, '#0a0e27');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // 鼠标偏移（视差）
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const mouseOffsetX = (mouseX - width / 2) / width;
      const mouseOffsetY = (mouseY - height / 2) / height;

      // 绘制星云
      nebulae.forEach((nebula) => {
        const breathScale = 0.95 + 0.1 * Math.sin(time * 0.5 + nebula.breathOffset);
        const gradient = ctx.createRadialGradient(
          nebula.x + mouseOffsetX * 10 * (nebula.radius / 200),
          nebula.y + mouseOffsetY * 10 * (nebula.radius / 200),
          0,
          nebula.x + mouseOffsetX * 10 * (nebula.radius / 200),
          nebula.y + mouseOffsetY * 10 * (nebula.radius / 200),
          nebula.radius * breathScale
        );
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });

      // 绘制星星
      stars.forEach((star) => {
        const layerMultiplier = star.layer === 0 ? 0.3 : star.layer === 1 ? 0.6 : 1;
        const offsetX = mouseOffsetX * 20 * layerMultiplier;
        const offsetY = mouseOffsetY * 20 * layerMultiplier;

        let x = star.x + offsetX;
        let y = star.y + offsetY;

        // 缓慢移动
        x += Math.sin(time * star.speed + star.twinkleOffset) * 0.3;

        // 闪烁
        const twinkle = 0.7 + 0.3 * Math.sin(time * 2 + star.twinkleOffset);
        const alpha = star.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);

        // 星星颜色
        const colors = ['#ffffff', '#ffe9c4', '#c4dfff'];
        const colorIdx = Math.floor(star.twinkleOffset % colors.length);
        ctx.fillStyle = colors[colorIdx];
        ctx.globalAlpha = alpha;
        ctx.fill();

        // 大星星发光
        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(x, y, star.size * 3, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(x, y, 0, x, y, star.size * 3);
          glow.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.3})`);
          glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = glow;
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      });

      // 绘制星座连线（近层星星之间）
      const nearStars = stars.filter(s => s.layer === 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < nearStars.length; i += 3) {
        const s1 = nearStars[i];
        const s2 = nearStars[(i + 1) % nearStars.length];
        if (!s1 || !s2) continue;

        const x1 = s1.x + mouseOffsetX * 20 + Math.sin(time * s1.speed + s1.twinkleOffset) * 0.3;
        const y1 = s1.y + mouseOffsetY * 20;
        const x2 = s2.x + mouseOffsetX * 20 + Math.sin(time * s2.speed + s2.twinkleOffset) * 0.3;
        const y2 = s2.y + mouseOffsetY * 20;

        const dist = Math.hypot(x2 - x1, y2 - y1);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      // 流星
      if (time - lastMeteorTime > Math.random() * 5 + 3) {
        meteors.push({
          x: Math.random() * width * 0.5,
          y: Math.random() * height * 0.3,
          length: Math.random() * 80 + 60,
          speed: Math.random() * 3 + 4,
          opacity: 1,
          angle: Math.PI / 4 + Math.random() * 0.2 - 0.1,
        });
        lastMeteorTime = time;
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const meteor = meteors[i];
        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;
        meteor.opacity -= 0.008;

        if (meteor.opacity <= 0 || meteor.x > width || meteor.y > height) {
          meteors.splice(i, 1);
          continue;
        }

        const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
        const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;

        const gradient = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`);
        gradient.addColorStop(0.5, `rgba(196, 220, 255, ${meteor.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        // 头部亮点
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${meteor.opacity})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    }

    draw();

    // 鼠标移动事件
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // 触摸事件（移动端）
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', () => {
      resize();
      createStars();
      createNebulae();
    });

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}
