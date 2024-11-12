import OpenAI from 'openai'

const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY

if (!apiKey) {
  throw new Error('Missing DeepSeek API Key')
}

const client = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://api.deepseek.com/v1',
  dangerouslyAllowBrowser: true
})

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

const systemPrompt = {
  role: 'system' as const,
  content: `你是一位专注于培养大学生思辨能力的助教...`
}

export async function chatWithAI(
  messages: Message[],
  onProgress?: (content: string) => void
) {
  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [systemPrompt, ...messages],
      temperature: 0.7,
      max_tokens: 2000,
      stream: true
    })

    let fullContent = ''
    
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || ''
      fullContent += content
      onProgress?.(fullContent)
    }

    return {
      role: 'assistant' as const,
      content: fullContent
    }
  } catch (error) {
    console.error('AI API 调用错误:', error)
    throw error
  }
} 