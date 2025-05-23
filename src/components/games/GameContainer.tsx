'use client';

import React, { useState, useRef, useEffect } from 'react';
import GameImage from './GameImage';

interface GameContainerProps {
  title: string;
  description: string;
  gameUrl: string;
  imageUrl: string;
  gameId?: number; // 添加游戏ID
  slug?: string;   // 添加游戏slug
  category?: string; // 添加游戏类别
}

// 游戏历史记录类型
interface GameHistoryItem {
  id: number;
  title: string;
  slug: string;
  imageUrl: string;
  lastPlayed: string; // ISO 日期字符串
  category?: string;  // 添加游戏类别
}

// 最大历史记录数量
const MAX_HISTORY_ITEMS = 20;

export default function GameContainer({ 
  title, 
  description, 
  gameUrl, 
  imageUrl,
  gameId = 0,
  slug = '',
  category = 'all-games' // 默认类别为 all-games
}: GameContainerProps) {
  const [showGame, setShowGame] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // 在组件挂载时预加载iframe
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = gameUrl;
      
      // 监听iframe加载完成事件
      const handleIframeLoad = () => {
        setIframeLoaded(true);
      };
      
      iframeRef.current.addEventListener('load', handleIframeLoad);
      
      return () => {
        if (iframeRef.current) {
          iframeRef.current.removeEventListener('load', handleIframeLoad);
        }
      };
    }
  }, [gameUrl]);

  // 保存游戏到历史记录
  const saveToHistory = () => {
    if (typeof window === 'undefined' || !gameId || !slug) return;
    
    try {
      // 获取现有历史记录
      const savedHistory = localStorage.getItem('gameHistory');
      let gameHistory: GameHistoryItem[] = [];
      
      if (savedHistory) {
        gameHistory = JSON.parse(savedHistory);
      }
      
      // 检查游戏是否已在历史记录中
      const existingIndex = gameHistory.findIndex(item => item.id === gameId);
      
      // 创建新的历史记录项
      const historyItem: GameHistoryItem = {
        id: gameId,
        title: title,
        slug: slug,
        imageUrl: imageUrl,
        lastPlayed: new Date().toISOString(),
        category: category // 保存游戏类别
      };
      
      // 如果游戏已存在，则更新它
      if (existingIndex !== -1) {
        gameHistory[existingIndex] = historyItem;
      } else {
        // 否则添加到历史记录
        gameHistory.push(historyItem);
      }
      
      // 如果历史记录超过最大数量，则删除最旧的记录
      if (gameHistory.length > MAX_HISTORY_ITEMS) {
        // 按最后玩的时间排序
        gameHistory.sort((a, b) => 
          new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime()
        );
        // 保留最近的MAX_HISTORY_ITEMS条记录
        gameHistory = gameHistory.slice(0, MAX_HISTORY_ITEMS);
      }
      
      // 保存回localStorage
      localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    } catch (error) {
      console.error('Failed to save game history:', error);
    }
  };

  const handlePlayClick = () => {
    setShowGame(true);
    saveToHistory(); // 保存游戏到历史记录
  };

  // 分享功能 - 复制当前页面链接
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert('链接已复制到剪贴板！');
      })
      .catch(err => {
        console.error('无法复制链接: ', err);
      });
  };

  // 全屏模式
  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error('全屏模式错误:', err));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error('退出全屏模式错误:', err));
      }
    }
  };

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="mb-8">
      {/* 游戏容器 - 添加圆角 */}
      <div 
        ref={containerRef}
        className="relative w-full rounded-xl overflow-hidden shadow-lg" 
        style={{ 
          aspectRatio: '4/3'
        }}
      >
        {/* 游戏介绍界面 - 当showGame为false时显示，添加圆角 */}
        {!showGame && (
          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-800 z-10 rounded-xl p-4">
            {/* 游戏图片 - 移动端放在顶部，桌面端放在右侧 */}
            <div className="w-24 h-24 md:w-48 md:h-48 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden shadow-lg border-4 border-white mb-3 md:mb-0 md:order-2 md:ml-6">
              <GameImage 
                src={imageUrl} 
                alt={`${title} Logo`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* 游戏标题和描述 - 移动端放在图片下方，桌面端放在左侧 */}
            <div className="w-full md:w-2/3 text-center md:text-left md:order-1 md:pr-4">
              {/* 游戏标题 */}
              <h1 className="text-lg md:text-3xl font-bold mb-2 md:mb-6 text-gray-800 dark:text-white">{title}</h1>
              
              {/* 游戏描述 - 使用CSS控制移动端文本截断 */}
              <div className="text-gray-700 dark:text-gray-300 mb-3 md:mb-8 max-w-lg mx-auto md:mx-0">
                <p className="text-sm md:text-lg md:line-clamp-none line-clamp-5 overflow-hidden">
                  {description}
                </p>
              </div>
              
              {/* 播放按钮 */}
              <div className="flex justify-center md:justify-start">
                <button 
                  onClick={handlePlayClick}
                  className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-6 md:py-4 md:px-12 rounded-full shadow-lg flex items-center justify-center text-sm md:text-lg transform hover:scale-105 transition-transform"
                  aria-label="Play Game"
                >
                  <span className="mr-2">▶</span> PLAY GAME
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 始终渲染iframe，但根据showGame状态控制可见性，添加圆角 */}
        <iframe 
          ref={iframeRef}
          className="w-full h-full rounded-t-xl"
          style={{ 
            width: '100%', 
            height: '100%',
            border: 'none',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            display: 'block',
            visibility: showGame ? 'visible' : 'hidden' // 根据状态控制可见性
          }}
          allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
          id="game-frame"
          scrolling="no"
          frameBorder="0"
        ></iframe>

        {/* 游戏控制栏 - 始终显示，不再根据showGame状态控制 */}
        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 border-t border-gray-300 dark:border-gray-700 rounded-b-xl">
          {/* 游戏名称 - 添加边框 */}
          <div className="font-medium text-gray-800 dark:text-white px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md">
            {title}
          </div>
          
          {/* 控制按钮组 - 添加边框 */}
          <div className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 rounded-md p-1 bg-white dark:bg-gray-700">
            {/* 分享按钮 */}
            <button 
              onClick={handleShare}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
              aria-label="Share"
              title="分享"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            
            {/* 分隔线 */}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            
            {/* 全屏模式按钮 */}
            <button 
              onClick={handleFullscreen}
              className={`p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded ${isFullscreen ? 'text-blue-500 dark:text-blue-400' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
              aria-label="Fullscreen"
              title="全屏模式"
            >
              {isFullscreen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 