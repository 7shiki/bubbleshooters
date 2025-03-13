import { Metadata } from 'next'
import { getTranslations, Game } from '../../utils/i18n'
import GameCard from '@/components/games/GameCard'
import GameImage from '@/components/games/GameImage'
import PlayButton from '@/components/games/PlayButton'
import GameContainer from '@/components/games/GameContainer'

// 动态生成 metadata
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const messages = await getTranslations(params.locale)
  const metadata = messages.home.metadata

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.og.title,
      description: metadata.og.description,
      url: 'https://bubbleshooters.org/',
      siteName: 'Bubble Shooters',
      type: 'website',
      images: [
        {
          url: 'https://bubbleshooters.org/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: metadata.og.imageAlt
        }
      ],
      locale: params.locale
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.og.title,
      description: metadata.og.description,
      images: ['https://bubbleshooters.org/images/og-image.jpg']
    },
    alternates: {
      canonical: 'https://bubbleshooters.org/',
      languages: {
        'en': 'https://bubbleshooters.org/',
        'zh': 'https://bubbleshooters.org/zh',
        'zh-TW': 'https://bubbleshooters.org/zh-TW',
        'es': 'https://bubbleshooters.org/es',
        'pt': 'https://bubbleshooters.org/pt',
        'ru': 'https://bubbleshooters.org/ru',
        'ja': 'https://bubbleshooters.org/ja',
        'de': 'https://bubbleshooters.org/de',
        'fr': 'https://bubbleshooters.org/fr',
        'ko': 'https://bubbleshooters.org/ko',
        'it': 'https://bubbleshooters.org/it',
        'fil': 'https://bubbleshooters.org/fil',
        'hi': 'https://bubbleshooters.org/hi',
        'vi': 'https://bubbleshooters.org/vi'
      } as Record<string, string>
    }
  }
}

export default async function Home({ params }: { params: { locale: string } }) {
  const messages = await getTranslations(params.locale)
  
  // Generate JSON-LD for SEO
  const generateJsonLd = () => {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': 'https://bubbleshooters.org/#website',
          'url': 'https://bubbleshooters.org/',
          'name': 'Bubble Shooters',
          'description': 'Play bubble shooter games online for free. Enjoy classic, 3D, and puzzle bubble shooter games with no download required.',
          'potentialAction': {
            '@type': 'SearchAction',
            'target': 'https://bubbleshooters.org/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'VideoGame',
          '@id': 'https://bubbleshooters.org/#game',
          'name': 'Bubble Shooter',
          'description': 'Classic bubble shooter game where you match and pop colorful bubbles to clear the board.',
          'genre': ['Puzzle', 'Arcade', 'Casual'],
          'gamePlatform': ['Web Browser', 'Mobile'],
          'applicationCategory': 'Game',
          'operatingSystem': 'Web Browser'
        }
      ]
    }
  }

  const jsonLd = generateJsonLd()

  // Mock data for recommended games with all required Game properties
  const recommendedGames = [
    { 
      id: 1, 
      title: 'Classic Bubble Shooter', 
      slug: 'classic-bubble-shooter', 
      imageUrl: '/images/games/Tekken 3.png', 
      platform: 'Browser',
      description: 'The original bubble shooter game with classic gameplay and colorful bubbles.',
      embedUrl: 'https://cdn.bubbleshooter.com/games/bubbleshooter-game/'
    },
    { 
      id: 2, 
      title: '3D Bubble Shooter', 
      slug: '3d-bubble-shooter', 
      imageUrl: '/images/games/3d-bubble-shooter.jpg', 
      platform: 'Browser',
      description: 'Experience bubble shooting in 3D with enhanced graphics and immersive gameplay.',
      embedUrl: 'https://cdn.bubbleshooter.com/games/3d-bubbleshooter-game/'
    },
    { 
      id: 3, 
      title: 'Puzzle Bubble Shooter', 
      slug: 'puzzle-bubble-shooter', 
      imageUrl: '/images/games/puzzle-bubble-shooter.jpg', 
      platform: 'Browser',
      description: 'Challenging puzzle levels combined with bubble shooting mechanics.',
      embedUrl: 'https://cdn.bubbleshooter.com/games/puzzle-bubbleshooter-game/'
    },
    { 
      id: 4, 
      title: 'Bubble Shooter Saga', 
      slug: 'bubble-shooter-saga', 
      imageUrl: '/images/games/bubble-shooter-saga.jpg', 
      platform: 'Browser',
      description: 'Epic saga with hundreds of levels of bubble shooting fun.',
      embedUrl: 'https://cdn.bubbleshooter.com/games/bubble-shooter-saga/'
    },
    { 
      id: 5, 
      title: 'Bubble Shooter Blast', 
      slug: 'bubble-shooter-blast', 
      imageUrl: '/images/games/bubble-shooter-blast.jpg', 
      platform: 'Browser',
      description: 'Fast-paced bubble shooter with explosive power-ups and special effects.',
      embedUrl: 'https://cdn.bubbleshooter.com/games/bubble-shooter-blast/'
    },
    { 
      id: 6, 
      title: 'Bubble Shooter Adventure', 
      slug: 'bubble-shooter-adventure', 
      imageUrl: '/images/games/bubble-shooter-adventure.jpg', 
      platform: 'Browser',
      description: 'Go on an adventure through different worlds while shooting bubbles.',
      embedUrl: 'https://cdn.bubbleshooter.com/games/bubble-shooter-adventure/'
    },
    { 
      id: 7, 
      title: 'Bubble Shooter Challenge', 
      slug: 'bubble-shooter-challenge', 
      imageUrl: '/images/games/bubble-shooter-challenge.jpg', 
      platform: 'Browser',
      description: 'Test your skills with challenging bubble shooter levels.',
      embedUrl: 'https://cdn.bubbleshooter.com/games/bubble-shooter-challenge/'
    },
    { 
      id: 8, 
      title: 'Bubble Shooter Pro', 
      slug: 'bubble-shooter-pro', 
      imageUrl: '/images/games/bubble-shooter-pro.jpg', 
      platform: 'Browser',
      description: 'Professional bubble shooter with advanced mechanics for expert players.',
      embedUrl: 'https://cdn.bubbleshooter.com/games/bubble-shooter-pro/'
    },
    { 
      id: 9, 
      title: 'Bubble Shooter Deluxe', 
      slug: 'bubble-shooter-deluxe', 
      imageUrl: '/images/games/bubble-shooter-deluxe.jpg', 
      platform: 'Browser',
      description: 'Deluxe version with premium graphics and smooth gameplay.',
      embedUrl: 'https://cdn.bubbleshooter.com/games/bubble-shooter-deluxe/'
    },
    { 
      id: 10, 
      title: 'Bubble Shooter Master', 
      slug: 'bubble-shooter-master', 
      imageUrl: '/images/games/bubble-shooter-master.jpg', 
      platform: 'Browser',
      description: 'Master the art of bubble shooting with this advanced version.',
      embedUrl: 'https://cdn.bubbleshooter.com/games/bubble-shooter-master/'
    },
  ];

  // Format games to match the Game type expected by GameCard
  const formattedGames: Game[] = recommendedGames.map(game => ({
    id: game.id,
    title: game.title,
    href: `/${game.slug}`,
    imageUrl: game.imageUrl,
    platform: game.platform,
    description: game.description,
    embedUrl: game.embedUrl
  }));

  // Mock messages for GameCard
  const gameCardMessages = {
    playGame: messages.home?.playGame || 'Play Game'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Game Container */}
      <div className="max-w-6xl mx-auto px-4">
        <GameContainer 
          title="Bubble Shooter Game"
          description="Mobile gamers have come to love the fast-paced and thrilling Bubble Shooter game. This free version gives players a taste of the entire game with colorful bubbles and addictive gameplay."
          gameUrl="https://cdn.bubbleshooter.com/games/bubbleshooter-game/"
          imageUrl={formattedGames[0].imageUrl}
        />
        
        {/* Game Description Section with SEO-friendly structure */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 max-w-[1000px] mx-auto">
          <h2 className="text-2xl font-semibold mb-3">The Ultimate Bubble Popping Experience</h2>
          
          <h3 className="text-xl font-semibold mb-2">How to Play Bubble Shooter</h3>
          <p className="mb-4">
            Aim and shoot colorful bubbles to match three or more of the same color. Clear all bubbles from the board to advance to the next level. 
            Use strategy to create chain reactions and score big points!
          </p>
          
          <h4 className="text-lg font-semibold mb-2">Game Features</h4>
          <ul className="list-disc pl-5 mb-4">
            <li>Multiple levels with increasing difficulty</li>
            <li>Colorful graphics and smooth gameplay</li>
            <li>Special power-ups and boosters</li>
            <li>Relaxing yet challenging gameplay</li>
            <li>Perfect for players of all ages</li>
          </ul>
          
          <h5 className="text-base font-semibold mb-2">Frequently Asked Questions</h5>
          <div className="mb-4">
            <p className="font-medium">Is Bubble Shooter free to play?</p>
            <p className="mb-2">Yes, Bubble Shooter is completely free to play in your browser with no downloads required.</p>
            
            <p className="font-medium">Can I play Bubble Shooter on mobile?</p>
            <p className="mb-2">Absolutely! Our Bubble Shooter game is fully responsive and works on smartphones and tablets.</p>
            
            <p className="font-medium">Are there different difficulty levels?</p>
            <p>Yes, the game features progressive difficulty to challenge players of all skill levels.</p>
          </div>
          
          <h6 className="text-base font-semibold mb-2">Additional Information</h6>
          <p className="mb-4">
            Bubble Shooter is a classic arcade-style puzzle game that has been entertaining players since the 1990s. 
            Our version brings this timeless game to modern browsers with enhanced graphics and smooth controls.
          </p>
          
          {/* Social Share Buttons */}
          <div className="flex flex-wrap gap-2 mt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
              <span>Share on Facebook</span>
            </button>
            <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
              <span>Share on Twitter</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center">
              <span>Share on Reddit</span>
            </button>
          </div>
        </section>

        {/* Game Cards Grid */}
        <section className="mb-8 max-w-[1000px] mx-auto">
          <h2 className="text-2xl font-bold mb-4 px-2">{messages.home.recommendedGames || 'Recommended Games'}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {formattedGames.slice(0, 10).map((game) => (
              <div key={game.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transform hover:scale-105 transition-transform">
                <a href={`/${params.locale}/${game.href}`}>
                  <div className="relative">
                    <GameImage 
                      src={game.imageUrl} 
                      alt={game.title} 
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-yellow-500 text-xs font-bold px-2 py-1 rounded-full">
                      TOP RATED
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate">{game.title}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-yellow-500 text-xs">★</span>
                        ))}
                      </div>
                      <span className="text-xs ml-1 text-gray-500 dark:text-gray-400">4.2</span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>
        
        {/* Hot Games Section */}
        <section className="mb-8 max-w-[1000px] mx-auto">
          <h2 className="text-2xl font-bold mb-4 px-2">{messages.home.hotGames || 'Hot Games'}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {formattedGames.slice(0, 5).map((game) => (
              <div key={game.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transform hover:scale-105 transition-transform">
                <a href={`/${params.locale}/${game.href}`}>
                  <div className="relative">
                    <GameImage 
                      src={game.imageUrl} 
                      alt={game.title} 
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-xs font-bold px-2 py-1 rounded-full">
                      HOT
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate">{game.title}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-yellow-500 text-xs">★</span>
                        ))}
                      </div>
                      <span className="text-xs ml-1 text-gray-500 dark:text-gray-400">4.5</span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
