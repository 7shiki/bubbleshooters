import { Game } from '@/utils/i18n'
import GameImage from './GameImage'

interface GameListProps {
  games: Game[]
  locale: string
  showLoadMore?: boolean
  onLoadMore?: () => void
  messages: {
    playGame: string
    loadMore: string
  }
}

export default function GameList({
  games,
  locale,
  showLoadMore = false,
  onLoadMore,
  messages
}: GameListProps) {
  return (
    <>
      <div className="flex flex-wrap justify-center gap-4">
        {games.map((game) => (
          <div key={game.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <a href={`/${locale}/${game.href}`} className="block hover:opacity-95 transition-all">
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

      {showLoadMore && (
        <div className="mt-12 text-center">
          <button
            onClick={onLoadMore}
            className="px-8 py-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
          >
            <span className="retro-logo text-4xl md:text-5xl">
              {messages.loadMore}
            </span>
          </button>
        </div>
      )}
    </>
  )
}
