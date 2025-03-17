'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { FaSearch, FaTimes } from 'react-icons/fa'

interface SearchBarProps {
  onSearch: (query: string) => void
  defaultValue?: string
  initialMessages: any
}

export default function SearchBar({ onSearch, defaultValue = '', initialMessages }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(defaultValue)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const isInternalUpdate = useRef(false)
  const prevDefaultValue = useRef(defaultValue)

  // 当默认值变化时更新搜索词，但避免循环更新
  useEffect(() => {
    // 只有当默认值真正变化且不是内部更新时才更新状态
    if (defaultValue !== prevDefaultValue.current && !isInternalUpdate.current) {
      setSearchTerm(defaultValue)
      prevDefaultValue.current = defaultValue
    }
  }, [defaultValue]) // 移除 searchTerm 依赖，避免循环更新

  // 处理输入变化
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
  }, [])

  // 处理提交
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)
  }, [searchTerm, onSearch])

  // 处理清除
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡
    
    // 标记这是内部更新，避免与外部更新冲突
    isInternalUpdate.current = true
    
    // 先更新内部状态
    setSearchTerm('')
    
    // 使用 setTimeout 确保状态更新后再通知父组件
    setTimeout(() => {
      // 通知父组件搜索已清除
      onSearch('')
      
      // 聚焦输入框
      if (inputRef.current) {
        inputRef.current.focus()
      }
      
      // 重置内部更新标记
      setTimeout(() => {
        isInternalUpdate.current = false
      }, 0)
    }, 0)
  }, [onSearch])

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative flex items-center w-full max-w-xl mx-auto transition-all duration-300"
    >
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={initialMessages?.searchBar?.placeholder || "Search Bubble Games..."}
          className="w-full py-3 pl-12 pr-10 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FaSearch className="text-gray-400" />
        </div>
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <FaTimes className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="ml-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
      >
        {initialMessages?.searchBar?.search || "Search"}
      </button>
    </form>
  )
}