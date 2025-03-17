import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Game, getTranslations, getGameData, Section, Subsection, FAQ } from '@/utils/i18n'
import { categoryMap } from '@/config/categories'
import Script from 'next/script'
import Link from 'next/link'
import Image from 'next/image'
import GameContainer from '@/components/games/GameContainer'
import GameImage from '@/components/games/GameImage'
import Breadcrumb from '@/components/common/Breadcrumb'

interface Props {
  params: {
    locale: string
    category: string
    game: string
  }
}

interface GameSEODescription {
  overview: string[]
  history: string[]
  features: string[]
}

interface RelatedGame {
  id: string
  title: string
  href: string
  imageUrl: string
  platform: string
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const messages = await getTranslations(params.locale)
  const { gameList } = await getGameData(params.locale)
  const fullPath = `/${params.category}/${params.game}`
  const game = gameList.find((g: Game) => g.href === fullPath)

  if (!game) {
    return {
      title: messages.game.notFound.title,
      description: messages.game.notFound.description
    }
  }

  const title = messages.game.metadata.title.replace('{title}', game.title)
  const description = messages.game.metadata.description
    .replaceAll('{title}', game.title)
    .replaceAll('{platform}', game.platform)
  const url = `https://bubbleshooters.org/${params.locale}${fullPath}`

  return {
    title,
    description,
    keywords: ``,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Bubble Shooters',
      type: 'website',
      images: [
        {
          url: `https://bubbleshooters.org${game.imageUrl}`,
          width: 320,
          height: 200,
          alt: `${game.title} Screenshot`
        }
      ],
      locale: params.locale
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://bubbleshooters.org${game.imageUrl}`]
    },
    alternates: {
      canonical: `https://bubbleshooters.org/${params.category}/${params.game}`,
      languages: {
        'en': `https://bubbleshooters.org/${params.category}/${params.game}`,
        'zh': `https://bubbleshooters.org/zh/${params.category}/${params.game}`,
        'zh-TW': `https://bubbleshooters.org/zh-TW/${params.category}/${params.game}`,
        'es': `https://bubbleshooters.org/es/${params.category}/${params.game}`,
        'pt': `https://bubbleshooters.org/pt/${params.category}/${params.game}`,
        'ru': `https://bubbleshooters.org/ru/${params.category}/${params.game}`,
        'ja': `https://bubbleshooters.org/ja/${params.category}/${params.game}`,
        'de': `https://bubbleshooters.org/de/${params.category}/${params.game}`,
        'fr': `https://bubbleshooters.org/fr/${params.category}/${params.game}`,
        'ko': `https://bubbleshooters.org/ko/${params.category}/${params.game}`,
        'it': `https://bubbleshooters.org/it/${params.category}/${params.game}`,
        'fil': `https://bubbleshooters.org/fil/${params.category}/${params.game}`,
        'hi': `https://bubbleshooters.org/hi/${params.category}/${params.game}`,
        'vi': `https://bubbleshooters.org/vi/${params.category}/${params.game}`
      } as Record<string, string>
    }
  }
}

export default async function GamePage({ params }: Props) {
  const messages = await getTranslations(params.locale)
  const { gameList } = await getGameData(params.locale)
  const fullPath = `/${params.category}/${params.game}`
  const game = gameList.find((g: Game) => g.href === fullPath)

  if (!game) {
    notFound()
  }

  const categorySlug = params.category.replace('-games', '')
  const category = categoryMap[categorySlug]

  if (!category) {
    notFound()
  }

  // 获取分类名称
  const categoryName = category?.title || 
                       messages.platforms?.[params.category]?.alt || 
                       params.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // 面包屑项
  const breadcrumbItems = [
    {
      label: categoryName,
      href: `/${params.category}`,
      isCurrentPage: false
    },
    {
      label: game.title,
      href: `/${params.category}/${params.game}`,
      isCurrentPage: true
    }
  ]

  // 获取相关游戏（同一分类的其他游戏）
  const relatedGames = gameList
    .filter((g: Game) => 
      g.id !== game.id && 
      (g.href.startsWith(`/${params.category}/`) || g.href.startsWith(`${params.category}/`))
    )
    .slice(0, 5);

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
          'description': 'Play bubble shooter games online for free. Enjoy classic, 3D, and puzzle bubble shooter games with no download required.'
        },
        {
          '@type': 'VideoGame',
          '@id': `https://bubbleshooters.org${fullPath}#game`,
          'name': game.title,
          'description': game.description || `Play ${game.title} online for free in your browser. No download required.`,
          'genre': ['Puzzle', 'Arcade', 'Casual'],
          'gamePlatform': ['Web Browser', 'Mobile'],
          'applicationCategory': 'Game',
          'operatingSystem': 'Web Browser'
        }
      ]
    }
  }

  const jsonLd = generateJsonLd()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="flex flex-col md:ml-48">
        {/* Main content area with game and sidebar */}
        <div className="w-full flex flex-col md:flex-row">
          {/* Left sidebar with game cards - 仅在桌面端显示 */}
          <div className="hidden md:block md:w-52 pr-0 pt-0.5">
            <div className="flex flex-col space-y-6 px-2 items-center">
              {gameList.slice(1, 21).map((sidebarGame: Game) => (
                <div key={sidebarGame.id}>
                  <a href={params.locale === 'en' ? sidebarGame.href : `/${params.locale}${sidebarGame.href}`} className="block hover:opacity-95 transition-all">
                    <div 
                      className="relative shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl" 
                      style={{ width: '180px', height: '100px' }}
                    >
                      <GameImage 
                        src={sidebarGame.imageUrl} 
                        alt={sidebarGame.title} 
                        className="w-full h-full object-cover"
                      />
                      {/* 游戏名称悬浮层 - 鼠标悬停时显示 */}
                      <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                        <p className="text-white text-center text-sm font-medium truncate w-full">
                          {sidebarGame.title.length > 20 ? `${sidebarGame.title.substring(0, 20)}...` : sidebarGame.title}
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
                title={game.title}
                description={game.description}
                gameUrl={game.embedUrl}
                imageUrl={game.imageUrl}
                gameId={game.id}
                slug={params.game}
                category={params.category}
              />

              {/* 相关游戏 - 同一分类的其他游戏 */}
              <section className="mb-8 w-full">
                <div className="flex flex-wrap justify-center gap-4">
                  {relatedGames.map((relatedGame: Game) => (
                    <div key={relatedGame.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                      <a href={params.locale === 'en' ? relatedGame.href : `/${params.locale}${relatedGame.href}`} className="block hover:opacity-95 transition-all">
                        <div className="relative" style={{ width: '180px', height: '100px' }}>
                          <GameImage 
                            src={relatedGame.imageUrl} 
                            alt={relatedGame.title} 
                            className="w-full h-full object-cover"
                          />
                          {/* 游戏名称悬浮层 - 鼠标悬停时显示 */}
                          <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                            <p className="text-white text-center text-sm font-medium truncate w-full">
                              {relatedGame.title.length > 20 ? `${relatedGame.title.substring(0, 20)}...` : relatedGame.title}
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
                {/* 面包屑导航 */}
                <Breadcrumb 
                  items={breadcrumbItems} 
                  locale={params.locale} 
                  homeLabel={messages.game?.breadcrumb?.home || "Home"} 
                />
                
                {game.seoDescription?.sections && game.seoDescription.sections.length > 0 ? (
                  // 如果有sections数据，则动态渲染
                  game.seoDescription.sections.map((section: Section, sectionIndex: number) => (
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
                  {gameList.slice(5, 15).map((moreGame: Game) => (
                    <div key={moreGame.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                      <a href={params.locale === 'en' ? moreGame.href : `/${params.locale}${moreGame.href}`} className="block hover:opacity-95 transition-all">
                        <div className="relative" style={{ width: '180px', height: '100px' }}>
                          <GameImage 
                            src={moreGame.imageUrl} 
                            alt={moreGame.title} 
                            className="w-full h-full object-cover"
                          />
                          {/* 游戏名称悬浮层 - 鼠标悬停时显示 */}
                          <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                            <p className="text-white text-center text-sm font-medium truncate w-full">
                              {moreGame.title.length > 20 ? `${moreGame.title.substring(0, 20)}...` : moreGame.title}
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
