'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchBar from '@/components/layout/SearchBar'
import GameImage from '@/components/games/GameImage'
import { Game } from '@/utils/i18n'
import Image from 'next/image'

const GAMES_PER_PAGE = 18 // 每页显示的游戏数量

interface AllGamesClientProps {
  locale: string
  initialMessages: any // 从服务器端传入初始翻译
  initialGames: Game[] // 从服务器端传入初始游戏数据
}

export default function AllGamesClient({ locale, initialMessages, initialGames }: AllGamesClientProps) {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search') || ''

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [visibleGames, setVisibleGames] = useState(GAMES_PER_PAGE)
  const [games] = useState<Game[]>(initialGames)
  const [messages] = useState(initialMessages)

  // 当 URL 参数变化时更新搜索词
  useEffect(() => {
    setSearchQuery(initialSearch)
  }, [initialSearch])

  // 根据搜索词筛选游戏
  const filteredGames = games.filter(game => {
    const matchesSearch = searchQuery
      ? game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.description && game.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true

    return matchesSearch
  })

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setVisibleGames(GAMES_PER_PAGE) // 重置显示数量
  }

  // 处理加载更多
  const handleLoadMore = () => {
    setVisibleGames(prev => prev + GAMES_PER_PAGE)
  }

  // 获取当前可见的游戏
  const currentGames = filteredGames.slice(0, visibleGames)
  const hasMore = filteredGames.length > visibleGames

  return (
    <div className="flex flex-col md:ml-48">
      <main className="min-h-screen relative flex flex-col bg-section">
        {/* 背景网格 */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* Hero Section */}
        <section className="relative py-16 px-4 overflow-hidden bg-section">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="retro-logo text-4xl md:text-5xl">
                {messages.allGames.title}
              </span>
            </h1>
            <div>
              <p className="text-lg md:text-xl mb-4 max-w-3xl opacity-90">
                {messages.allGames.description}
              </p>
              <p className="text-base mb-8 max-w-3xl opacity-90">
                {messages.allGames.subDescription}
              </p>
            </div>
            <div className="mb-8">
              <SearchBar 
                onSearch={handleSearch} 
                defaultValue={searchQuery} 
                initialMessages={initialMessages}
              />
            </div>
          </div>
        </section>

        {/* Games Grid Section */}
        <section className="flex-1 py-16 px-4 bg-section">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-400 retro-text mb-8">
              <span className="retro-logo text-4xl md:text-5xl">
                {messages.allGames.browseGames}
              </span>
            </h2>

            {/* Results Count */}
            <div className="mb-6 text-gray-400">
              {messages.allGames.foundGames
                .replace('{count}', filteredGames.length.toString())
                .replace('{platform}', '')
                .replace('{query}', searchQuery ? ` "${searchQuery}"` : '')}
            </div>

            {filteredGames.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-[300px] mx-auto mb-6">
                  <Image
                    src="/images/search/Can't find the game you're looking for.png"
                    alt={messages.allGames.noGamesFound}
                    width={300}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-lg text-gray-400">
                  {messages.allGames.noGamesFound}
                  {searchQuery && (
                    <button
                      className="text-purple-400 hover:text-purple-300 ml-2"
                      onClick={() => setSearchQuery('')}
                    >
                      {messages.allGames.clearSearch}
                    </button>
                  )}
                </p>
              </div>
            )}

            {/* Games Grid - 使用与首页相同的卡片样式 */}
            <div className="flex flex-wrap justify-center gap-4">
              {currentGames.map((game) => (
                <div key={game.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                  <a href={locale === 'en' ? game.href : `/${locale}${game.href}`} className="block hover:opacity-95 transition-all">
                    <div className="relative" style={{ width: '180px', height: '100px' }}>
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
                  </a>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  {messages.games.loadMore}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}