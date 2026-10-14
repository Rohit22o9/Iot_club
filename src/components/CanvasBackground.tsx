import React, { useEffect, useRef } from 'react';

interface CanvasBackgroundProps {
  mousePos?: { x: number; y: number };
}

export const CanvasBackground: React.FC<CanvasBackgroundProps> = ({ mousePos }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Update target coordinates when mouse moves
  useEffect(() => {
    if (mousePos) {
      mouseRef.current.targetX = mousePos.x;
      mouseRef.current.targetY = mousePos.y;
    }
  }, [mousePos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse movement internally as fallback
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!mousePos) {
        const x = (e.clientX - window.innerWidth / 2) * 0.04;
        const y = (e.clientY - window.innerHeight / 2) * 0.04;
        mouseRef.current.targetX = x;
        mouseRef.current.targetY = y;
      }
    };
    window.addEventListener('mousemove', handleWindowMouseMove);

    let time = 0;

    const draw = () => {
      time += 0.0035;

      // Smooth mouse interpolation (inertia)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, width, height);

      // --- 1. Brushed Metal Hairline Grain ---
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.045)';
      ctx.lineWidth = 1;
      const grainStep = 8;
      for (let y = 0; y < height; y += grainStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // --- 2. Symmetrical Architectural Circuit Etchings (Left & Right Flanks) ---
      // Left Peripheral Bus (anchored to left, stopping before center column)
      const leftBusTraces = [
        [
          { x: 30 + mx * 0.3, y: 80 + my * 0.3 },
          { x: Math.min(160, width * 0.16) + mx * 0.3, y: 80 + my * 0.3 },
          { x: Math.min(220, width * 0.22) + mx * 0.3, y: 140 + my * 0.3 },
          { x: Math.min(220, width * 0.22) + mx * 0.3, y: 260 + my * 0.3 }
        ],
        [
          { x: 30 + mx * 0.4, y: 140 + my * 0.4 },
          { x: Math.min(120, width * 0.12) + mx * 0.4, y: 140 + my * 0.4 },
          { x: Math.min(170, width * 0.17) + mx * 0.4, y: 190 + my * 0.4 },
          { x: Math.min(170, width * 0.17) + mx * 0.4, y: 380 + my * 0.4 },
          { x: Math.min(210, width * 0.21) + mx * 0.4, y: 420 + my * 0.4 }
        ],
        [
          { x: 40 + mx * 0.5, y: height - 160 + my * 0.5 },
          { x: Math.min(150, width * 0.15) + mx * 0.5, y: height - 160 + my * 0.5 },
          { x: Math.min(200, width * 0.2) + mx * 0.5, y: height - 110 + my * 0.5 },
          { x: Math.min(260, width * 0.25) + mx * 0.5, y: height - 110 + my * 0.5 }
        ]
      ];

      // Right Peripheral Bus (anchored to right, stopping before center column)
      const rightBusTraces = [
        [
          { x: width - 30 - mx * 0.3, y: 90 + my * 0.3 },
          { x: Math.max(width - 150, width * 0.85) - mx * 0.3, y: 90 + my * 0.3 },
          { x: Math.max(width - 210, width * 0.79) - mx * 0.3, y: 150 + my * 0.3 },
          { x: Math.max(width - 210, width * 0.79) - mx * 0.3, y: 280 + my * 0.3 }
        ],
        [
          { x: width - 30 - mx * 0.4, y: 150 + my * 0.4 },
          { x: Math.max(width - 120, width * 0.88) - mx * 0.4, y: 150 + my * 0.4 },
          { x: Math.max(width - 170, width * 0.83) - mx * 0.4, y: 200 + my * 0.4 },
          { x: Math.max(width - 170, width * 0.83) - mx * 0.4, y: 390 + my * 0.4 },
          { x: Math.max(width - 220, width * 0.78) - mx * 0.4, y: 440 + my * 0.4 }
        ],
        [
          { x: width - 40 - mx * 0.5, y: height - 170 + my * 0.5 },
          { x: Math.max(width - 140, width * 0.86) - mx * 0.5, y: height - 170 + my * 0.5 },
          { x: Math.max(width - 200, width * 0.8) - mx * 0.5, y: height - 110 + my * 0.5 },
          { x: Math.max(width - 270, width * 0.74) - mx * 0.5, y: height - 110 + my * 0.5 }
        ]
      ];

      const allTraces = [...leftBusTraces, ...rightBusTraces];

      // Render circuit traces with fine conductive ink styling
      allTraces.forEach((path, pathIdx) => {
        if (path.length < 2) return;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }

        // Trace line appearance (subtle slate/cobalt etching)
        ctx.strokeStyle = pathIdx % 2 === 0 ? 'rgba(37, 99, 235, 0.08)' : 'rgba(71, 85, 105, 0.09)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Calculate lengths for packet animation
        let totalLen = 0;
        const segLens: number[] = [];
        for (let i = 0; i < path.length - 1; i++) {
          const dx = path[i + 1].x - path[i].x;
          const dy = path[i + 1].y - path[i].y;
          const len = Math.sqrt(dx * dx + dy * dy);
          segLens.push(len);
          totalLen += len;
        }

        // Faint glowing packet gliding along peripheral trace
        if (totalLen > 0) {
          const speed = 0.09 + (pathIdx % 3) * 0.03;
          const progress = (time * speed + pathIdx * 0.3) % 1;
          let targetDist = progress * totalLen;
          let packetPos = { x: path[0].x, y: path[0].y };

          for (let i = 0; i < segLens.length; i++) {
            if (targetDist <= segLens[i]) {
              const r = targetDist / segLens[i];
              packetPos = {
                x: path[i].x + (path[i + 1].x - path[i].x) * r,
                y: path[i].y + (path[i + 1].y - path[i].y) * r
              };
              break;
            }
            targetDist -= segLens[i];
          }

          // Subtle packet glow
          ctx.beginPath();
          ctx.arc(packetPos.x, packetPos.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = pathIdx % 2 === 0 ? 'rgba(37, 99, 235, 0.45)' : 'rgba(5, 150, 105, 0.45)';
          ctx.shadowBlur = 4;
          ctx.shadowColor = pathIdx % 2 === 0 ? '#2563eb' : '#059669';
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Terminal Via / Test Pad at end
        const endPt = path[path.length - 1];
        ctx.beginPath();
        ctx.arc(endPt.x, endPt.y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Start Node Pad
        const startPt = path[0];
        ctx.beginPath();
        ctx.arc(startPt.x, startPt.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(217, 119, 6, 0.3)'; // Gold via accent
        ctx.fill();

        ctx.restore();
      });

      // --- 3. Precision Technical Markings & Registration Crosshairs ---
      ctx.save();
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(100, 116, 139, 0.35)';
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.25)';
      ctx.lineWidth = 1;

      // Top-left precision crosshair
      const ch1 = { x: 45 + mx * 0.2, y: 55 + my * 0.2 };
      ctx.beginPath();
      ctx.moveTo(ch1.x - 6, ch1.y);
      ctx.lineTo(ch1.x + 6, ch1.y);
      ctx.moveTo(ch1.x, ch1.y - 6);
      ctx.lineTo(ch1.x, ch1.y + 6);
      ctx.stroke();
      if (width > 800) {
        ctx.fillText('REF: HARDWARE_BUS_01', ch1.x + 10, ch1.y + 3);
      }

      // Top-right precision crosshair
      const ch2 = { x: width - 55 - mx * 0.2, y: 55 + my * 0.2 };
      ctx.beginPath();
      ctx.moveTo(ch2.x - 6, ch2.y);
      ctx.lineTo(ch2.x + 6, ch2.y);
      ctx.moveTo(ch2.x, ch2.y - 6);
      ctx.lineTo(ch2.x, ch2.y + 6);
      ctx.stroke();
      if (width > 800) {
        ctx.fillText('ENIG_GOLD_TRACE_V2', ch2.x - 120, ch2.y + 3);
      }

      // Bottom status indicators
      if (width > 920) {
        ctx.fillText('MCU_TELEMETRY: ACTIVE // 2.4GHZ MESH', 45, height - 24);
        ctx.fillText('IOT_PLATFORM_SPEC: RFC-8428', width - 200, height - 24);
      }
      ctx.restore();

      // --- 4. Central Radial Clearance Mask ---
      // Seamlessly softens any etchings near center to keep centered typography razor sharp
      ctx.save();
      const maskGradient = ctx.createRadialGradient(
        width / 2, height / 2, Math.min(width, height) * 0.15,
        width / 2, height / 2, Math.min(width, height) * 0.55
      );
      maskGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      maskGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = maskGradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

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
