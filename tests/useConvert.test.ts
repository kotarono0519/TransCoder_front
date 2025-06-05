import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, readonly } from 'vue'
import { useConvert } from '~/composables/useConvert'

// Mock $fetch
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

// Mock Vue composables
vi.stubGlobal('ref', ref)
vi.stubGlobal('readonly', readonly)

describe('useConvert', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('successfully converts code', async () => {
    const mockResponse = { translated_code: 'print("Hello World")' }
    mockFetch.mockResolvedValue(mockResponse)

    const { convert, loading, result } = useConvert()
    
    expect(loading.value).toBe(false)

    const convertPromise = convert({
      source_language: 'javascript',
      target_language: 'python',
      code: 'console.log("Hello World")'
    })

    expect(loading.value).toBe(true)

    const translatedCode = await convertPromise

    expect(loading.value).toBe(false)
    expect(translatedCode).toBe('print("Hello World")')
    expect(result.value).toBe('print("Hello World")')
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        source_language: 'javascript',
        target_language: 'python',
        code: 'console.log("Hello World")'
      }
    })
  })

  it('handles conversion error', async () => {
    const mockError = new Error('API Error')
    mockFetch.mockRejectedValue(mockError)

    const { convert, loading, error } = useConvert()

    await expect(convert({
      source_language: 'javascript',
      target_language: 'python',
      code: 'invalid code'
    })).rejects.toThrow('API Error')

    expect(loading.value).toBe(false)
    expect(error.value).toBe('API Error')
  })

  it('resets state correctly', () => {
    const { reset, loading, error, result } = useConvert()
    
    // Manually set some state
    loading.value = true
    error.value = 'Some error'
    result.value = 'Some result'

    reset()

    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
    expect(result.value).toBe('')
  })
})