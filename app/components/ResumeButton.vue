<template>
  <button
    ref="triggerRef"
    type="button"
    class="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all duration-300 group"
    aria-haspopup="dialog"
    aria-label="View resume"
    @click="isOpen = true"
  >
    <Icon
      name="heroicons:document-text-20-solid"
      class="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
    />
    <!-- Icon only on the narrowest phones, where the label would touch the prompt -->
    <span class="max-[359px]:hidden text-sm font-medium leading-5 text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Resume</span>
  </button>

  <!-- Teleported: the hero content uses transforms and stacking contexts -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        ref="dialogRef"
        class="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-6 bg-slate-950/70 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Resume of Clement Baranger"
        @click.self="isOpen = false"
        @keydown.esc="isOpen = false"
        @keydown.tab="trapFocus"
      >
        <div class="flex flex-col w-full max-w-3xl max-h-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl">
          <header class="flex items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-3 font-mono text-sm">
            <div class="hidden sm:flex items-center gap-3 min-w-0">
              <span class="text-green-500 dark:text-green-400">$</span>
              <span class="truncate text-slate-700 dark:text-slate-300">cat resume.pdf</span>
            </div>
            <div class="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto font-sans">
              <a
                href="/Clement-Baranger-Resume.pdf"
                download="Clement-Baranger-Resume.pdf"
                class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors"
              >
                <Icon name="heroicons:arrow-down-tray-20-solid" class="w-5 h-5" />
                Download PDF
              </a>
              <button
                ref="closeRef"
                type="button"
                class="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Close resume"
                @click="isOpen = false"
              >
                <Icon name="heroicons:x-mark-20-solid" class="w-5 h-5 block" />
              </button>
            </div>
          </header>
          <div class="min-h-0 overflow-y-auto overscroll-contain bg-white">
            <!-- width/height reserve the page ratio while the image loads -->
            <img
              src="/resume-preview.png"
              width="1530"
              height="1980"
              alt="One-page resume of Clement Baranger, Lead DevSecOps. Download the PDF for the full text and links."
              class="block w-full h-auto"
            >
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const dialogRef = ref<HTMLElement | null>(null)
const closeRef = ref<HTMLElement | null>(null)

watch(isOpen, async (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    await nextTick()
    closeRef.value?.focus()
  } else {
    triggerRef.value?.focus()
  }
})

// Keep keyboard focus inside the dialog (it only holds two focusable controls)
function trapFocus(event: KeyboardEvent) {
  const focusable = dialogRef.value?.querySelectorAll<HTMLElement>('a[href], button')
  if (!focusable?.length) return
  const first = focusable[0]!
  const last = focusable[focusable.length - 1]!
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>
