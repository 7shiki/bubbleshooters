'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import RandomGameLink from './RandomGameLink';

interface NavItem {
  icon: string;
  label: string | React.ReactNode;
  href: string;
  isRandom?: boolean;
  key?: string; // 添加key属性用于匹配platforms中的alt文本
}

interface SidebarProps {
  navItems: NavItem[];
  locale: string;
  messages: any; // 添加messages属性用于获取多语言文本
}

export default function Sidebar({ navItems, locale, messages }: SidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // 防止侧边栏滚动事件传播到主页面
  useEffect(() => {
    const sidebar = sidebarRef.current;
    
    const preventPropagation = (e: WheelEvent) => {
      // 检查是否需要阻止事件传播
      const { scrollTop, scrollHeight, clientHeight } = sidebar as HTMLDivElement;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      
      // 如果在顶部并且向上滚动，或者在底部并且向下滚动，则不阻止
      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        return;
      }
      
      // 否则阻止事件传播
      e.stopPropagation();
    };
    
    if (sidebar) {
      sidebar.addEventListener('wheel', preventPropagation);
    }
    
    return () => {
      if (sidebar) {
        sidebar.removeEventListener('wheel', preventPropagation);
      }
    };
  }, []);
  
  // 获取alt文本的辅助函数
  const getAltText = (item: NavItem) => {
    // 如果是随机游戏链接，使用固定的alt文本
    if (item.isRandom) {
      return messages?.platforms?.random?.alt || "Random Game";
    }
    
    // 对于分类导航项，使用platforms中对应的alt文本
    if (item.key && messages?.platforms?.[item.key]?.alt) {
      return messages.platforms[item.key].alt;
    }
    
    // 默认使用label作为alt文本
    return typeof item.label === 'string' ? item.label : "Navigation item";
  };
  
  return (
    <aside className="hidden md:block md:w-48 md:fixed md:left-0 md:top-16 md:bottom-0 bg-white dark:bg-gray-800 shadow-md border-r border-gray-200 dark:border-gray-700">
      {/* 使用独立的滚动容器 */}
      <div 
        ref={sidebarRef}
        className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
        style={{ isolation: 'isolate' }} // 创建新的堆叠上下文
      >
        <div className="p-4">
          {navItems.map((item, index) => {
            const href = locale === 'en' ? item.href : `/${locale}${item.href}`;
            const isActive = pathname === href || pathname === `/${locale}${item.href}`;
            const linkClass = `flex items-start p-3 mb-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              isActive ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`;
            const altText = getAltText(item);
            
            // 如果是随机游戏链接，使用RandomGameLink组件
            if (item.isRandom) {
              return (
                <RandomGameLink 
                  key={index}
                  className={linkClass}
                  locale={locale}
                  title={altText} // 使用title属性作为tooltip
                >
                  <span className="text-base mr-1.5 flex-shrink-0" aria-hidden="true">{item.icon}</span>
                  <span className="font-medium text-sm leading-tight break-words">{item.label}</span>
                </RandomGameLink>
              );
            }
            
            // 普通链接
            return (
              <a 
                key={index} 
                href={href}
                className={linkClass}
                title={altText} // 使用title属性作为tooltip
                aria-label={altText} // 使用aria-label属性提高可访问性
              >
                <span className="text-base mr-1.5 flex-shrink-0" aria-hidden="true">{item.icon}</span>
                <span className="font-medium text-sm leading-tight break-words">{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
} 