<template>
  <div class="flex flex-col min-h-screen bg-slate-50 text-slate-800">
    <AppHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>


