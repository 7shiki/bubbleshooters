'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface NavItem {
  icon: string;
  label: string | React.ReactNode;
  href: string;
}

interface SidebarProps {
  navItems: NavItem[];
  locale: string;
}

export default function Sidebar({ navItems, locale }: SidebarProps) {
  const pathname = usePathname();
  
  return (
    <aside className="w-full md:w-48 md:sticky md:top-0 md:h-screen bg-white dark:bg-gray-800 shadow-md overflow-y-auto border-r border-gray-200 dark:border-gray-700">
      <div className="p-3">
        {navItems.map((item, index) => {
          const href = `/${locale}${item.href}`;
          const isActive = pathname === href || pathname === `/${locale}${item.href}`;
          
          return (
            <a 
              key={index} 
              href={href}
              className={`flex items-start p-3 mb-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <span className="text-base mr-1.5 flex-shrink-0">{item.icon}</span>
              <span className="font-medium text-m leading-tight break-words">{item.label}</span>
            </a>
          );
        })}
      </div>
    </aside>
  );
} 