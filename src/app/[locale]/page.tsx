import { Metadata } from 'next'
import { getTranslations, Game, getGameData, Section, Subsection, FAQ } from '../../utils/i18n'
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
  // 从getGameData函数获取游戏数据
  const { gameList, popularGames } = await getGameData(params.locale)
  
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

  // 使用从getGameData获取的游戏数据
  const formattedGames: Game[] = gameList.map((game: Game) => ({
    id: game.id,
    title: game.title,
    href: game.href,
    imageUrl: game.imageUrl,
    platform: game.platform,
    description: game.description,
    embedUrl: game.embedUrl,
    seoDescription: game.seoDescription
  }));

  // 获取第一个游戏作为主游戏展示
  const featuredGame = formattedGames[0];

  // Mock messages for GameCard
  const gameCardMessages = {
    playGame: messages.home?.playGame
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="flex flex-col md:ml-48">
        {/* Main content area with game and sidebar */}
        <div className="w-full flex flex-col md:flex-row">
          {/* Left sidebar with game cards - No left margin/padding to remove empty space */}
          <div className="w-full md:w-52 pr-0 pt-0.5">
            <div className="flex flex-col space-y-6 px-2 items-center">
              {formattedGames.slice(1, 21).map((game) => (
                <div key={game.id}>
                  <a href={`/${params.locale}/${game.href}`} className="block hover:opacity-95 transition-all">
                    <div 
                      className="relative shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl" 
                      style={{ width: '180px', height: '100px' }}
                    >
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
          </div>
          
          {/* Game Container - Main content */}
          <div className="w-full md:flex-1 md:pl-8">
            <div className="max-w-[1000px]">
              <GameContainer 
                title={featuredGame.title}
                description={featuredGame.description}
                gameUrl={featuredGame.embedUrl}
                imageUrl={featuredGame.imageUrl}
                gameId={featuredGame.id}
                slug={featuredGame.href.split('/').pop() || "/"}
              />

              {/* Hot Games Section - Below the main content */}
              <section className="mb-8 w-full">
                <div className="flex flex-wrap justify-center gap-4">
                  {(formattedGames.slice(1, 6)).map((game: Game) => (
                    <div key={game.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                      <a href={`/${params.locale}/${game.href}`} className="block hover:opacity-95 transition-all">
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
              </section>

               {/* Game Description Section with SEO-friendly structure */}
               <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 w-full">
                {featuredGame.seoDescription?.sections && featuredGame.seoDescription.sections.length > 0 ? (
                  // 如果有sections数据，则动态渲染
                  featuredGame.seoDescription.sections.map((section: Section, sectionIndex: number) => (
                    <div key={`section-${sectionIndex}`} className={sectionIndex > 0 ? "mt-8" : ""}>
                      <h2 className="text-2xl font-semibold mb-3">{section.title}</h2>
                      
                      {section.content && <p className="mb-4">{section.content}</p>}
                      
                      {section.subsections?.map((subsection: Subsection, subsectionIndex: number) => (
                        <div key={`subsection-${sectionIndex}-${subsectionIndex}`} className={subsectionIndex > 0 ? "mt-6" : ""}>
                          <h3 className="text-xl font-semibold mb-2">{subsection.title}</h3>
                          
                          {subsection.content && <p className="mb-3">{subsection.content}</p>}
                          
                          {/* 渲染FAQ列表 */}
                          {subsection.faqs?.map((faq: FAQ, faqIndex: number) => (
                            <div key={`faq-${sectionIndex}-${subsectionIndex}-${faqIndex}`} className="mb-2">
                              <p className="font-medium">{faq.question}</p>
                              <p className="mb-2">{faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                      
                      {/* 渲染项目符号列表 */}
                      {section.bulletPoints && (
                        <ul className="list-disc pl-5 mb-4">
                          {section.bulletPoints.map((point: string, pointIndex: number) => (
                            <li key={`point-${sectionIndex}-${pointIndex}`}>{point}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                ) : (
                  // 如果没有sections数据，则显示默认内容
                  <div>
                  </div>
                )}
              </section>
              
              {/* More Games Section - Below the main content */}
              <section className="mb-8 w-full">
                <div className="flex flex-wrap justify-center gap-4">
                  {formattedGames.slice(5, 15).map((game: Game) => (
                    <div key={game.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                      <a href={`/${params.locale}/${game.href}`} className="block hover:opacity-95 transition-all">
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
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
