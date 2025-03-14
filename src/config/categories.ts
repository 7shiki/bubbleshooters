export interface CategoryItem {
    name: string
    href: string
    alt: string
    key: string
}

interface Categories {
    categories: CategoryItem[]
}

export const categories: Categories = {
    categories: [
        { name: 'Hot Games', href: '/hot-games', alt: 'Nintendo Entertainment System Games Online', key: 'hot' },
        { name: 'New Games', href: '/new-games', alt: 'Famicom Disk System Games Online', key: 'new' },
        { name: 'Puzzle Games', href: '/puzzle-games', alt: 'Super Nintendo Entertainment System Games Online', key: 'puzzle' },
        { name: 'Shooter Games', href: '/shooter-games', alt: 'Nintendo Game Boy Color Games Online', key: 'shooter' },
        { name: 'Card Games', href: '/card-games', alt: 'Nintendo Game Boy Advance Games Online', key: 'card' },
        { name: 'Junping Games', href: '/junping-games', alt: 'Nintendo 64 Games Online', key: 'junping' },
        { name: 'Music Games', href: '/music-games', alt: 'Nintendo DS Games Online', key: 'music' }
    ]
} as const

// 创建一个扁平化的分类映射
export const categoryMap = Object.entries(categories).reduce((acc, [company, items]) => {
    items.forEach((item: CategoryItem) => {
        const key = item.href.replace('/', '').replace('-games', '')
        acc[key] = {
            title: `${item.name} Games`,
            platform: item.name,
            company,
            key: item.key
        }
    })
    return acc
}, {} as Record<string, {
    title: string
    platform: string
    company: string
    key: string
}>) 