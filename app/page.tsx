'use client'

import { useState } from 'react'
import Link from 'next/link'
import ChatModal from './components/ChatModal'

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 导航栏 */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              AI Chat
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              登录
            </Link>
            <Link 
              href="/signup" 
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              注册
            </Link>
          </div>
        </div>
      </nav>

      {/* 主要内容区 */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-blue-900 bg-clip-text text-transparent">
            智能对话，改变未来
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            体验下一代 AI 对话助手，让智能科技为您开启无限可能
          </p>
          <div className="mt-10">
            <button
              onClick={() => setIsChatOpen(true)}
              className="inline-flex items-center px-8 py-3 rounded-full text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 transition-opacity"
            >
              开始对话
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* 特性展示 */}
        <div className="mt-32 max-w-7xl mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="relative p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 聊天框组件 */}
      <ChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </main>
  )
}

const features = [
  {
    title: "智能对话",
    description: "基于最新的 AI 技术，提供流畅自然的对话体验",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
      </svg>
    )
  },
  {
    title: "多场景应用",
    description: "从日常对话到专业咨询，满足您的各类需求",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    )
  },
  {
    title: "安全可靠",
    description: "采用先进的加密技术，保护您的隐私和数据安全",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    )
  }
]
