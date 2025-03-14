'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchBarProps {
  onSearch?: (query: string) => void
  defaultValue?: string
  initialMessages: any
}

export default function SearchBar({ onSearch, defaultValue = '', initialMessages }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const messages = initialMessages.search || {
    searchTip: 'Search for games',
    placeholder: 'Search Retro Games ...',
    clearSearch: 'Clear search',
    search: 'Search'
  }

  // 当 defaultValue 改变时更新输入框的值
  useEffect(() => {
    setQuery(defaultValue)
  }, [defaultValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleClear = () => {
    setQuery('')
    onSearch?.('')
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex w-full">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={messages.placeholder}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-purple-500/30 rounded-l-lg focus:outline-none focus:border-purple-500 dark:text-white pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1"
              title={messages.clearSearch}
            >
              ×
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-3 py-2 bg-purple-500 text-white rounded-r-lg hover:bg-purple-600 transition-colors flex items-center justify-center"
          title={messages.search}
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}