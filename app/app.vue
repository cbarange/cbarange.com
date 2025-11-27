<template>
  <div class="relative min-h-screen">
    <!-- Background gradient layer -->
    <div class="fixed inset-0 z-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500" />
    <!-- Three.js particles -->
    <ClientOnly>
      <ParticleBackground />
    </ClientOnly>
    <!-- Content -->
    <div class="relative z-10">
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'font-sans'
  }
})
</script>
