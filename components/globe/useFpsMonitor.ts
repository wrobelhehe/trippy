"use client";

import { useEffect, useRef, useState } from "react";

export function useFpsMonitor(sampleSize = 12) {
  const [fps, setFps] = useState(0);
  const frames = useRef(0);
  const lastTime = useRef(0);
  const samples = useRef<number[]>([]);

  useEffect(() => {
    let rafId = 0;

    const loop = (timestamp: number) => {
      if (lastTime.current === 0) {
        lastTime.current = timestamp;
      }

      frames.current += 1;
      const elapsed = timestamp - lastTime.current;

      if (elapsed >= 1000) {
        const current = Math.round((frames.current / elapsed) * 1000);
        samples.current.push(current);
        if (samples.current.length > sampleSize) {
          samples.current.shift();
        }
        const avg = Math.round(
          samples.current.reduce((sum, value) => sum + value, 0) /
            samples.current.length
        );
        setFps(avg);
        frames.current = 0;
        lastTime.current = timestamp;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, [sampleSize]);

  return fps;
}