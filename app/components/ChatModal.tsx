'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Message, chatWithAI } from '../services/ai'

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

// 在文件顶部添加类型定义
interface CodeProps {
  node?: any
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

export default function ChatModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 创建新对话
  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: '新对话',
      messages: [],
      createdAt: new Date()
    }
    setConversations(prev => [newConversation, ...prev])
    setCurrentConversation(newConversation)
  }

  // 初始化第一个对话
  useEffect(() => {
    if (conversations.length === 0) {
      createNewConversation()
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentConversation?.messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !currentConversation) return

    const userMessage: Message = { role: 'user', content: input }
    const newTitle = input.slice(0, 20) + (input.length > 20 ? '...' : '')
    
    // 更新当前对话和标题
    setCurrentConversation(prev => {
      if (!prev) return null
      return {
        ...prev,
        title: newTitle,
        messages: [...prev.messages, userMessage]
      }
    })
    
    // 同时更新 conversations 列表中的对话标题
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversation.id 
        ? { ...conv, title: newTitle }
        : conv
    ))
    
    setInput('')
    setIsLoading(true)

    try {
      // 创建临时响应
      setCurrentConversation(prev => {
        if (!prev) return null
        return {
          ...prev,
          messages: [...prev.messages, { role: 'assistant', content: '' }]
        }
      })

      // 使用流式响应
      await chatWithAI([...currentConversation.messages, userMessage], (content) => {
        setCurrentConversation(prev => {
          if (!prev) return null
          const newMessages = [...prev.messages]
          const lastMessage = newMessages[newMessages.length - 1]
          if (lastMessage.role === 'assistant') {
            lastMessage.content = content
          }
          return {
            ...prev,
            messages: newMessages
          }
        })
      })

    } catch (error) {
      console.error('对话错误:', error)
      setCurrentConversation(prev => {
        if (!prev) return null
        return {
          ...prev,
          messages: [...prev.messages, {
            role: 'assistant',
            content: '抱歉，我遇到了一些问题。请稍后再试。'
          }]
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 添加删除对话的函数
  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡，避免触发对话选择
    
    // 如果要删除的是当前对话，先切换到其他对话
    if (currentConversation?.id === id) {
      const otherConversation = conversations.find(conv => conv.id !== id)
      setCurrentConversation(otherConversation || null)
    }
    
    setConversations(prev => prev.filter(conv => conv.id !== id))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-5xl h-[600px] rounded-2xl flex shadow-xl mx-4">
        {/* 侧边栏 - 移除顶部的新建对话按钮 */}
        <div className={`${showSidebar ? 'w-64' : 'w-0'} transition-all duration-300 border-r flex flex-col bg-gray-50`}>
          {/* 直接显示对话列表 */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => (
              <div
                key={conv.id}
                className={`group relative flex items-center hover:bg-gray-100 transition-colors ${
                  currentConversation?.id === conv.id ? 'bg-gray-200' : ''
                }`}
              >
                <button
                  onClick={() => setCurrentConversation(conv)}
                  className="flex-1 text-left p-3 pr-12"
                >
                  <div className="font-medium truncate">{conv.title}</div>
                  <div className="text-xs text-gray-500">
                    {conv.createdAt.toLocaleDateString()}
                  </div>
                </button>
                <button
                  onClick={(e) => deleteConversation(conv.id, e)}
                  className="absolute right-2 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  title="删除对话"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-4 h-4"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" 
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 主聊天区域 */}
        <div className="flex-1 flex flex-col">
          {/* 聊天框头部 */}
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="mr-3 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <h3 className="text-lg font-semibold">
                {currentConversation?.title || 'AI 助手'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 聊天内容区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!currentConversation?.messages.length ? (
              <div className="text-center text-gray-500 mt-8">
                开始新的对话吧！
              </div>
            ) : (
              <>
                {currentConversation.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="markdown-body prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code({ node, inline, className, children, ...props }: CodeProps) {
                                return (
                                  <code
                                    className={`${className || ''} ${
                                      inline ? 'bg-gray-200 rounded px-1' : 'block bg-gray-800 text-white p-2 rounded-lg'
                                    }`}
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                )
                              },
                              a: ({ ...props }) => (
                                <a
                                  {...props}
                                  className="text-blue-600 hover:underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                />
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* 输入区域 */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={createNewConversation}
                className="px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="新对话"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-6 h-6"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M12 4.5v15m7.5-7.5h-15" 
                  />
                </svg>
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入您的问题..."
                disabled={isLoading}
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                发送
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 