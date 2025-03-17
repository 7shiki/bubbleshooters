'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface RandomGameLinkProps {
  className?: string;
  children: React.ReactNode;
  locale: string;
  title?: string;
}

export default function RandomGameLink({ className, children, locale, title }: RandomGameLinkProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRandomGame = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      console.log('Fetching random game...');
      // 从localStorage获取游戏列表，如果没有则从API获取
      let gameList = [];
      const cachedGames = localStorage.getItem('allGames');
      
      if (cachedGames) {
        try {
          gameList = JSON.parse(cachedGames);
          console.log(`Found ${gameList.length} games in cache`);
        } catch (e) {
          console.error('Error parsing cached games:', e);
          localStorage.removeItem('allGames'); // 清除无效的缓存
        }
      }
      
      if (gameList.length === 0) {
        console.log(`Fetching games from API for locale: ${locale}`);
        // 如果没有缓存的游戏列表，从API获取
        const response = await fetch(`/api/games?locale=${locale}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        
        if (!data.games || !Array.isArray(data.games)) {
          throw new Error('Invalid response format from API');
        }
        
        gameList = data.games;
        console.log(`Fetched ${gameList.length} games from API`);
        
        // 缓存游戏列表到localStorage
        localStorage.setItem('allGames', JSON.stringify(gameList));
      }
      
      if (gameList.length === 0) {
        throw new Error('No games available');
      }
      
      // 随机选择一个游戏
      const randomIndex = Math.floor(Math.random() * gameList.length);
      const randomGame = gameList[randomIndex];
      
      console.log('Selected random game:', randomGame);
      
      // 构建游戏URL
      const gameUrl = randomGame.href;
      const fullUrl = locale === 'en' ? gameUrl : `/${locale}${gameUrl}`;
      
      console.log('Navigating to:', fullUrl);
      
      // 导航到随机游戏页面
      router.push(fullUrl);
    } catch (error) {
      console.error('Error getting random game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <a 
      href="javascript:void(0)" 
      onClick={handleRandomGame}
      className={className}
      title={title || "Open a random game"}
    >
      {children}
      {isLoading && <span className="ml-1 animate-spin">⏳</span>}
    </a>
  );
} 