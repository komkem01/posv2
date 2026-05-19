<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full sm:w-80">
    <TransitionGroup 
      name="toast-slide"
      tag="div"
      class="flex flex-col gap-2.5 w-full"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto w-full bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xl shadow-slate-200/60 flex gap-3 items-center transform transition-all duration-300"
      >
        <!-- Icon based on toast type -->
        <div class="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border" :class="iconBgClass[toast.type]">
          <svg v-if="toast.type === 'success'" class="w-4.5 h-4.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
          <svg v-else-if="toast.type === 'error'" class="w-4.5 h-4.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <svg v-else-if="toast.type === 'warning'" class="w-4.5 h-4.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <svg v-else class="w-4.5 h-4.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>

        <!-- Message -->
        <div class="flex-grow">
          <p class="text-xs font-bold text-slate-800 leading-snug">{{ toast.message }}</p>
        </div>

        <!-- Close Button -->
        <button @click="removeToast(toast.id)" class="text-slate-350 hover:text-slate-500 transition-colors flex-shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts, removeToast } = useToast()

const iconBgClass = {
  success: 'bg-emerald-50 border-emerald-100/55',
  error: 'bg-rose-50 border-rose-100/55',
  warning: 'bg-amber-50 border-amber-100/55',
  info: 'bg-blue-50 border-blue-100/55'
}
</script>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
}
</style>
