import { readFile } from 'fs/promises'
import path from 'path'

// 支持的语言列表
export const SUPPORTED_LOCALES = ['en', 'zh', 'zh-TW', 'es', 'pt', 'ru', 'ja', 'de', 'fr', 'ko', 'it', 'fil', 'hi', 'vi'] as const
export type Locale = typeof SUPPORTED_LOCALES[number]

// 默认语言
export const DEFAULT_LOCALE = 'en'

// 验证语言是否支持
export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale)
}

// 服务器端获取翻译文件
export async function getTranslations(locale: string) {
  // 如果不是支持的语言，使用默认语言
  const validLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE
  
  try {
    // 读取翻译文件
    const filePath = path.join(process.cwd(), 'messages', `${validLocale}.json`)
    const fileContent = await readFile(filePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error(`Error loading translations for ${locale}:`, error)
    
    // 如果出错且不是默认语言，尝试加载默认语言
    if (validLocale !== DEFAULT_LOCALE) {
      return getTranslations(DEFAULT_LOCALE)
    }
    
    // 如果是默认语言都加载失败，返回空对象
    return {}
  }
}

// 客户端获取翻译的函数
export async function getClientTranslations(locale: string) {
  // 如果不是支持的语言，使用默认语言
  const validLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE
  
  try {
    // 使用fetch API从公共目录获取翻译文件
    const response = await fetch(`/messages/${validLocale}.json`)
    if (!response.ok) {
      throw new Error(`Failed to fetch translations for ${validLocale}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error loading translations for ${locale}:`, error)
    
    // 如果出错且不是默认语言，尝试加载默认语言
    if (validLocale !== DEFAULT_LOCALE) {
      return getClientTranslations(DEFAULT_LOCALE)
    }
    
    // 如果是默认语言都加载失败，返回默认翻译对象
    return {
      history: {
        title: 'Play History',
        description: 'Games you have played recently',
        noHistory: 'You have not played any games yet',
        clearHistory: 'Clear History',
        lastPlayed: 'Last played',
        emptyMessage: 'Your play history will appear here',
      }
    }
  }
}

// 获取游戏数据
export async function getGameData(locale: string) {
  const validLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE
  
  try {
    // 读取游戏数据文件
    const filePath = path.join(process.cwd(), 'data', 'games', `${validLocale}.json`)
    const fileContent = await readFile(filePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error(`Error loading game data for ${locale}:`, error)
    
    // 如果出错且不是默认语言，尝试加载默认语言
    if (validLocale !== DEFAULT_LOCALE) {
      return getGameData(DEFAULT_LOCALE)
    }
    
    // 如果是默认语言都加载失败，返回空对象
    return {
      gameList: [],
      popularGames: [],
      newGames: []
    }
  }
}

// 类型定义
export interface Translations {
  home: {
    metadata: {
      title: string
      description: string
      keywords: string
      og: {
        title: string
        description: string
        imageAlt: string
      }
    }
    hero: {
      title: {
        play: string
        retroGames: string
      }
      description: string
    }
  }
  games: {
    popularGames: string
    newGames: string
    viewAll: string
    playGame: string
    loadMore: string
    updatedDaily: string
  }
  history?: {
    metadata?: {
      title: string
      description: string
      keywords: string
    }
    title: string
    description: string
    noHistory: string
    clearHistory: string
    lastPlayed: string
    emptyMessage: string
    confirmClear: string
  }
}

export interface GameData {
  gameList: Game[]
  popularGames: Game[]
  newGames: Game[]
}

export interface Game {
  id: number
  title: string
  platform: string
  imageUrl: string
  href: string
  description: string
  embedUrl: string
  seoDescription?: SeoDescription
}

// 添加SEO描述相关的类型定义
export interface SeoDescription {
  sections?: Section[]
  overview?: string[]
  features?: string[]
  gameplay?: string
  history?: string[]
}

export interface Section {
  title: string
  content: string
  subsections?: Subsection[]
  bulletPoints?: string[]
}

export interface Subsection {
  title: string
  content: string
  faqs?: FAQ[]
}

export interface FAQ {
  question: string
  answer: string
} 