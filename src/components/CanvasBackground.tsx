import React, { useEffect, useRef } from 'react';

export const CanvasBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Setup static blueprint elements once to make it highly performant
    const dots: { x: number; y: number }[] = [];
    const gridSpacing = 36;
    
    const initGrid = () => {
      dots.length = 0;
      for (let x = 18; x < width; x += gridSpacing) {
        for (let y = 18; y < height; y += gridSpacing) {
          dots.push({ x, y });
        }
      }
    };

    initGrid();

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initGrid();
    };
    window.addEventListener('resize', handleResize);



    // Blueprint notations
    const crosshairs = [
      { x: 80, y: 180 },
      { x: width - 120, y: 480 },
      { x: width * 0.5, y: 520 }
    ];

    let time = 0;

    const draw = () => {
      time += 0.002; // Very slow speed increment
      ctx.clearRect(0, 0, width, height);

      // Re-fetch traces relative to current width to keep responsive
      const responsiveTraces = [
        [
          { x: 40, y: 120 },
          { x: 180, y: 120 },
          { x: 230, y: 170 },
          { x: 230, y: 280 },
          { x: 280, y: 330 }
        ],
        [
          { x: 80, y: height - 120 },
          { x: 200, y: height - 240 },
          { x: 320, y: height - 240 }
        ],
        [
          { x: width - 40, y: 100 },
          { x: width - 160, y: 100 },
          { x: width - 220, y: 160 },
          { x: width - 220, y: 320 }
        ],
        [
          { x: width * 0.4, y: 60 },
          { x: width * 0.5, y: 60 },
          { x: width * 0.56, y: 120 }
        ]
      ];

      // 1. Draw Dotted Grid
      ctx.fillStyle = 'rgba(26, 115, 232, 0.04)';
      dots.forEach(dot => {
        // Slow gentle breathing fade effect on grid dots
        const opacityModifier = Math.sin(time * 3 + (dot.x + dot.y) * 0.002) * 0.015 + 0.035;
        ctx.fillStyle = `rgba(26, 115, 232, ${opacityModifier})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Hexagonal Clusters
      const drawHex = (cx: number, cy: number, r: number) => {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      };

      ctx.strokeStyle = 'rgba(26, 115, 232, 0.02)';
      ctx.lineWidth = 1;
      
      // Floating hex clusters
      const hexPulse = Math.sin(time) * 4;
      if (width > 768) {
        drawHex(140, 240, 30 + hexPulse);
        drawHex(140 + 52, 240, 30 + hexPulse);
        drawHex(width - 150, height - 180, 40 - hexPulse);
      }

      // 3. Draw Thin PCB Trace Lines
      ctx.strokeStyle = 'rgba(26, 115, 232, 0.05)';
      ctx.lineWidth = 1;
      
      responsiveTraces.forEach(path => {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();

        // Draw terminal circles at endpoints
        const endNode = path[path.length - 1];
        ctx.beginPath();
        ctx.arc(endNode.x, endNode.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = 'rgba(26, 115, 232, 0.2)';
        ctx.stroke();

        // Small pulsing terminal node
        const pulse = Math.abs(Math.sin(time * 5 + endNode.x)) * 3;
        ctx.beginPath();
        ctx.arc(endNode.x, endNode.y, pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(26, 115, 232, 0.07)';
        ctx.fill();
      });

      // 4. Blueprint Technical Notations
      ctx.strokeStyle = 'rgba(26, 115, 232, 0.04)';
      ctx.fillStyle = 'rgba(26, 115, 232, 0.12)';
      ctx.font = '8px monospace';
      
      crosshairs.forEach(ch => {
        // Draw little coordinate '+' crosshair
        ctx.beginPath();
        ctx.moveTo(ch.x - 6, ch.y);
        ctx.lineTo(ch.x + 6, ch.y);
        ctx.moveTo(ch.x, ch.y - 6);
        ctx.lineTo(ch.x, ch.y + 6);
        ctx.stroke();

        // Draw coordinate labels next to them
        ctx.fillText(`X:${Math.round(ch.x)} Y:${Math.round(ch.y)}`, ch.x + 10, ch.y + 3);
      });

      // Technical text details
      if (width > 900) {
        ctx.fillText('REF_SYS_GRID: 36MM', 40, height - 30);
        ctx.fillText('SCALE: 1.00_AUTO_SCALE', 40, height - 18);
        ctx.fillText('MCU_ESP32_S3_GPIO_TRACE: CONFIRMED', width - 220, height - 30);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
};
