<template>
  <button
    @click="toggleColorMode"
    class="relative flex p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all duration-300 group"
    :aria-label="colorMode.preference === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <Icon
      :name="colorMode.value === 'dark' ? 'heroicons:sun-20-solid' : 'heroicons:moon-20-solid'"
      class="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
    />
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

function toggleColorMode() {
  // Tells the head script in nuxt.config.ts to keep this choice for the tab
  window.sessionStorage?.setItem('theme-manual', '1')
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
