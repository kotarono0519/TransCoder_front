<template>
  <div class="h-screen bg-gray-900 text-white overflow-hidden">
    <header class="border-b border-gray-700 p-4">
      <h1 class="text-xl font-bold">TransCoder - Code Translation Tool</h1>
    </header>
    
    <main class="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
      <!-- Left Pane - Source Code Editor -->
      <div class="w-full lg:w-1/2 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-gray-700">
        <CodeEditor
          v-model="sourceCode"
          :loading="loading"
          :target-language="targetLanguage"
          @convert="handleConvert"
        />
      </div>
      
      <!-- Right Pane - Translated Code Viewer -->
      <div class="w-full lg:w-1/2 h-1/2 lg:h-full">
        <CodeViewer
          v-model:language="targetLanguage"
          :model-value="translatedCode"
          @copy-success="showCopySuccess"
          @copy-error="showCopyError"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue3-toastify'
import type { ConvertRequest } from '~/types'

const sourceCode = ref('')
const translatedCode = ref('')
const targetLanguage = ref('python')

const { convert, loading } = useConvert()

const handleConvert = async ({ sourceLanguage, sourceCode: code }: { sourceLanguage: string, sourceCode: string }) => {
  try {
    const result = await convert({
      source_language: sourceLanguage,
      target_language: targetLanguage.value,
      code
    })
    translatedCode.value = result
    toast.success('Code converted successfully!')
  } catch (error: any) {
    toast.error(error.message || 'Conversion failed')
  }
}

const showCopySuccess = () => {
  toast.success('Code copied to clipboard!')
}

const showCopyError = () => {
  toast.error('Failed to copy code')
}
</script>
