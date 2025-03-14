'use client'

import { useState } from 'react'
import Image from 'next/image'
import { categoryMap, categories } from '@/config/categories'
import GameList from '@/components/games/GameList'
import { Game } from '@/utils/i18n'

const GAMES_PER_PAGE = 12 // 每页显示的游戏数量

interface CategoryClientProps {
  category: string
  locale: string
  initialMessages: any
  initialGames: Game[]
}

export default function CategoryClient({ 
  category, 
  locale,
  initialMessages: messages,
  initialGames
}: CategoryClientProps) {
  const [visibleGames, setVisibleGames] = useState(GAMES_PER_PAGE)

  // 获取当前分类信息
  const info = categoryMap[category]
  
  // 如果分类不存在，显示错误信息（这是一个额外的安全措施）
  if (!info) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-section">
        <div className="max-w-md w-full text-center">
          <h1 className="text-6xl font-bold mb-6 retro-logo">404</h1>
          <h2 className="text-2xl font-semibold mb-4">
            {messages.category?.notFound?.title}
          </h2>
          <p className="text-gray-400 mb-8">
            {messages.category?.notFound?.description}
          </p>
          <a 
            href={locale === 'en' ? '/' : `/${locale}`}
            className="retro-button inline-block"
          >
            {messages.notFound?.backHome}
          </a>
        </div>
      </div>
    )
  }

  // 根据当前分类筛选游戏，移除搜索词筛选
  const filteredGames = initialGames.filter(game => {
    // 只匹配平台
    return game.platform.toLowerCase() === info.platform.toLowerCase()
  })

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
                {info.title}
              </span>
            </h1>
            <div>
              <p className="text-base md:text-sm mb-10 max-w-3xl opacity-90">
                {messages.platforms[info.key].description}
              </p>
            </div>
          </div>
        </section>

        {/* Games Grid Section */}
        <section className="flex-1 py-16 px-4 bg-section">
          <div className="max-w-7xl mx-auto">
            {/* Results Count - 修改文本，移除搜索相关内容 */}
            <div className="mb-6 text-gray-400">
              {messages.allGames.foundGames
                .replace('{count}', filteredGames.length.toString())
                .replace('{platform}', ` ${info.title}`)
                .replace('{query}', '')}
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
                </p>
              </div>
            )}

            {/* Games Grid */}
            <GameList
              games={currentGames}
              locale={locale}
              showLoadMore={hasMore}
              onLoadMore={handleLoadMore}
              messages={{
                playGame: messages.games.playGame,
                loadMore: messages.games.loadMore
              }}
            />
          </div>
        </section>
      </main>
    </div>
  )
}