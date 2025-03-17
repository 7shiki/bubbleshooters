'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

interface FooterProps {
    locale: string
    initialMessages: any
}

export default function Footer({ locale, initialMessages }: FooterProps) {
    const baseUrl = locale === 'en' ? '' : `/${locale}`
    const messages = initialMessages.footer

    return (
        <footer className="bg-nav border-t border-purple-500/10">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* 左侧 - RetroGames */}
                    <div>
                        <Link href={baseUrl || '/'} className="block">
                            <span className="retro-logo text-lg font-semibold text-purple-400 mb-4 block">Bubble Shooter</span>
                        </Link>
                        <p className="text-sm text-gray-400">
                            {messages.description}
                        </p>
                    </div>

                    {/* 中间 - 链接 */}
                    <div>
                        <span className="text-lg font-semibold text-purple-400 mb-4 block">
                            {messages.others.title}
                        </span>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href={`${baseUrl}/privacy-policy`}
                                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
                                >
                                    {messages.others.privacy}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={`${baseUrl}/terms-of-service`}
                                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
                                >
                                    {messages.others.terms}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 右侧 - Contact Us */}
                    <div>
                        <span className="text-lg font-semibold text-purple-400 mb-4 block">
                            {messages.contact.title}
                        </span>
                        <div className="flex flex-col gap-4">
                            <a
                                href="mailto:support@bubbleshooters.org"
                                className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
                            >
                                support@bubbleshooters.org
                            </a>
                            <p className="text-sm text-gray-400">
                                {messages.contact.disclaimer}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 版权信息 */}
                <div className="mt-8 pt-8 border-t border-purple-500/10 text-center">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()}{' '}
                        <Link
                            href={baseUrl || '/'}
                            className="hover:text-purple-400 transition-colors"
                        >
                            Bubble Shooters
                        </Link>
                        . {messages.contact.rights}
                    </p>
                </div>
            </div>
        </footer>
    )
}
