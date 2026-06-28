'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  stream: MediaStream | null;
  isRecording: boolean;
  isPaused?: boolean;
  variant?: 'bars' | 'waveform' | 'circle';
  barCount?: number;
  className?: string;
  color?: string;
}

export function AudioVisualizer({
  stream,
  isRecording,
  isPaused = false,
  variant = 'bars',
  barCount = 32,
  className = '',
  color = '#ef4444', // red-500
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const [levels, setLevels] = useState<number[]>(new Array(barCount).fill(0));

  useEffect(() => {
    if (!stream || !isRecording) {
      // Reset levels when not recording
      setLevels(new Array(barCount).fill(0));
      return;
    }

    const audioContext = new AudioContext();
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    analyzer.smoothingTimeConstant = 0.7;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyzer);

    analyzerRef.current = analyzer;
    dataArrayRef.current = new Uint8Array(analyzer.frequencyBinCount);

    const animate = () => {
      if (!analyzerRef.current || !dataArrayRef.current || isPaused) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      analyzerRef.current.getByteFrequencyData(dataArrayRef.current);

      // Sample frequencies for visualization
      const step = Math.floor(dataArrayRef.current.length / barCount);
      const newLevels = [];
      
      for (let i = 0; i < barCount; i++) {
        const index = i * step;
        const value = dataArrayRef.current[index] / 255;
        newLevels.push(value);
      }

      setLevels(newLevels);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      source.disconnect();
      audioContext.close();
    };
  }, [stream, isRecording, isPaused, barCount]);

  // Draw on canvas for waveform/circle variants
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || variant === 'bars') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (variant === 'waveform') {
        drawWaveform(ctx, canvas, levels, color);
      } else if (variant === 'circle') {
        drawCircle(ctx, canvas, levels, color);
      }
    };

    draw();
  }, [levels, variant, color]);

  if (variant === 'bars') {
    return (
      <div className={`flex items-end justify-center gap-1 ${className}`}>
        {levels.map((level, i) => (
          <div
            key={i}
            className="w-1 rounded-full transition-all duration-75"
            style={{
              height: `${Math.max(4, level * 100)}%`,
              backgroundColor: color,
              opacity: isPaused ? 0.3 : 0.6 + level * 0.4,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={variant === 'circle' ? 200 : 60}
      className={className}
    />
  );
}

// Waveform drawing
function drawWaveform(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  levels: number[],
  color: string
) {
  const width = canvas.width;
  const height = canvas.height;
  const centerY = height / 2;
  const step = width / levels.length;

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  levels.forEach((level, i) => {
    const x = i * step;
    const amplitude = level * (height / 2 - 4);
    const y = centerY - amplitude;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Mirror
  ctx.beginPath();
  ctx.globalAlpha = 0.3;

  levels.forEach((level, i) => {
    const x = i * step;
    const amplitude = level * (height / 2 - 4);
    const y = centerY + amplitude;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
  ctx.globalAlpha = 1;
}

// Circle drawing
function drawCircle(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  levels: number[],
  color: string
) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const baseRadius = 40;
  const maxAmplitude = 30;

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;

  const angleStep = (Math.PI * 2) / levels.length;

  levels.forEach((level, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const radius = baseRadius + level * maxAmplitude;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.closePath();
  ctx.stroke();

  // Inner glow
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.1;
  ctx.arc(centerX, centerY, baseRadius - 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

// Simplified version without canvas - just CSS bars
export function SimpleAudioBars({
  isActive,
  barCount = 5,
  className = '',
}: {
  isActive: boolean;
  barCount?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-1 h-8 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-red-500 rounded-full transition-all duration-150 ${
            isActive ? 'animate-audio-bar' : ''
          }`}
          style={{
            height: isActive ? '100%' : '20%',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}

// Add to your global CSS:
/*
@keyframes audio-bar {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}

.animate-audio-bar {
  animation: audio-bar 0.5s ease-in-out infinite;
}
*/
