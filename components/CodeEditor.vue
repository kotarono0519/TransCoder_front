<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-600">
      <div class="flex flex-col">
        <label class="text-xs text-gray-400 mb-1">From</label>
        <LanguageSelect
          v-model="sourceLanguage"
          :languages="sourceLanguages"
          class="w-36"
        />
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
  targetLanguage: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'convert', data: { sourceLanguage: string, sourceCode: string }): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  targetLanguage: 'python'
})

const emit = defineEmits<Emits>()

const editorRef = ref<HTMLElement>()
const sourceLanguage = ref('auto')

const sourceLanguages = computed(() => SUPPORTED_LANGUAGES)
const targetLanguages = computed(() => SUPPORTED_LANGUAGES.filter(lang => lang.value !== 'auto'))

let editorView: any = null

const handleConvert = () => {
  if (props.modelValue.trim()) {
    emit('convert', {
      sourceLanguage: sourceLanguage.value,
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
    // CodeMirror を動的インポート
    const { EditorView } = await import('@codemirror/view')
    const { EditorState } = await import('@codemirror/state')
    const { oneDark } = await import('@codemirror/theme-one-dark')
    const { javascript } = await import('@codemirror/lang-javascript')
    
    const extensions = [
      oneDark,
      javascript(),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const newValue = update.state.doc.toString()
          emit('update:modelValue', newValue)
        }
      }),
      EditorView.theme({
        '&': {
          fontSize: '14px',
          fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace'
        },
        '.cm-content': {
          padding: '12px',
          minHeight: '200px'
        },
        '.cm-focused': {
          outline: 'none'
        },
        '.cm-editor': {
          height: '100%'
        },
        '.cm-scroller': {
          height: '100%'
        }
      })
    ]

    const state = EditorState.create({
      doc: props.modelValue,
      extensions
    })

    editorView = new EditorView({
      state,
      parent: editorRef.value
    })

    document.addEventListener('keydown', handleKeydown)
  } catch (error) {
    console.error('Failed to load CodeMirror:', error)
  }
})

onUnmounted(() => {
  editorView?.destroy()
  document.removeEventListener('keydown', handleKeydown)
})

watch(() => props.modelValue, (newValue) => {
  if (editorView && editorView.state.doc.toString() !== newValue) {
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: newValue
      }
    })
  }
})
</script>