import { MetadataRoute } from 'next'
import path from 'path'
import fs from 'fs'
import { categories } from '@/config/categories'

// 支持的语言列表
const LANGUAGES = ['', 'zh', 'zh-TW', 'ja', 'ko', 'ru', 'fr', 'de', 'es', 'it', 'pt', 'vi', 'hi', 'fil']

// 从 categories 获取平台列表
const PLATFORMS = Object.keys(categories).flatMap(key => categories[key as keyof typeof categories].map(category => category.href))

// 安全地获取游戏数据
function getGameData() {
    try {
        const gamesDir = path.join(process.cwd(), 'data/games')
        if (fs.existsSync(path.join(gamesDir, 'en.json'))) {
            const data = JSON.parse(fs.readFileSync(path.join(gamesDir, 'en.json'), 'utf8'))
            return data
        }
        return { gameList: [] }
    } catch (error) {
        console.error('Error loading game data:', error)
        return { gameList: [] }
    }
}

// 获取所有游戏路径
function getGamePaths(): string[] {
    const gameData = getGameData()
    // 使用 slice(1) 跳过数组中的第一个元素
    return gameData.gameList ? gameData.gameList.slice(1).map((game: any) => game.href) : []
}

export default function sitemap(): MetadataRoute.Sitemap {
    const baseURL = 'https://bubbleshooters.org'
    const urls: MetadataRoute.Sitemap = []

    // 添加主页
    LANGUAGES.forEach(lang => {
        urls.push({
            url: `${baseURL}${lang ? `/${lang}` : ''}`
        })
    })

    // 添加 all-games 页面
    LANGUAGES.forEach(lang => {
        urls.push({
            url: `${baseURL}${lang ? `/${lang}` : ''}/all-games`
        })
    })

    // 添加平台页面
    PLATFORMS.forEach((platform: string) => {
        LANGUAGES.forEach(lang => {
            urls.push({
                url: `${baseURL}${lang ? `/${lang}` : ''}${platform}`
            })
        })
    })

    // 添加游戏页面
    const gamePaths = getGamePaths()
    gamePaths.forEach(gamePath => {
        LANGUAGES.forEach(lang => {
            urls.push({
                url: `${baseURL}${lang ? `/${lang}` : ''}${gamePath}`
            })
        })
    })

    return urls
} 