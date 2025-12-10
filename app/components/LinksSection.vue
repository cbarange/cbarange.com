<template>
  <div class="space-y-10">
    <!-- Find my work section -->
    <div>
      <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
        Find my work
      </h2>
      <div class="grid gap-5 sm:grid-cols-2">
        <div
          v-for="link in workLinks"
          :key="link.href"
          class="animate-gentle-shake h-full"
        >
          <LinkCard
            :href="link.href"
            :icon="link.icon"
            :title="link.title"
            :description="link.description"
            :variant="link.variant"
            size="lg"
            class="h-full"
          />
        </div>
      </div>
    </div>

    <!-- More to explore section -->
    <div>
      <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
        More to explore
      </h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LinkCard
          v-for="link in exploreLinks"
          :key="link.href"
          :href="link.href"
          :icon="link.icon"
          :title="link.title"
          :description="link.description"
          :variant="link.variant"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const workLinks = [
  {
    href: 'https://accessdevops.com',
    icon: 'heroicons:building-office-2-20-solid',
    title: 'AccessDevOps',
    description: 'DevOps hosting & consulting company',
    variant: 'brand' as const
  },
  {
    href: 'https://s3explorer.accessdevops.com',
    icon: 'heroicons:circle-stack-20-solid',
    title: 'S3 Explorer',
    description: 'Best Bucket-type S3 UI tool',
    variant: 'accent' as const
  },
  {
    href: 'https://s2tui.accessdevops.com/',
    icon: 'heroicons:microphone-20-solid',
    title: 'S2Tui',
    description: 'Speech to Text, 100% offline & private',
    variant: 'accent' as const
  }
]

const exploreLinks = [
  {
    href: 'https://github.com/cbarange',
    icon: 'mdi:github',
    title: 'GitHub (Personal)',
    description: '@cbarange',
    variant: 'github' as const
  },
  {
    href: 'https://github.com/AccessDevops',
    icon: 'mdi:github',
    title: 'GitHub (AccessDevOps)',
    description: '@AccessDevops',
    variant: 'github' as const
  },
  {
    href: 'https://medium.com/@cbarange.dev',
    icon: 'mdi:medium',
    title: 'Medium',
    description: 'Technical articles & insights',
    variant: 'medium' as const
  },
  {
    href: 'https://x.com/cbarange_dev',
    icon: 'mdi:twitter',
    title: 'X (Twitter)',
    description: '@cbarange_dev',
    variant: 'twitter' as const
  },
  {
    href: 'https://www.linkedin.com/in/cl%C3%A9ment-baranger/',
    icon: 'mdi:linkedin',
    title: 'LinkedIn',
    description: 'Connect with me',
    variant: 'linkedin' as const
  },
  {
    href: 'https://www.malt.fr/profile/clementbaranger',
    icon: 'heroicons:briefcase-20-solid',
    title: 'Malt',
    description: 'Hire me as a freelancer',
    variant: 'malt' as const
  }
]
</script>
