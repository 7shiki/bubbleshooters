'use client';

import React from 'react';

interface PlayButtonProps {
  targetId: string;
  label: string;
}

export default function PlayButton({ targetId, label }: PlayButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const gameFrame = document.getElementById(targetId);
    if (gameFrame) {
      gameFrame.focus();
      gameFrame.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <a 
      href={`#${targetId}`} 
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-10 rounded-full shadow-lg flex items-center justify-center text-lg transform hover:scale-105 transition-transform"
      onClick={handleClick}
    >
      <span className="mr-2">▶</span> {label}
    </a>
  );
} 