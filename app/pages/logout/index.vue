<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm font-semibold">
    กำลังออกจากระบบ...
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const { clearSession } = useAuth();

clearSession();
await navigateTo("/login");
</script>
