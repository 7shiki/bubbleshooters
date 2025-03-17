import { Metadata } from 'next'
import { categoryMap } from '@/config/categories'
import CategoryClient from './CategoryClient'
import { getGameData, getTranslations } from '@/utils/i18n'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { category: string, locale: string } }): Promise<Metadata> {
  const categorySlug = params.category.replace('-games', '')
  const info = categoryMap[categorySlug]
  const messages = await getTranslations(params.locale)

  if (!info) {
    return {
      title: messages.category.notFound.title,
      description: messages.category.notFound.description
    }
  }

  return {
    title: messages.category.metadata.title
      .replaceAll('{platform}', info.title),
    description: messages.category.metadata.description
      .replaceAll('{platform}', info.platform),
    keywords: messages.category.metadata.keywords,
    alternates: {
      canonical: `https://bubbleshooters.org/${params.category}`,
      languages: {
        'en': `https://bubbleshooters.org/${params.category}`,
        'zh': `https://bubbleshooters.org/zh/${params.category}`,
        'zh-TW': `https://bubbleshooters.org/zh-TW/${params.category}`,
        'es': `https://bubbleshooters.org/es/${params.category}`,
        'pt': `https://bubbleshooters.org/pt/${params.category}`,
        'ru': `https://bubbleshooters.org/ru/${params.category}`,
        'ja': `https://bubbleshooters.org/ja/${params.category}`,
        'de': `https://bubbleshooters.org/de/${params.category}`,
        'fr': `https://bubbleshooters.org/fr/${params.category}`,
        'ko': `https://bubbleshooters.org/ko/${params.category}`,
        'it': `https://bubbleshooters.org/it/${params.category}`,
        'fil': `https://bubbleshooters.org/fil/${params.category}`,
        'hi': `https://bubbleshooters.org/hi/${params.category}`,
        'vi': `https://bubbleshooters.org/vi/${params.category}`
      } as Record<string, string>
    }
  }
}

export default async function CategoryPage({ params }: { params: { locale: string; category: string } }) {
  const { gameList } = await getGameData(params.locale)
  const messages = await getTranslations(params.locale)
  
  // 检查分类是否存在
  const categorySlug = params.category.replace('-games', '')
  const info = categoryMap[categorySlug]

  // 如果分类不存在，显示404页面
  if (!info) {
    notFound()
  }
  
  // Move generateJsonLd here as a local function
  const generateJsonLd = () => {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `https://bubbleshooters.org/${params.category}#webpage`,
          'url': `https://bubbleshooters.org/${params.category}`,
          'name': `${info.title} - Bubble Shooters`,
          'description': `Want to play ${info.platform}? Play best ${info.platform} online for free in your browser. No download required. Enjoy ${info.platform} instantly.`,
          'isPartOf': {
            '@id': 'https://bubbleshooters.org/#website'
          }
        },
        {
          '@type': 'VideoGameSeries',
          '@id': `https://bubbleshooters.org/${params.category}#gameseries`,
          'name': `${info.platform} Collection`,
          'description': `Want to play ${info.platform}? Play best ${info.platform} online for free in your browser. No download required. Enjoy ${info.platform} instantly.`,
          'gamePlatform': info.platform,
          'genre': ['Bubble Games', 'Puzzle Games', 'Matching Games']
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://bubbleshooters.org/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "All Games",
              "item": "https://bubbleshooters.org/all-games"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": info.title,
              "item": `https://bubbleshooters.org/${params.category}`
            }
          ]
        }
      ]
    }
  }

  const jsonLd = generateJsonLd()

  // 获取分类名称
  const categoryName = info?.title || 
                       messages.platforms?.[params.category]?.alt || 
                       params.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  // 面包屑项
  const breadcrumbItems = [
    {
      label: categoryName,
      href: `/${params.category}`,
      isCurrentPage: true
    }
  ]

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CategoryClient 
        category={categorySlug}
        locale={params.locale}
        initialMessages={messages}
        initialGames={gameList}
      />
    </>
  )
}