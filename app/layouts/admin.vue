<template>
  <div class="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-800">
    <AppHeader class="flex-shrink-0" />
    <main class="flex-grow flex flex-col overflow-hidden relative">
      <div class="flex-grow bg-slate-50 text-slate-800 flex flex-col lg:flex-row relative overflow-hidden">
        
        <!-- Mobile/Tablet Sidebar Toggle Header -->
        <div class="flex-shrink-0 lg:hidden flex items-center gap-3 bg-white border-b border-slate-200 px-4 py-3 shadow-sm z-20">
          <button @click="isMobileSidebarOpen = true" class="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"></path>
              </svg>
            </div>
            <h2 class="font-bold text-slate-800 text-sm">เมนูจัดการระบบ</h2>
          </div>
        </div>

        <AdminSidebar class="flex-shrink-0" />
        <div class="flex-grow overflow-y-auto relative h-full">
          <slot />
        </div>
      </div>
    </main>
    <AppFooter class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
// Shared state for controlling the mobile sidebar drawer
const isMobileSidebarOpen = useState('mobileSidebarOpen', () => false)
</script>
