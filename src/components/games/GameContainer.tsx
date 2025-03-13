'use client';

import React, { useState } from 'react';
import GameImage from './GameImage';

interface GameContainerProps {
  title: string;
  description: string;
  gameUrl: string;
  imageUrl: string;
}

export default function GameContainer({ title, description, gameUrl, imageUrl }: GameContainerProps) {
  const [showGame, setShowGame] = useState(false);

  const handlePlayClick = () => {
    setShowGame(true);
  };

  return (
    <div className="mb-8">
      {/* 游戏容器 - 固定尺寸，整体向左移动 */}
      <div className="relative w-full" style={{ 
        maxWidth: '1000px', 
        aspectRatio: '4/3',
        marginLeft: '0', // 取消自动居中
        transform: 'translateX(-50px)' // 整体向左移动50px
      }}>
        {!showGame ? (
          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-800">
            {/* 游戏标题 - 移到内容区域顶部 */}
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8 text-center md:text-left px-6">
              {/* 游戏标题 */}
              <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-white">{title}</h1>
              
              {/* 游戏描述 */}
              <div className="text-gray-700 dark:text-gray-300 mb-8 max-w-lg mx-auto md:mx-0">
                <p className="mb-4 text-lg">{description}</p>
              </div>
              
              {/* 播放按钮 */}
              <div className="flex justify-center md:justify-start">
                <button 
                  onClick={handlePlayClick}
                  className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-12 rounded-full shadow-lg flex items-center justify-center text-lg transform hover:scale-105 transition-transform"
                  aria-label="Play Game"
                >
                  <span className="mr-2">▶</span> PLAY GAME
                </button>
              </div>
            </div>
            
            {/* 游戏图片 */}
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden shadow-lg border-4 border-white mx-6">
              <GameImage 
                src={imageUrl} 
                alt={`${title} Logo`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <iframe 
            src={gameUrl} 
            className="w-full h-full"
            style={{ 
              width: '100%', 
              height: '100%',
              border: 'none',
              margin: 0,
              padding: 0,
              overflow: 'hidden',
              display: 'block'
            }}
            allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
            id="game-frame"
            scrolling="no"
            frameBorder="0"
          ></iframe>
        )}
      </div>
    </div>
  );
} 