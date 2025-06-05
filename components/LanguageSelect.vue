<template>
  <div class="relative">
    <select
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option
        v-for="language in languages"
        :key="language.value"
        :value="language.value"
      >
        {{ language.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { Language } from '~/types'

interface Props {
  modelValue: string
  languages: Language[]
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>