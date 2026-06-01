<template>
  <header class="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-sm px-6 py-4">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <!-- Minimal Formal Logo -->
      <NuxtLink to="/" class="flex items-center gap-2.5 hover:opacity-95 transition-opacity">
        <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20">
          <svg class="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h1 class="font-extrabold text-xl tracking-tight text-slate-800 flex items-center gap-2">
          Easy<span class="text-blue-600 font-medium">POS</span>
        </h1>
      </NuxtLink>

      <!-- Navigation Links -->
      <nav class="flex items-center gap-6">
        <!-- Displayed ONLY if logged in -->
        <template v-if="auth.isLoggedIn">
          <!-- Elegant Office Section Switcher Pill -->
          <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 shadow-inner">
            <!-- Front Office (POS) Link -->
            <NuxtLink 
              to="/pos" 
              class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5"
              :class="$route.path.startsWith('/pos') 
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/40' 
                : 'text-slate-500 hover:text-slate-800'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              ขายหน้าบ้าน
            </NuxtLink>
            
            <!-- Backoffice Link -->
            <NuxtLink 
              to="/admin" 
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5"
              :class="$route.path.startsWith('/admin') 
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/40' 
                : 'text-slate-500 hover:text-slate-800'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"></path>
              </svg>
              จัดการหลังบ้าน
            </NuxtLink>
          </div>
        </template>
        
        <!-- Displayed ONLY if NOT logged in -->
        <template v-else>
          <NuxtLink to="/login" class="text-sm font-semibold text-slate-655 hover:text-blue-600 transition-colors duration-200 border border-slate-200/80 px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300">
            เข้าสู่ระบบ
          </NuxtLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
// Access the global shared authentication state
const auth = useState('auth', () => ({
  isLoggedIn: false,
  user: null as any
}))

const handleSignOut = () => {
  auth.value.isLoggedIn = false
  auth.value.user = null
  navigateTo('/login')
}
</script>



