import React, { useEffect, useRef } from 'react';

export const CursorLight: React.FC = () => {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight * 0.35;
    let targetX = currentX;
    let targetY = currentY;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
      }
    };

    const animate = () => {
      // Fluid physics damping for responsive, smooth cursor follow
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;

      if (lightRef.current) {
        lightRef.current.style.transform = `translate3d(${currentX - 250}px, ${currentY - 250}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {/* Exactly ONE clean, warm yellow ambient light that follows the cursor */}
      <div
        ref={lightRef}
        className="w-[500px] h-[500px] rounded-full blur-[85px] mix-blend-screen pointer-events-none opacity-80 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(circle, rgba(245, 190, 35, 0.45) 0%, rgba(234, 179, 8, 0.24) 32%, rgba(202, 138, 4, 0.08) 58%, transparent 75%)',
          willChange: 'transform',
        }}
      />
    </div>
  );
};
