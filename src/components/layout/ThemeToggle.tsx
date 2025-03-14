'use client'

import { useState, useEffect } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // 检查系统偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    // 从 localStorage 获取主题设置，如果没有则使用系统偏好
    const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light')
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
    
    // 添加或移除dark类以支持Tailwind的暗色模式
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    
    // 添加或移除dark类以支持Tailwind的暗色模式
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // 在组件挂载前显示一个占位图标
  if (!mounted) {
    return (
      <button className="px-3 py-2 rounded-r-lg hover:bg-purple-500/10 transition-colors text-gray-800 dark:text-gray-200">
        <div className="w-5 h-5" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 rounded-r-lg hover:bg-purple-500/10 transition-colors text-gray-800 dark:text-gray-200"
    >
      {theme === 'dark' ? (
        <SunIcon className="w-5 h-5 text-yellow-400" />
      ) : (
        <MoonIcon className="w-5 h-5 text-purple-600" />
      )}
    </button>
  )
}

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            let theme = localStorage.getItem('theme')
            if (!theme) {
              theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
              localStorage.setItem('theme', theme)
            }
            document.documentElement.setAttribute('data-theme', theme)
            
            // 添加或移除dark类以支持Tailwind的暗色模式
            if (theme === 'dark') {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }
          } catch (e) {}
        `,
      }}
    />
  )
} 