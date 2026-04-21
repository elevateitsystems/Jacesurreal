"use client";

import { useThrottle } from "@/lib/useThrottle";
import Image from "next/image";
import { useRef } from "react";

interface Props {
  totalPlays: string;
  totalLikes: string;
}

export default function DJSection({ totalPlays, totalLikes }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTilt = useThrottle(
    (x: number, y: number, width: number, height: number) => {
      if (!cardRef.current) return;
      const centerX = width / 2;
      const centerY = height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    },
    16,
  ); // ~60fps throttle

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleTilt(
      e.clientX - rect.left,
      e.clientY - rect.top,
      rect.width,
      rect.height,
    );
  };

  const resetTilt = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    }
  };

  return (
    <div className="dj-section">
      <div
        ref={cardRef}
        className="dj-photo-container"
        id="djPhoto"
        onMouseMove={onMouseMove}
        onMouseLeave={resetTilt}
      >
        <div className="dj-photo-inner">
          <Image
            src="/dj.jpg"
            alt="DJ Surreal"
            className="dj-photo-img"
            width={320}
            height={320}
          />
        </div>
        <div className="dj-info">
          <h1 className="dj-name">DJ SURREAL</h1>
          <p className="dj-tagline">Electronic • House • Future Bass</p>
          <div className="dj-stats">
            <div className="stat-badge plays">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span id="totalPlays">{totalPlays}</span> plays
            </div>
            <div className="stat-badge likes">
              <svg viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span id="totalLikes">{totalLikes}</span> likes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
