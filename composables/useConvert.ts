import type { ConvertRequest, ConvertResponse } from '~/types'

interface UseConvertOptions {
  baseUrl?: string
}

export const useConvert = (options: UseConvertOptions = {}) => {
  const { baseUrl = 'http://localhost:8000' } = options
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  const result = ref<string>('')

  const convert = async (request: ConvertRequest): Promise<string> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<ConvertResponse>(`${baseUrl}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: request
      })
      
      result.value = response.translated_code
      return response.translated_code
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || 'Conversion failed'
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