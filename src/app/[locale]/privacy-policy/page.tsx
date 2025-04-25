import { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from '@/utils/i18n'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const messages = await getTranslations(params.locale)

    const canonicalUrl = params.locale === 'en' 
    ? `https://bubbleshooters.org/privacy-policy` 
    : `https://bubbleshooters.org/${params.locale}/privacy-policy`

    return {
        title: `${messages.footer.privacy.title} - Bubble Shooter`,
        description: messages.footer.privacy.description,
        alternates: {
            canonical: canonicalUrl,
            languages: {
              'en': 'https://bubbleshooters.org/privacy-policy',
              'zh': 'https://bubbleshooters.org/zh/privacy-policy',
              'zh-TW': 'https://bubbleshooters.org/zh-TW/privacy-policy',
              'es': 'https://bubbleshooters.org/es/privacy-policy',
              'pt': 'https://bubbleshooters.org/pt/privacy-policy',
              'ru': 'https://bubbleshooters.org/ru/privacy-policy',
              'ja': 'https://bubbleshooters.org/ja/privacy-policy',
              'de': 'https://bubbleshooters.org/de/privacy-policy',
              'fr': 'https://bubbleshooters.org/fr/privacy-policy',
              'ko': 'https://bubbleshooters.org/ko/privacy-policy',
              'it': 'https://bubbleshooters.org/it/privacy-policy',
              'fil': 'https://bubbleshooters.org/fil/privacy-policy',
              'hi': 'https://bubbleshooters.org/hi/privacy-policy',
              'vi': 'https://bubbleshooters.org/vi/privacy-policy'
            } as Record<string, string>
          }
    }
}

export default async function PrivacyPolicy({ params }: { params: { locale: string } }) {
    const messages = await getTranslations(params.locale)
    const privacy = messages.footer.privacy
    const locale = params.locale

    return (
        <div className="flex flex-col md:ml-48">
            <main className="min-h-screen relative">
                {/* 背景网格 */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-10"></div>

                {/* 内容容器 */}
                <div className="relative z-10 min-h-screen flex flex-col bg-section">
                    <div className="max-w-4xl mx-auto px-4 py-12">
                        <h1 className="text-4xl font-bold mb-2">
                            {privacy.title}
                        </h1>

                        {/* 添加最后更新时间 */}
                        <p className="text-sm text-gray-400 mb-8">
                            {privacy.lastUpdated}
                        </p>

                        <div className="space-y-8 dark:text-gray-200">
                            {/* 介绍部分 */}
                            <section>
                                <p className="mb-4">
                                    {privacy.intro.text1}
                                    <Link href={locale === 'en' ? "/" : `/${locale}`} className="text-purple-500 hover:text-purple-400 transition-colors">
                                        Bubble Shooters
                                    </Link>
                                    {privacy.intro.text2}
                                </p>
                                <p className="mb-4">
                                    {privacy.intro.text3}
                                    <Link href={locale === 'en' ? "/" : `/${locale}`} className="text-purple-500 hover:text-purple-400 transition-colors">
                                        bubbleshooters.org
                                    </Link>
                                    {privacy.intro.text4}
                                </p>
                            </section>

                            {/* 数据收集部分 */}
                            <section>
                                <h2 className="text-2xl font-bold mb-4">{privacy.collection.title}</h2>
                                <p className="mb-4">{privacy.collection.description}</p>
                                <ul className="list-disc list-inside mb-4 space-y-2">
                                    {privacy.collection.items.map((item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </section>

                            {/* 第三方内容部分 */}
                            <section>
                                <h2 className="text-2xl font-bold mb-4">{privacy.thirdParty.title}</h2>
                                <p className="mb-4">{privacy.thirdParty.description}</p>
                                <ul className="list-disc list-inside mb-4 space-y-2">
                                    {privacy.thirdParty.items.map((item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </section>

                            {/* Cookie 使用说明 */}
                            <section>
                                <h2 className="text-2xl font-bold mb-4">{privacy.cookies.title}</h2>
                                <p className="mb-4">{privacy.cookies.description}</p>
                                <ul className="list-disc list-inside mb-4 space-y-2">
                                    {privacy.cookies.items.map((item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                                <p className="mb-4">{privacy.cookies.control}</p>
                            </section>

                            {/* 外部链接声明 */}
                            <section>
                                <h2 className="text-2xl font-bold mb-4">{privacy.links.title}</h2>
                                <p className="mb-4">{privacy.links.description}</p>
                                <p className="mb-4">{privacy.links.disclaimer}</p>
                            </section>

                            {/* 政策更新说明 */}
                            <section>
                                <h2 className="text-2xl font-bold mb-4">{privacy.updates.title}</h2>
                                <p className="mb-4">{privacy.updates.description}</p>
                                <p className="mb-4">{privacy.updates.consent}</p>
                            </section>

                            {/* 联系信息 */}
                            <section>
                                <h2 className="text-2xl font-bold mb-4">{privacy.contact.title}</h2>
                                <p className="mb-4">{privacy.contact.description}</p>
                                <a
                                    href={`mailto:${privacy.contact.email}`}
                                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
                                >
                                    support@bubbleshooters.org
                                </a>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
