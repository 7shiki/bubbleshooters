import { Metadata } from 'next'
import AllGamesClient from './AllGamesClient'
import { getGameData, getTranslations } from '@/utils/i18n'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const messages = await getTranslations(params.locale)
  const metadata = messages.allGames.metadata

  const canonicalUrl = params.locale === 'en' 
  ? `https://bubbleshooters.org/all-games` 
  : `https://bubbleshooters.org/${params.locale}/all-games`

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': 'https://bubbleshooters.org/all-games',
        'zh': 'https://bubbleshooters.org/zh/all-games',
        'zh-TW': 'https://bubbleshooters.org/zh-TW/all-games',
        'es': 'https://bubbleshooters.org/es/all-games',
        'pt': 'https://bubbleshooters.org/pt/all-games',
        'ru': 'https://bubbleshooters.org/ru/all-games',
        'ja': 'https://bubbleshooters.org/ja/all-games',
        'de': 'https://bubbleshooters.org/de/all-games',
        'fr': 'https://bubbleshooters.org/fr/all-games',
        'ko': 'https://bubbleshooters.org/ko/all-games',
        'it': 'https://bubbleshooters.org/it/all-games',
        'fil': 'https://bubbleshooters.org/fil/all-games',
        'hi': 'https://bubbleshooters.org/hi/all-games',
        'vi': 'https://bubbleshooters.org/vi/all-games'
      } as Record<string, string>
    }
  }
}

export default async function AllGamesPage({ params }: { params: { locale: string } }) {
  const { gameList } = await getGameData(params.locale)
  const messages = await getTranslations(params.locale)

  // Add generateJsonLd as a local function
  const generateJsonLd = () => {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': 'https://bubbleshooters.org/all-games#webpage',
          'url': 'https://bubbleshooters.org/all-games',
          'name': 'All Bubble Shooter Games - Play Bubble Games Online',
          'description': 'Browse and play all bubble shooter games online for free in your browser. No download required. Experience colorful bubble popping games instantly.',
          'isPartOf': {
            '@id': 'https://bubbleshooters.org/#website'
          }
        },
        {
          '@type': 'VideoGameSeries',
          '@id': 'https://bubbleshooters.org/all-games#gameseries',
          'name': 'Bubble Shooter Games Collection',
          'description': 'Complete collection of bubble shooter games available to play online for free.',
          'genre': ['Bubble Games', 'Puzzle Games', 'Matching Games']
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://bubbleshooters.org/'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'All Games',
              'item': 'https://bubbleshooters.org/all-games'
            }
          ]
        }
      ]
    }
  }

  const jsonLd = generateJsonLd()

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <AllGamesClient 
        locale={params.locale}
        initialMessages={messages}
        initialGames={gameList}
      />
    </>
  )
}