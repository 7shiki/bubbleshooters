import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Sidebar from '@/components/layout/Sidebar'
import { getTranslations } from '@/utils/i18n'
import { categories } from '@/config/categories'
import { ThemeScript } from '@/components/layout/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Play Bubble Shooter Game Online. No Download Required.',
  description: 'Play bubble shooter game online for free in your browser. Enjoy classic, 3D, and puzzle bubble shooter unblocked games with no download required. Have fun!',
}

// 定义固定导航项
const getFixedNavItems = (messages: any) => [
  { icon: "🏠", label: messages.navigation?.home || "Home", href: "/", isRandom: false, key: "home" },
  { icon: "🕒", label: messages.navigation?.history || "History", href: "/history", isRandom: false, key: "history" },
  { icon: "🎲", label: messages.navigation?.random || "Random", href: "#", isRandom: true, key: "random" }
];

// 从categories中获取分类导航项
const getCategoryNavItems = (messages: any) => {
  return categories.categories.map(category => ({
    icon: category.icon,
    label: messages.platforms?.[category.key]?.alt || category.name,
    href: category.href,
    isRandom: false,
    key: category.key
  }));
};

// 合并固定导航项和分类导航项
const getAllNavItems = (messages: any) => {
  const fixedItems = getFixedNavItems(messages);
  const categoryItems = getCategoryNavItems(messages);
  
  return [...fixedItems, ...categoryItems];
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getTranslations(locale)
  const navItems = getAllNavItems(messages);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
          <Header initialMessages={messages} />
          <div className="flex flex-1">
            {/* 侧边栏 - 传递messages */}
            <Sidebar navItems={navItems} locale={locale} messages={messages} />
            
            {/* 主内容区域 */}
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