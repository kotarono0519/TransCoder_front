<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-600">
      <div class="flex flex-col">
        <label class="text-xs text-gray-400 mb-1">To</label>
        <LanguageSelect
          v-model="internalLanguage"
          :languages="targetLanguages"
          class="w-36"
        />
      </div>
      <button
        @click="copyToClipboard"
        :disabled="!modelValue.trim()"
        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Copy
      </button>
    </div>
    <div ref="viewerRef" class="flex-1" />
  </div>
</template>

<script setup lang="ts">
import { SUPPORTED_LANGUAGES } from '~/types'
import type { Language } from '~/types'

interface Props {
  modelValue: string
  language: string
}

interface Emits {
  (e: 'copy-success'): void
  (e: 'copy-error'): void
  (e: 'update:language', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  language: 'python'
})

const emit = defineEmits<Emits>()

const viewerRef = ref<HTMLElement>()
const internalLanguage = computed({
  get: () => props.language,
  set: (value) => emit('update:language', value)
})

const targetLanguages = computed(() => SUPPORTED_LANGUAGES.filter(lang => lang.value !== 'auto'))

let viewer: any = null
let monaco: any = null

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.modelValue)
    emit('copy-success')
  } catch (error) {
    emit('copy-error')
  }
}

onMounted(async () => {
  if (!viewerRef.value || !process.client) return

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

    viewer = monaco.editor.create(viewerRef.value, {
      value: props.modelValue,
      language: props.language,
      theme: 'dark-theme',
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
      readOnly: true
    })
  } catch (error) {
    console.error('Failed to load Monaco Editor:', error)
  }
})

onUnmounted(() => {
  viewer?.dispose()
})

watch(() => props.modelValue, (newValue) => {
  if (viewer) {
    viewer.setValue(newValue)
  }
})

watch(() => props.language, (newLang) => {
  if (viewer && monaco) {
    const model = viewer.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, newLang)
    }
  }
})
</script>