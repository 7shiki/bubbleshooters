export interface CategoryItem {
    name: string
    href: string
    icon: string
    key: string
}

interface Categories {
    categories: CategoryItem[]
}

export const categories: Categories = {
    categories: [
        { icon: "🎯", name: 'Bubble Games', href: '/bubble-games', key: 'bubble' },
        { icon: "🔥", name: 'Hot Games', href: '/hot-games', key: 'hot' },
        { icon: "✨", name: 'New Games', href: '/new-games', key: 'new' },
        { icon: "🧩", name: 'Puzzle Games', href: '/puzzle-games', key: 'puzzle' },
        { icon: "🏃", name: 'Jumping Games', href: '/jumping-games', key: 'jumping' },
        { icon: "🎶", name: 'Music Games', href: '/music-games', key: 'music' }
    ]
} as const

// 创建一个扁平化的分类映射
export const categoryMap = Object.entries(categories).reduce((acc, [company, items]) => {
    items.forEach((item: CategoryItem) => {
        const key = item.key
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