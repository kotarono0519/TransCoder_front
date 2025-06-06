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

const targetLanguages = computed(() => SUPPORTED_LANGUAGES)

let viewerInstance: any = null

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
    // CodeMirror を動的インポート
    const { EditorView, lineNumbers } = await import('@codemirror/view')
    const { EditorState } = await import('@codemirror/state')
    const { oneDark } = await import('@codemirror/theme-one-dark')
    const { javascript } = await import('@codemirror/lang-javascript')
    
    const extensions = [
      oneDark,
      javascript(),
      lineNumbers(),
      EditorView.editable.of(false), // 読み取り専用
      EditorView.theme({
        '&': {
          height: '100%',
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
          /* height: '100%' */
        },
        '.cm-scroller': {
          /* height: '100%' */
        }
      })
    ]

    const state = EditorState.create({
      doc: props.modelValue,
      extensions
    })

    viewerInstance = new EditorView({
      state,
      parent: viewerRef.value
    })
  } catch (error) {
    console.error('Failed to load CodeMirror:', error)
  }
})

onUnmounted(() => {
  viewerInstance?.destroy()
})

watch(() => props.modelValue, (newValue) => {
  if (viewerInstance && viewerInstance.state.doc.toString() !== newValue) {
    viewerInstance.dispatch({
      changes: {
        from: 0,
        to: viewerInstance.state.doc.length,
        insert: newValue
      }
    })
  }
})
</script>