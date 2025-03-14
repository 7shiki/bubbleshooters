import { Metadata } from 'next'
import { getTranslations } from '@/utils/i18n'
import HistoryClient from './HistoryClient'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const messages = await getTranslations(params.locale)
  
  return {
    title: messages.history?.metadata?.title || 'Play History',
    description: messages.history?.metadata?.description || 'View your game play history',
    alternates: {
      canonical: 'https://bubbleshooters.org/history',
      languages: {
        'en': 'https://bubbleshooters.org/history',
        'zh': 'https://bubbleshooters.org/zh/history',
        'zh-TW': 'https://bubbleshooters.org/zh-TW/history',
        'es': 'https://bubbleshooters.org/es/history',
        'pt': 'https://bubbleshooters.org/pt/history',
        'ru': 'https://bubbleshooters.org/ru/history',
        'ja': 'https://bubbleshooters.org/ja/history',
        'de': 'https://bubbleshooters.org/de/history',
        'fr': 'https://bubbleshooters.org/fr/history',
        'ko': 'https://bubbleshooters.org/ko/history',
        'it': 'https://bubbleshooters.org/it/history',
        'fil': 'https://bubbleshooters.org/fil/history',
        'hi': 'https://bubbleshooters.org/hi/history',
        'vi': 'https://bubbleshooters.org/vi/history'
      } as Record<string, string>
    }
  }
}

export default async function HistoryPage({ params }: { params: { locale: string } }) {
  const messages = await getTranslations(params.locale)

  // Add generateJsonLd as a local function
  const generateJsonLd = () => {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': 'https://bubbleshooters.org/history#webpage',
          'url': 'https://bubbleshooters.org/history',
          'name': 'Game Play History - Bubble Shooters',
          'description': 'View your recently played games history.',
          'isPartOf': {
            '@id': 'https://bubbleshooters.org/#website'
          }
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
              'name': 'History',
              'item': 'https://bubbleshooters.org/history'
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
      <HistoryClient 
        locale={params.locale}
        initialMessages={messages}
      />
    </>
  )
}
