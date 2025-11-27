<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="group relative flex items-center gap-4 transition-all duration-500 cursor-pointer"
    :class="cardClasses"
  >
    <!-- Gradient glow effect for large cards -->
    <div
      v-if="size === 'lg'"
      class="absolute inset-0 rounded-2xl blur-xl transition-opacity duration-300 opacity-40 group-hover:opacity-85 -z-10"
      :class="glowClass"
    ></div>

    <div
      class="flex items-center justify-center rounded-xl transition-all duration-300"
      :class="[
        iconBgClass,
        size === 'lg' ? 'w-14 h-14' : 'w-12 h-12'
      ]"
    >
      <Icon :name="icon" :class="[iconClass, size === 'lg' ? 'w-7 h-7' : 'w-6 h-6']" />
    </div>
    <div class="flex-1 min-w-0">
      <h3
        class="font-bold text-slate-900 dark:text-white transition-colors"
        :class="[
          size === 'lg' ? 'text-xl mb-0.5' : 'text-base',
          titleHoverClass
        ]"
      >
        {{ title }}
      </h3>
      <p
        class="text-slate-600 dark:text-slate-400 font-medium"
        :class="size === 'lg' ? 'text-sm' : 'text-sm truncate'"
      >
        {{ description }}
      </p>
    </div>
    <Icon
      name="heroicons:arrow-up-right-20-solid"
      class="transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      :class="[
        size === 'lg' ? 'w-6 h-6' : 'w-5 h-5',
        arrowClass
      ]"
    />
  </a>
</template>

<script setup lang="ts">
interface Props {
  href: string
  icon: string
  title: string
  description: string
  variant?: 'default' | 'github' | 'medium' | 'brand' | 'accent' | 'linkedin' | 'twitter' | 'malt'
  size?: 'default' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default'
})

const cardClasses = computed(() => {
  if (props.size === 'lg') {
    return 'bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 hover:shadow-2xl border border-slate-200 dark:border-slate-700'
  }
  return 'rounded-xl glass-card hover:shadow-md hover:border-brand-300 dark:hover:border-brand-600 p-4 hover:-translate-y-0.5'
})

const glowClass = computed(() => {
  const classes: Record<string, string> = {
    default: 'bg-gradient-to-br from-slate-400 to-slate-600',
    brand: 'bg-gradient-to-br from-brand-400 to-brand-600',
    accent: 'bg-gradient-to-br from-accent-400 to-accent-600',
    github: 'bg-gradient-to-br from-slate-400 to-slate-600',
    medium: 'bg-gradient-to-br from-slate-400 to-slate-600',
    linkedin: 'bg-gradient-to-br from-[#0A66C2] to-[#004182]',
    twitter: 'bg-gradient-to-br from-slate-400 to-slate-600',
    malt: 'bg-gradient-to-br from-[#FC5656] to-[#e04545]'
  }
  return classes[props.variant]
})

const titleHoverClass = computed(() => {
  if (props.size === 'lg') {
    const classes: Record<string, string> = {
      default: 'group-hover:text-slate-700 dark:group-hover:text-slate-200',
      brand: 'group-hover:text-brand-600 dark:group-hover:text-brand-400',
      accent: 'group-hover:text-accent-600 dark:group-hover:text-accent-400',
      github: 'group-hover:text-slate-700 dark:group-hover:text-slate-200',
      medium: 'group-hover:text-slate-700 dark:group-hover:text-slate-200',
      linkedin: 'group-hover:text-[#0A66C2] dark:group-hover:text-[#4d9ae8]',
      twitter: 'group-hover:text-slate-700 dark:group-hover:text-slate-200',
      malt: 'group-hover:text-[#FC5656] dark:group-hover:text-[#ff7a7a]'
    }
    return classes[props.variant]
  }
  return 'group-hover:text-brand-600 dark:group-hover:text-brand-400'
})

const arrowClass = computed(() => {
  if (props.size === 'lg') {
    const classes: Record<string, string> = {
      default: 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300',
      brand: 'text-brand-300 group-hover:text-brand-600 dark:text-brand-700 dark:group-hover:text-brand-400',
      accent: 'text-accent-300 group-hover:text-accent-600 dark:text-accent-700 dark:group-hover:text-accent-400',
      github: 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300',
      medium: 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300',
      linkedin: 'text-[#0A66C2]/40 group-hover:text-[#0A66C2]',
      twitter: 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300',
      malt: 'text-[#FC5656]/40 group-hover:text-[#FC5656]'
    }
    return classes[props.variant]
  }
  return 'text-slate-400 group-hover:text-brand-500 dark:group-hover:text-brand-400'
})

const iconBgClass = computed(() => {
  const classes: Record<string, string> = {
    default: 'bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700',
    github: 'bg-slate-900 dark:bg-slate-100 group-hover:bg-slate-800 dark:group-hover:bg-slate-200',
    medium: 'bg-slate-900 dark:bg-slate-100 group-hover:bg-slate-800 dark:group-hover:bg-slate-200',
    brand: 'bg-brand-100 dark:bg-brand-900/50 group-hover:bg-brand-200 dark:group-hover:bg-brand-800/50',
    accent: 'bg-accent-100 dark:bg-accent-900/50 group-hover:bg-accent-200 dark:group-hover:bg-accent-800/50',
    linkedin: 'bg-[#0A66C2] group-hover:bg-[#004182]',
    twitter: 'bg-slate-900 dark:bg-slate-100 group-hover:bg-slate-800 dark:group-hover:bg-slate-200',
    malt: 'bg-[#FC5656] group-hover:bg-[#e04545]'
  }
  return classes[props.variant]
})

const iconClass = computed(() => {
  const classes: Record<string, string> = {
    default: 'text-slate-600 dark:text-slate-400',
    github: 'text-white dark:text-slate-900',
    medium: 'text-white dark:text-slate-900',
    brand: 'text-brand-600 dark:text-brand-400',
    accent: 'text-accent-600 dark:text-accent-400',
    linkedin: 'text-white',
    twitter: 'text-white dark:text-slate-900',
    malt: 'text-white'
  }
  return classes[props.variant]
})
</script>
