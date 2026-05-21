<template>
  <div ref="rootRef" class="relative">
    <button
      :id="id"
      type="button"
      :disabled="disabled"
      class="w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      :class="[
        disabled
          ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
          : 'border-slate-300 bg-white text-slate-800 focus:border-blue-500',
      ]"
      @click="toggleDropdown"
    >
      <span :class="selectedOption ? 'text-slate-800' : 'text-slate-400'">
        {{ selectedOption?.name || placeholder }}
      </span>
      <span
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
        :class="disabled ? 'text-slate-300' : 'text-slate-400'"
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
    </button>

    <div
      v-if="isOpen && !disabled"
      class="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg"
    >
      <div v-if="searchable" class="p-2 border-b border-slate-100">
        <input
          ref="searchInputRef"
          v-model="searchTerm"
          type="text"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          placeholder="พิมพ์เพื่อค้นหา..."
          @keydown.esc="closeDropdown"
        />
      </div>

      <ul class="max-h-56 overflow-auto py-1">
        <li>
          <button
            type="button"
            class="w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
            :class="!modelValue ? 'text-blue-600 font-semibold' : 'text-slate-600'"
            @click="selectValue('')"
          >
            {{ placeholder }}
          </button>
        </li>

        <li v-for="item in filteredOptions" :key="item.id">
          <button
            type="button"
            class="w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
            :class="modelValue === item.id ? 'text-blue-600 font-semibold' : 'text-slate-700'"
            @click="selectValue(item.id)"
          >
            {{ item.name }}
          </button>
        </li>

        <li v-if="filteredOptions.length === 0" class="px-3 py-2 text-sm text-slate-400">
          ไม่พบข้อมูล
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

interface DropdownOption {
  id: string
  name: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string
    options: DropdownOption[]
    placeholder?: string
    id?: string
    disabled?: boolean
    required?: boolean
    searchable?: boolean
  }>(),
  {
    placeholder: 'กรุณาเลือก',
    id: undefined,
    disabled: false,
    required: false,
    searchable: true,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const rootRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const searchTerm = ref('')

const selectedOption = computed(() =>
  props.options.find((item) => item.id === props.modelValue)
)

const filteredOptions = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase()
  if (!keyword) return props.options
  return props.options.filter((item) => item.name.toLowerCase().includes(keyword))
})

const closeDropdown = () => {
  isOpen.value = false
  searchTerm.value = ''
}

const toggleDropdown = async () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value && props.searchable) {
    await nextTick()
    searchInputRef.value?.focus()
  }
}

const selectValue = (value: string) => {
  emit('update:modelValue', value)
  closeDropdown()
}

const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target as Node
  if (!rootRef.value?.contains(target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>
