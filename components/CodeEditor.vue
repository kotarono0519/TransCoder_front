<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-600">
      <div class="flex space-x-4">
        <div class="flex flex-col">
          <label class="text-xs text-gray-400 mb-1">From</label>
          <LanguageSelect
            v-model="sourceLanguage"
            :languages="sourceLanguages"
            class="w-36"
          />
        </div>
        <div class="flex flex-col">
          <label class="text-xs text-gray-400 mb-1">To</label>
          <LanguageSelect
            v-model="targetLanguage"
            :languages="targetLanguages"
            class="w-36"
          />
        </div>
      </div>
      <button
        @click="handleConvert"
        :disabled="loading || !modelValue.trim()"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Converting...' : 'Convert' }}
      </button>
    </div>
    <div ref="editorRef" class="flex-1" />
  </div>
</template>

<script setup lang="ts">
import { SUPPORTED_LANGUAGES } from '~/types'
import type { Language } from '~/types'

interface Props {
  modelValue: string
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'convert', data: { sourceLanguage: string, targetLanguage: string, sourceCode: string }): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

const editorRef = ref<HTMLElement>()
const sourceLanguage = ref('auto')
const targetLanguage = ref('python')

const sourceLanguages = computed(() => SUPPORTED_LANGUAGES)
const targetLanguages = computed(() => SUPPORTED_LANGUAGES.filter(lang => lang.value !== 'auto'))

let editor: any = null
let monaco: any = null

const handleConvert = () => {
  if (props.modelValue.trim()) {
    emit('convert', {
      sourceLanguage: sourceLanguage.value,
      targetLanguage: targetLanguage.value,
      sourceCode: props.modelValue
    })
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault()
    handleConvert()
  }
}

onMounted(async () => {
  if (!editorRef.value || !process.client) return

  try {
    // Dynamically import Monaco Editor only on client side
    const { default: loader } = await import('@monaco-editor/loader')
    const monacoModule = await import('monaco-editor')
    
    loader.config({ monaco: monacoModule })
    monaco = await loader.init()

    monaco.editor.defineTheme('dark-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1f2937',
        'editor.lineHighlightBackground': '#374151'
      }
    })

    editor = monaco.editor.create(editorRef.value, {
      value: props.modelValue,
      language: 'javascript',
      theme: 'dark-theme',
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace'
    })

    editor.onDidChangeModelContent(() => {
      const value = editor?.getValue() || ''
      emit('update:modelValue', value)
    })

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, handleConvert)

    document.addEventListener('keydown', handleKeydown)
  } catch (error) {
    console.error('Failed to load Monaco Editor:', error)
  }
})

onUnmounted(() => {
  editor?.dispose()
  document.removeEventListener('keydown', handleKeydown)
})

watch(() => props.modelValue, (newValue) => {
  if (editor && editor.getValue() !== newValue) {
    editor.setValue(newValue)
  }
})

watch(sourceLanguage, (newLang) => {
  if (editor && monaco && newLang !== 'auto') {
    const model = editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, newLang)
    }
  }
})
</script>