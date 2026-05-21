<template>
  <!-- Left Sidebar with Accordion Menu -->
  <div>
    <!-- Mobile Backdrop -->
    <Transition name="fade">
      <div 
        v-if="isMobileSidebarOpen" 
        class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
        @click="isMobileSidebarOpen = false"
      ></div>
    </Transition>

    <div 
      class="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200/80 flex-shrink-0 flex flex-col justify-between z-40 shadow-xl lg:shadow-sm transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 overflow-y-auto"
      :class="isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="p-4 space-y-6">
        <!-- Mobile close button & branding -->
        <div class="lg:hidden flex items-center justify-between pb-4 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <svg class="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <span class="text-sm font-bold tracking-tight text-slate-800">Easy<span class="text-blue-600 font-medium">POS</span></span>
          </div>
          <button @click="isMobileSidebarOpen = false" class="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Sidebar Branding Info (Tablet display) -->
        <div class="hidden lg:block pb-4 border-b border-slate-100">
          <p class="text-[10px] uppercase font-bold tracking-wider text-slate-400">ผู้ใช้งานปัจจุบัน</p>
          <p class="text-xs font-bold text-slate-700 truncate">{{ auth.user?.email || '' }}</p>
          <p class="text-[10px] text-slate-400">ผู้ดูแลระบบ</p>
        </div>

      <!-- Navigation Menu -->
      <div class="space-y-2">
        <p class="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2.5">เมนูระบบ</p>
        
        <!-- Tab Dashboard -->
        <NuxtLink
          to="/admin"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
          :class="route.path === '/admin' 
            ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"></path>
          </svg>
          ภาพรวมระบบ (Dashboard)
        </NuxtLink>

        <!-- Section Title: Data Management -->
        <p class="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2.5 pt-2">จัดการข้อมูล</p>
        <div class="space-y-1">
          <!-- Manage Categories -->
          <NuxtLink
            to="/admin/categories"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
            :class="route.path === '/admin/categories' 
              ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
          >
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
            จัดการหมวดหมู่ (Categories)
          </NuxtLink>

          <!-- Manage Products -->
          <NuxtLink
            to="/admin/products"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
            :class="route.path === '/admin/products' 
              ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
          >
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            จัดการสินค้า
          </NuxtLink>

          <!-- Manage Stocks -->
          <NuxtLink
            to="/admin/stocks"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
            :class="route.path === '/admin/stocks' 
              ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
          >
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            จัดการสต็อกสินค้า
          </NuxtLink>

          <!-- Manage Add-ons -->
          <NuxtLink
            to="/admin/settings"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
            :class="route.path === '/admin/settings' 
              ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
          >
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            จัดการรายการเสริม (Add-ons)
          </NuxtLink>

        </div>
      </div>
    </div>

    <!-- Quick Action back to POS -->
    <div class="p-4 border-t border-slate-100">
      <NuxtLink 
        to="/pos" 
        class="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all font-bold text-xs"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        กลับหน้าขาย (EasyPOS)
      </NuxtLink>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'

const route = useRoute()

// Access the global shared auth state
const auth = useState('auth', () => ({
  isLoggedIn: false,
  user: null as any
}))

// Shared state for the drawer
const isMobileSidebarOpen = useState('mobileSidebarOpen', () => false)

// When route changes on mobile, close the sidebar
watch(() => route.fullPath, () => {
  isMobileSidebarOpen.value = false
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
