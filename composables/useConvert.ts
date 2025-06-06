import type { ConvertRequest, GeminiResponse } from '~/types'

interface UseConvertOptions {
  apiKey?: string
}

export const useConvert = (options: UseConvertOptions = {}) => {
  const { apiKey = '' } = options
  const config = useRuntimeConfig()
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  const result = ref<string>('')

  const convert = async (request: ConvertRequest): Promise<string> => {
    loading.value = true
    error.value = null
    
    try {
      // APIキーが設定されていない場合のエラー
      const actualApiKey = apiKey || config.public.palmApiKey
      if (!actualApiKey) {
        throw new Error('API key is required. Please set PALM_API_KEY environment variable or create a .env file.')
      }

      // プロンプトを構築
      const prompt = `あなたは熟練のプログラマーです。

以下の ${request.source_language === 'auto' ? '言語' : request.source_language} のコードを、可能な限り読みやすく、自然な形で ${request.target_language} に書き換えてください。

- コメントは元のコードにある場合のみ維持してください
- 追加の説明や出力は不要です。**コードのみ**出力してください
- 必要に応じて idiomatic（その言語らしい）書き方に変えてください

元のコード:
\`\`\`
${request.code}
\`\`\``

      // Gemini API呼び出し
      const response = await $fetch<GeminiResponse>('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        query: {
          key: actualApiKey
        },
        body: {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192
          }
        }
      })

      // レスポンスからコードを抽出
      if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        let translatedCode = response.candidates[0].content.parts[0].text.trim()
        
        // コードブロックのマークダウンを除去
        translatedCode = translatedCode.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '')
        
        result.value = translatedCode
        return translatedCode
      } else {
        throw new Error('Invalid response from Gemini API')
      }
    } catch (err: any) {
      let errorMessage = 'Conversion failed'
      
      if (err?.data?.error?.message) {
        errorMessage = `Gemini API Error: ${err.data.error.message}`
      } else if (err?.message) {
        errorMessage = err.message
      }
      
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    loading.value = false
    error.value = null
    result.value = ''
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    result: readonly(result),
    convert,
    reset
  }
}