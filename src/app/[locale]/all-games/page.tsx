import { Metadata } from 'next'
import AllGamesClient from './AllGamesClient'
import { getGameData, getTranslations } from '@/utils/i18n'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const messages = await getTranslations(params.locale)
  const metadata = messages.allGames.metadata

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: {
      canonical: 'https://retro-games.org/all-games',
      languages: {
        'en': 'https://retro-games.org/all-games',
        'zh': 'https://retro-games.org/zh/all-games',
        'zh-TW': 'https://retro-games.org/zh-TW/all-games',
        'es': 'https://retro-games.org/es/all-games',
        'pt': 'https://retro-games.org/pt/all-games',
        'ru': 'https://retro-games.org/ru/all-games',
        'ja': 'https://retro-games.org/ja/all-games',
        'de': 'https://retro-games.org/de/all-games',
        'fr': 'https://retro-games.org/fr/all-games',
        'ko': 'https://retro-games.org/ko/all-games',
        'it': 'https://retro-games.org/it/all-games',
        'fil': 'https://retro-games.org/fil/all-games',
        'hi': 'https://retro-games.org/hi/all-games',
        'vi': 'https://retro-games.org/vi/all-games'
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
          '@id': 'https://retro-games.org/all-games#webpage',
          'url': 'https://retro-games.org/all-games',
          'name': 'All Retro Games - Play Classic Games Online',
          'description': 'Browse and play all retro games online for free in your browser. No download required. Experience classic video games instantly.',
          'isPartOf': {
            '@id': 'https://retro-games.org/#website'
          }
        },
        {
          '@type': 'VideoGameSeries',
          '@id': 'https://retro-games.org/all-games#gameseries',
          'name': 'Retro Games Collection',
          'description': 'Complete collection of classic retro games available to play online for free.',
          'genre': ['Retro Games', 'Classic Games']
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://retro-games.org/'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'All Games',
              'item': 'https://retro-games.org/all-games'
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