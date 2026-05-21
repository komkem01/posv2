<template>
  <dialog
    ref="dialogRef"
    class="m-0 h-screen max-h-none max-w-none w-screen bg-transparent p-4 backdrop:bg-slate-950/45 backdrop:backdrop-blur-[2px]"
    @close="emit('close')"
  >
    <div class="flex min-h-full items-center justify-center">
      <div
        :class="[
          'relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10',
          maxWidthClass,
        ]"
      >
        <div v-if="showAccent" class="h-1.5 w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400"></div>
        <div class="p-6 sm:p-7">
          <slot />
        </div>
      </div>
    </div>
    <form method="dialog" class="fixed inset-0 -z-10" @click="onBackdropClick">
      <button aria-label="close modal" class="h-full w-full cursor-default"></button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    maxWidthClass?: string
    closeOnBackdrop?: boolean
    showAccent?: boolean
  }>(),
  {
    maxWidthClass: 'max-w-md',
    closeOnBackdrop: true,
    showAccent: true,
  }
)

const emit = defineEmits<{
  close: []
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

const open = () => {
  if (!dialogRef.value || dialogRef.value.open) return
  dialogRef.value.showModal()
}

const close = () => {
  if (!dialogRef.value || !dialogRef.value.open) return
  dialogRef.value.close()
}

const onBackdropClick = () => {
  if (!props.closeOnBackdrop) return
  close()
}

defineExpose({
  open,
  close,
})
</script>