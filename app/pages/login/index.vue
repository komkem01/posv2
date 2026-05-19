<template>
  <div
    class="h-screen w-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4"
  >
    <!-- Soft blue glowing ambient background -->
    <div
      class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"
    ></div>

    <div
      class="relative max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/50"
    >
      <!-- Brand Logo & Header -->
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
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
        <div class="text-center space-y-2">
          <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight">
            เข้าสู่ระบบ EasyPOS
          </h1>
        </div>
        <p class="text-xs text-slate-400 max-w-xs mx-auto">
          กรอกข้อมูลเพื่อเข้าใช้งานระบบขายหน้าร้านและควบคุมระบบหลังบ้าน
        </p>
      </div>

      <!-- Login Form -->
      <form class="space-y-4" @submit.prevent="handleLogin">
        <div class="space-y-3.5">
          <!-- Email Input -->
          <div>
            <label
              for="email"
              class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
              >ที่อยู่อีเมล (Email)</label
            >
            <div class="relative">
              <span
                class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none"
              >
                <svg
                  class="h-4 w-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 11-18 0h2"
                  ></path>
                </svg>
              </span>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="admin@easypos.com"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label
              for="password"
              class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
              >รหัสผ่าน (Password)</label
            >
            <div class="relative">
              <span
                class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none"
              >
                <svg
                  class="h-4 w-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </span>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                placeholder="••••••••••••"
              />
            </div>
          </div>
        </div>

        <div class="pt-1">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform active:scale-[0.98] shadow-sm shadow-blue-500/10 disabled:opacity-50"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              กำลังเข้าสู่ระบบ...
            </span>
            <span v-else>เข้าสู่ระบบ (Sign In)</span>
          </button>
        </div>
      </form>

      <!-- Demo Account Prompt -->
      <div class="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1 items-center">
        <p class="font-bold mb-1 text-slate-700">ข้อมูลสำหรับทดสอบเข้าสู่ระบบ</p>
        <div><strong>อีเมล:</strong> admin@easypos.com</div>
        <div><strong>รหัสผ่าน:</strong> password</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Disable the default layout to hide the header and footer on this page
definePageMeta({
  layout: false,
});

const email = ref("admin@easypos.com");
const password = ref("password");

const { isLoading, showLoading, hideLoading } = useLoading();

// Use global shared Nuxt state for simulated authentication status
const auth = useState("auth", () => ({
  isLoggedIn: false,
  user: null as any,
}));

const handleLogin = async () => {
  showLoading();

  // Simulate network request delay
  setTimeout(() => {
    hideLoading();
    auth.value.isLoggedIn = true;
    auth.value.user = { email: email.value, role: "admin" };

    // Redirect to EasyPOS terminal
    navigateTo("/pos");
  }, 1000);
};
</script>
