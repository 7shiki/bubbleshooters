import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Sidebar from '@/components/layout/Sidebar'
import { getTranslations } from '@/utils/i18n'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RetroGames - Play Classic Games Online',
  description: 'Play your favorite retro games online. Collection of Nintendo, Sega, PlayStation, and Arcade classics.',
}

// 定义导航项
const getNavItems = () => [
  { icon: "🏠", label: "Home", href: "/" },
  { icon: "🕒", label: "History", href: "/history" },
  { icon: "🎲", label: "Random", href: "/random-game" }
];

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getTranslations(locale)
  const navItems = getNavItems();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
          <Header initialMessages={messages} />
          <div className="flex flex-1">
            {/* 侧边栏 */}
            <Sidebar navItems={navItems} locale={locale} />
            
            {/* 主内容区域 - 移除左边距 */}
            <main className="flex-grow md:ml-5 pt-2 px-0">
              {children}
            </main>
          </div>
          <Footer locale={locale} initialMessages={messages} />
        </div>
      </body>
    </html>
  )
} 