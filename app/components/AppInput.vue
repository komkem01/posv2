<template>
  <div class="w-full">
    <label v-if="label" class="block text-xs font-bold text-slate-500 mb-1">
      {{ label }}
    </label>
    <div class="relative">
      <div v-if="$slots.prefix" class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <slot name="prefix"></slot>
      </div>
      <input
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        :placeholder="placeholder"
        class="w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        :class="[
          $slots.prefix ? 'pl-10 pr-4' : 'px-4',
          inputClass
        ]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string | number;
  type?: string;
  placeholder?: string;
  label?: string;
  inputClass?: string;
}>(), {
  type: 'text',
  placeholder: '',
  label: '',
  inputClass: 'py-2.5 text-sm'
});

defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'focus', event: Event): void;
  (e: 'blur', event: Event): void;
}>();
</script>
