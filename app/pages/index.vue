<template>
  <div></div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: [
    () => navigateTo('/login')
  ]
})
</script>

<style scoped>
/* Clears HMR compiler styles */
</style>