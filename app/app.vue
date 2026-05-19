<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <AppLoading />
    <NuxtPage />
    <AppToast />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { showLoading, hideLoading } = useLoading()

const router = useRouter()
router.beforeEach(() => { showLoading() })
router.afterEach(() => { setTimeout(hideLoading, 250) })
</script>
