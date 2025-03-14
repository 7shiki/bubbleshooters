'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'
import SearchBar from './SearchBar'

interface HeaderProps {
  initialMessages: any
}

export default function Header({ initialMessages }: HeaderProps) {
    const pathname = usePathname()
    const params = useParams()
    const locale = params.locale as string || 'en'
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // 控制 body 滚动
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    const handleSearch = (query: string) => {
        // 实现搜索功能，跳转到all-games页面并带上搜索参数
        if (query.trim()) {
            window.location.href = `/${locale}/all-games?search=${encodeURIComponent(query)}`
        }
    }

    return (
        <>
            <header className="sticky top-0 z-50 bg-nav backdrop-blur-md border-b border-purple-500/10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link 
                                href={locale === 'en' ? '/' : `/${locale}`} 
                                className="flex items-center"
                                title={initialMessages.common.logo.title}
                            >
                                <span className="retro-logo text-xl md:text-2xl">Bubble Shooter</span>
                            </Link>
                        </div>

                        {/* Search Bar - 居中显示 */}
                        <div className="hidden md:block w-auto">
                            <SearchBar onSearch={handleSearch} initialMessages={initialMessages} />
                        </div>

                        {/* Right section: Language and Theme Controls */}
                        <div className="flex items-center">
                            <div className="flex items-center bg-nav rounded-lg">
                                <LanguageToggle />
                                <div className="h-full border-r border-purple-500/10" />
                                <ThemeToggle />
                            </div>
                            
                            {/* Mobile menu button */}
                            <button
                                type="button"
                                className="md:hidden ml-2 p-2 rounded-lg hover:bg-purple-500/10"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? (
                                    <XMarkIcon className="h-6 w-6 dark:invert" />
                                ) : (
                                    <Bars3Icon className="h-6 w-6 dark:invert" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* 移动端搜索栏 - 直接显示在导航栏下方 */}
                <div className="md:hidden border-t border-purple-500/10 px-4 py-2">
                    <SearchBar onSearch={handleSearch} initialMessages={initialMessages} />
                </div>
            </header>

            {/* Mobile Navigation Drawer - 只保留语言和主题切换 */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity md:hidden z-[9999] ${
                    isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <div
                    className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-950 transform transition-transform duration-300 ease-in-out shadow-xl z-[10000] ${
                        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="h-full overflow-y-auto">
                        <div className="sticky top-0 p-4 bg-white dark:bg-gray-950 border-b border-purple-500/10">
                            <div className="flex items-center justify-between">
                                <span className="retro-logo text-xl">Bubble Shooter</span>
                                <button
                                    type="button"
                                    className="p-2 rounded-lg hover:bg-purple-500/10 text-gray-800 dark:text-white"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 space-y-6">
                            {/* 移动端菜单内容 - 可以添加其他选项 */}
                            <div className="pt-4 flex flex-col space-y-4">
                                <div className="text-lg font-medium text-gray-700 dark:text-gray-200">Settings</div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Language</span>
                                    <LanguageToggle />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">Theme</span>
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
