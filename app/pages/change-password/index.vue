<template>
  <div
    class="h-screen w-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4"
  >
    <div
      class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"
    ></div>

    <div
      class="relative max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/50"
    >
      <div class="text-center space-y-3">
        <div
          class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 shadow-md shadow-blue-500/20 mx-auto"
        >
          <svg
            class="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            ></path>
          </svg>
        </div>
        <div class="text-center space-y-2">
          <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">
            เปลี่ยนรหัสผ่าน
          </h1>
        </div>
        <p class="text-xs text-slate-400 max-w-xs mx-auto">
          เพื่อความปลอดภัย กรุณาตั้งรหัสผ่านใหม่ก่อนเข้าใช้งานระบบ
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="submitChangePassword">
        <div class="space-y-3.5">
          <div>
            <label
              for="new-password"
              class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
              >รหัสผ่านใหม่</label
            >
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </span>
              <input
                id="new-password"
                v-model="newPassword"
                type="password"
                minlength="8"
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                placeholder="อย่างน้อย 8 ตัวอักษร"
              />
            </div>
          </div>

          <div>
            <label
              for="confirm-password"
              class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
              >ยืนยันรหัสผ่านใหม่</label
            >
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </span>
              <input
                id="confirm-password"
                v-model="confirmPassword"
                type="password"
                minlength="8"
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
              />
            </div>
          </div>
        </div>

        <div class="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          แนะนำ: ใช้อักษรพิมพ์เล็ก-ใหญ่ ตัวเลข และสัญลักษณ์ เพื่อเพิ่มความปลอดภัย
        </div>

        <div class="pt-1">
          <button
            :disabled="isSaving"
            type="submit"
            class="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform active:scale-[0.98] shadow-sm shadow-blue-500/10 disabled:opacity-50"
          >
            <span v-if="isSaving">กำลังบันทึก...</span>
            <span v-else>บันทึกรหัสผ่านใหม่</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'

definePageMeta({
  middleware: ['auth']
})

const { auth } = useAuth()
const { post } = useApi()
const { showToast } = useToast()
const route = useRoute()

const newPassword = ref('')
const confirmPassword = ref('')
const isSaving = ref(false)

onMounted(() => {
  if (!auth.value.user?.mustChangePassword) {
    navigateTo((route.query.next as string) || '/pos')
  }
})

const submitChangePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    showToast('ยืนยันรหัสผ่านใหม่ไม่ตรงกัน', 'error')
    return
  }

  isSaving.value = true
  try {
    await post('/api/v1/store/staff/change-password', {
      new_password: newPassword.value,
    })
    if (auth.value.user) auth.value.user.mustChangePassword = false
    showToast('เปลี่ยนรหัสผ่านสำเร็จ', 'success')
    await navigateTo((route.query.next as string) || '/pos')
  } catch (e: any) {
    showToast(e?.data?.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ', 'error')
  } finally {
    isSaving.value = false
  }
}
</script>
