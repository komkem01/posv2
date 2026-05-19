<template>
  <footer class="bg-white border-t border-slate-200/80 py-8 mt-auto flex-shrink-0">
    <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-slate-400 tracking-wide">&copy; 2026 EasyPOS. All rights reserved.</span>
      </div>
      <div class="flex items-center gap-6 text-xs text-slate-400 font-medium">
        <template v-if="auth.isLoggedIn">
          <NuxtLink to="/pos" class="hover:text-blue-600 transition-colors">ขายหน้าบ้าน (POS)</NuxtLink>
          <NuxtLink to="/admin" class="hover:text-blue-600 transition-colors">จัดการหลังบ้าน</NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="hover:text-blue-600 transition-colors">เข้าสู่ระบบ (Sign In)</NuxtLink>
        </template>
        <span class="hover:text-blue-600 transition-colors cursor-pointer select-none">Privacy Policy</span>
        <span class="hover:text-blue-600 transition-colors cursor-pointer select-none">Terms of Service</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Access the global shared authentication state
const auth = useState('auth', () => ({
  isLoggedIn: false,
  user: null as any
}))
</script>


