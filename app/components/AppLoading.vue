<template>
  <Transition name="loading-fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
    >
      <!-- Spinner -->
      <div class="relative flex items-center justify-center">
        <!-- Outer ring -->
        <div class="w-16 h-16 rounded-full border-4 border-slate-100"></div>
        <!-- Spinning arc -->
        <div class="absolute w-16 h-16 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
        <!-- Inner dot -->
        <div class="absolute w-5 h-5 bg-blue-600 rounded-full opacity-20 animate-ping"></div>
        <div class="absolute w-3 h-3 bg-blue-600 rounded-full"></div>
      </div>

      <!-- Brand + Label -->
      <div class="mt-6 text-center">
        <p class="text-base font-extrabold text-slate-800 tracking-tight">
          Easy<span class="text-blue-600">POS</span>
        </p>
        <p class="text-xs text-slate-400 mt-1 font-medium">กำลังโหลด...</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { isLoading } = useLoading()
</script>

<style scoped>
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.2s ease;
}
.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}
</style>
