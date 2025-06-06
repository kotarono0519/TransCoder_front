<template>
  <div class="flex h-9 bg-vscode-tab border-b border-vscode-border">
    <div 
      v-for="tab in tabs" 
      :key="tab.id"
      @click="$emit('tab-click', tab.id)"
      :class="[
        'flex items-center px-4 py-2 border-r border-vscode-border cursor-pointer text-sm transition-colors min-w-0',
        tab.active 
          ? 'bg-vscode-bg text-vscode-text border-t-2 border-t-vscode-blue' 
          : 'text-vscode-textSecondary hover:text-vscode-text hover:bg-gray-700'
      ]"
    >
      <span class="mr-2">{{ tab.icon }}</span>
      <span class="truncate">{{ tab.name }}</span>
      <button 
        v-if="tab.closable"
        @click.stop="$emit('tab-close', tab.id)"
        class="ml-2 text-vscode-textSecondary hover:text-vscode-text hover:bg-gray-600 rounded p-1 flex-shrink-0"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <div class="flex-1 bg-vscode-tab"></div>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  id: string
  name: string
  icon: string
  active: boolean
  closable?: boolean
}

interface Props {
  tabs: Tab[]
}

interface Emits {
  (e: 'tab-click', id: string): void
  (e: 'tab-close', id: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>