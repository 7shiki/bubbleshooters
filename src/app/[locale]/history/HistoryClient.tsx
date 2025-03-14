'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GameImage from '@/components/games/GameImage';

// 游戏历史记录类型
interface GameHistoryItem {
  id: number;
  title: string;
  slug: string;
  imageUrl: string;
  lastPlayed: string; // ISO 日期字符串
  category?: string;
}

interface HistoryClientProps {
  locale: string;
  initialMessages: any; // 从服务器端传入初始翻译
}

export default function HistoryClient({ locale, initialMessages }: HistoryClientProps) {
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [messages] = useState<any>(initialMessages); // 不再需要setMessages，直接使用initialMessages
  const [isLoading, setIsLoading] = useState(true);

  // 从 localStorage 加载游戏历史
  useEffect(() => {
    const loadGameHistory = () => {
      try {
        const savedHistory = localStorage.getItem('gameHistory');
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory) as GameHistoryItem[];
          // 按最近玩过的时间排序
          parsedHistory.sort((a, b) => 
            new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime()
          );
          setGameHistory(parsedHistory);
        }
      } catch (error) {
        console.error('Failed to load game history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // 确保在客户端执行
    if (typeof window !== 'undefined') {
      loadGameHistory();
    }
  }, []);

  // 清除历史记录
  const handleClearHistory = () => {
    localStorage.removeItem('gameHistory');
    setGameHistory([]);
  };

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // 使用从props传入的messages，确保有默认值
  const historyMessages = messages.history || {
    title: 'Play History',
    description: 'Games you have played recently',
    noHistory: 'You have not played any games yet',
    clearHistory: 'Clear History',
    lastPlayed: 'Last played',
    emptyMessage: 'Your play history will appear here',
    confirmClear: 'Are you sure you want to clear all game history?'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{historyMessages.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{historyMessages.description}</p>
      </div>

      {isLoading ? (
        // 加载状态
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : gameHistory.length > 0 ? (
        // 有历史记录时显示游戏卡片列表
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {gameHistory.length} {gameHistory.length === 1 ? 'game' : 'games'} in history
            </p>
            <button
              onClick={handleClearHistory}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              {historyMessages.clearHistory}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gameHistory.map((game) => (
              <Link 
                key={`${game.id}-${game.lastPlayed}`} 
                href={game.id === 1 
                  ? (locale === 'en' ? '/' : `/${locale}`) 
                  : (locale === 'en' 
                    ? `/${game.category || 'all-games'}/${game.slug}`
                    : `/${locale}/${game.category || 'all-games'}/${game.slug}`)}
                className="block"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                  <div className="relative" style={{ height: '160px' }}>
                    <GameImage 
                      src={game.imageUrl} 
                      alt={game.title} 
                      className="w-full h-full object-cover"
                    />
                    {/* 游戏名称悬浮层 - 鼠标悬停时显示 */}
                    <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                      <p className="text-white text-center text-sm font-medium truncate w-full">
                        {game.title.length > 20 ? `${game.title.substring(0, 20)}...` : game.title}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="font-medium text-gray-900 dark:text-white mb-1 truncate">{game.title}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {historyMessages.lastPlayed}: {formatDate(game.lastPlayed)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        // 没有历史记录时显示缺省图
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-64 h-64 mb-6 opacity-70">
            <Image
              src="/images/search/No history records found.png"
              alt="No history"
              width={300}
              height={300}
              className="w-full h-auto"
            />
          </div>
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            {historyMessages.noHistory}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
            {historyMessages.emptyMessage}
          </p>
        </div>
      )}
    </div>
  );
} 