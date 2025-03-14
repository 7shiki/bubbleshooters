export interface CategoryItem {
    name: string
    href: string
    alt: string
    icon: string
    key: string
}

interface Categories {
    categories: CategoryItem[]
}

export const categories: Categories = {
    categories: [
        { icon: "🔥", name: 'Hot Games', href: '/hot-games', alt: 'Nintendo Entertainment System Games Online', key: 'hot' },
        { icon: "✨", name: 'New Games', href: '/new-games', alt: 'Famicom Disk System Games Online', key: 'new' },
        { icon: "🎯", name: 'Bubble Games', href: '/bubble-games', alt: 'Nintendo Game Boy Color Games Online', key: 'bubble' },
        { icon: "🧩", name: 'Puzzle Games', href: '/puzzle-games', alt: 'Super Nintendo Entertainment System Games Online', key: 'puzzle' },
        { icon: "🃏", name: 'Card Games', href: '/card-games', alt: 'Nintendo Game Boy Advance Games Online', key: 'card' },
        { icon: "🏃", name: 'Junping Games', href: '/junping-games', alt: 'Nintendo 64 Games Online', key: 'junping' },
        { icon: "🎶", name: 'Music Games', href: '/music-games', alt: 'Nintendo DS Games Online', key: 'music' }
    ]
} as const

// 创建一个扁平化的分类映射
export const categoryMap = Object.entries(categories).reduce((acc, [company, items]) => {
    items.forEach((item: CategoryItem) => {
        const key = item.href.replace('/', '').replace('-games', '')
        acc[key] = {
            title: `${item.name}`,
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