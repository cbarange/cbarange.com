<template>
  <section class="relative min-h-screen md:h-screen md:overflow-hidden">
    <!-- Placeholder to reserve space when terminal is fixed -->
    <div v-if="phase !== 'complete'" class="h-24 md:h-32"></div>

    <!-- Terminal prompt - fixed during animation, static after -->
    <div
      ref="terminalRef"
      class="terminal-wrapper"
      :class="terminalWrapperClass"
      :style="phase !== 'complete' ? terminalStyle : undefined"
    >
      <!-- Inner wrapper for alignment when static -->
      <div :class="phase === 'complete' ? 'max-w-4xl w-full flex justify-between items-center' : ''">
        <div
          class="inline-block rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono"
          :class="terminalBoxClass"
          style="border-radius: 0.5rem; border: 1px solid #e2e8f0;"
        >
          <div class="flex items-center gap-3">
            <span class="text-green-500 dark:text-green-400">$</span>
            <span class="text-slate-700 dark:text-slate-300">{{ displayedText }}</span>
            <span
              class="cursor-blink transition-all duration-500"
              :class="[
                phase === 'centered' ? 'w-3 h-8' : 'w-2 h-5',
                phase === 'complete' ? 'opacity-0' : ''
              ]"
            ></span>
          </div>
        </div>
        <!-- Resume and theme toggle on the same row -->
        <div v-if="phase === 'complete'" class="flex items-center gap-2 animate-fade-in">
          <ResumeButton />
          <ThemeToggle />
        </div>
      </div>
    </div>

    <!-- Output content - appears after terminal moves -->
    <!-- md height: viewport minus the terminal row (74px), so fr rows only share the visible area -->
    <div
      v-if="phase === 'complete'"
      ref="contentRef"
      class="min-h-screen md:min-h-0 md:h-[calc(100vh-74px)] grid grid-rows-[auto_auto_auto_auto_auto] md:grid-rows-[0.25fr_1fr_0.25fr_0.9fr_0.1fr] px-6 sm:px-8 pt-8 pb-8 gap-10 md:gap-0"
      :style="scaleStyle"
    >
      <!-- Section 1: Name and tagline -->
      <div class="flex items-center justify-center">
        <div class="max-w-4xl w-full animate-slide-up opacity-0" style="animation-delay: 0.2s; animation-fill-mode: forwards;">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
            Clement Baranger
          </h1>
          <p class="mt-2 text-xl md:text-2xl font-medium h-8 md:h-10 flex items-center">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 dark:from-brand-400 dark:via-brand-300 dark:to-accent-400">{{ rotatingText }}</span>
            <Icon
              v-if="showVibeIcon"
              name="twemoji:smiling-face-with-sunglasses"
              class="w-6 h-6 md:w-7 md:h-7 ml-2"
            />
            <span class="inline-block w-0.5 h-6 md:h-7 bg-brand-500 dark:bg-brand-400 ml-1 align-middle animate-blink"></span>
          </p>
        </div>
      </div>

      <!-- Section 2: Description + work cards (appears after rotating text types first phrase ~2.5s) -->
      <!-- md:pb-8 keeps a gap above the contact button when fr rows collapse to their content height -->
      <div class="flex items-center justify-center md:pb-8">
        <div class="max-w-4xl w-full">
          <!-- Desktop: inline layout -->
          <p class="hidden md:block text-3xl md:text-4xl text-slate-600 dark:text-slate-400 animate-slide-up opacity-0" style="animation-delay: 1.5s; animation-duration: 0.8s; animation-fill-mode: forwards;">
            <span class="text-brand-600 dark:text-brand-400 font-semibold">Founder</span> of
            <a href="https://accessdevops.com" target="_blank" rel="noopener" class="link-underline text-slate-900 dark:text-white font-semibold hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              AccessDevOps
            </a>
            <span class="mx-2">·</span>
            <span class="text-accent-600 dark:text-accent-400 font-semibold">Creator</span> of
            <a href="https://s3explorer.accessdevops.com" target="_blank" rel="noopener" class="link-underline text-slate-900 dark:text-white font-semibold hover:text-accent-600 dark:hover:text-accent-400 transition-colors">
              S3 Explorer
            </a>
          </p>
          <!-- Mobile: stacked layout with bullets -->
          <div class="md:hidden flex flex-col gap-1 text-xl text-slate-600 dark:text-slate-400 animate-slide-up opacity-0" style="animation-delay: 1.5s; animation-duration: 0.8s; animation-fill-mode: forwards;">
            <p class="whitespace-nowrap">
              <span class="text-slate-400 dark:text-slate-500 mr-2">·</span>
              <span class="text-brand-600 dark:text-brand-400 font-semibold">Founder</span> of
              <a href="https://accessdevops.com" target="_blank" rel="noopener" class="link-underline text-slate-900 dark:text-white font-semibold hover:text-brand-600 dark:hover:text-brand-400 transition-colors">AccessDevOps</a>
            </p>
            <p class="whitespace-nowrap">
              <span class="text-slate-400 dark:text-slate-500 mr-2">·</span>
              <span class="text-accent-600 dark:text-accent-400 font-semibold">Creator</span> of
              <a href="https://s3explorer.accessdevops.com" target="_blank" rel="noopener" class="link-underline text-slate-900 dark:text-white font-semibold hover:text-accent-600 dark:hover:text-accent-400 transition-colors">S3 Explorer</a>
            </p>
          </div>
          <div class="mt-12">
            <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 animate-slide-up opacity-0" style="animation-delay: 2.1s; animation-duration: 0.5s; animation-fill-mode: forwards;">
              Find my work
            </h2>
            <div class="grid gap-5 sm:grid-cols-2">
              <div
                v-for="(link, index) in workLinks"
                :key="link.href"
                class="animate-slide-up opacity-0"
                :class="{ 'sm:col-span-2 sm:flex sm:justify-center': index === 2 }"
                :style="{ animationDelay: `${2.5 + index * 0.25}s`, animationDuration: '0.5s', animationFillMode: 'forwards' }"
              >
                <div class="animate-gentle-shake h-full" :class="index === 2 ? 'sm:w-1/2' : 'w-full'" :style="{ animationDelay: `${index * 0.9}s` }">
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
          </div>
        </div>
      </div>

      <!-- Section 3: Contact -->
      <div class="flex items-center justify-center">
        <div class="max-w-4xl w-full">
          <div class="flex justify-center animate-slide-up opacity-0" style="animation-delay: 3.1s; animation-duration: 0.5s; animation-fill-mode: forwards;">
            <button
              type="button"
              class="group relative inline-flex items-center gap-4 px-4 py-3 sm:px-6 sm:py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 cursor-pointer"
              @click="copyEmail"
            >
              <!-- Gradient glow effect -->
              <div class="absolute inset-0 rounded-2xl blur-xl transition-opacity duration-300 opacity-40 group-hover:opacity-85 -z-10 bg-gradient-to-br from-brand-400 to-accent-500"></div>
              <Icon name="heroicons:envelope-20-solid" class="w-6 h-6 text-brand-500 dark:text-brand-400" />
              <span class="text-slate-900 dark:text-white font-semibold text-xs sm:text-base">{{ contactEmail }}</span>
              <Icon
                :name="emailCopied ? 'heroicons:check-20-solid' : 'heroicons:clipboard-document-20-solid'"
                class="w-6 h-6 transition-all duration-300"
                :class="emailCopied ? 'text-green-500' : 'text-slate-400 group-hover:text-brand-500 dark:group-hover:text-brand-400'"
              />
              <!-- Toast notification -->
              <span
                class="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold whitespace-nowrap transition-all duration-300 shadow-lg"
                :class="emailCopied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'"
              >
                Email copied!
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Section 4: More to explore -->
      <div class="flex items-start justify-center pt-10">
        <div class="max-w-4xl w-full">
          <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6 animate-slide-up opacity-0" style="animation-delay: 3.7s; animation-duration: 0.5s; animation-fill-mode: forwards;">
            More to explore
          </h2>
          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="(link, index) in exploreLinks"
              :key="link.href"
              class="animate-slide-up opacity-0"
              :style="{ animationDelay: `${4 + index * 0.25}s`, animationDuration: '0.5s', animationFillMode: 'forwards' }"
            >
              <LinkCard
                :href="link.href"
                :icon="link.icon"
                :title="link.title"
                :description="link.description"
                :variant="link.variant"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Section 5: Spacer (invisible) -->
      <div></div>
    </div>
  </section>
</template>

<script setup lang="ts">
type Phase = 'centered' | 'moving' | 'complete'

const emit = defineEmits<{
  'animation-complete': []
}>()

const fullText = 'whoami'
const displayedText = ref('')
const phase = ref<Phase>('centered')
const typingSpeed = 100 // ms per character
const terminalRef = ref<HTMLElement | null>(null)
const transitionsEnabled = ref(false)

// Scale-to-fit: ensures all content is visible on small-height viewports
const contentRef = ref<HTMLElement | null>(null)
const contentScale = ref(1)

const scaleStyle = computed(() => {
  if (contentScale.value >= 1) return {}
  return {
    transform: `scale(${contentScale.value})`,
    transformOrigin: 'top center'
  }
})

function updateScale() {
  // Only apply on md+ where overflow-hidden clips content
  if (!contentRef.value || window.innerWidth < 768) {
    contentScale.value = 1
    return
  }
  const el = contentRef.value
  // Temporarily override the md height and the fr rows so rows size to their content
  // (with an auto height, fr rows inflate proportionally and overestimate it)
  el.style.height = 'auto'
  el.style.gridTemplateRows = 'auto'
  const naturalH = el.scrollHeight
  el.style.height = '' // restore the md height from CSS class
  el.style.gridTemplateRows = ''
  // The terminal row sits above the content and takes part of the viewport
  const availableH = window.innerHeight - el.offsetTop
  contentScale.value = Math.min(1, availableH / naturalH)
}

watch(phase, (newPhase) => {
  if (newPhase === 'complete') nextTick(updateScale)
})

// Rotating tagline
const rotatingPhrases = [
  'Developer • Founder • Builder',
  'DevOps Consultant & AI Enthusiast',
  'ideas are cheap • execution is everything',
  'Professional Vibe Coder'
]
const rotatingText = ref('')
const currentPhraseIndex = ref(0)

// Show icon when "Professional Vibe Coder" is fully typed
const showVibeIcon = computed(() => rotatingText.value === 'Professional Vibe Coder')

// Contact
const contactEmail = 'clement.baranger@accessdevops.com'
const emailCopied = ref(false)

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(contactEmail)
    emailCopied.value = true
    setTimeout(() => {
      emailCopied.value = false
    }, 2000)
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = contactEmail
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    emailCopied.value = true
    setTimeout(() => {
      emailCopied.value = false
    }, 2000)
  }
}

// Work links
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
    variant: 'purple' as const
  }
]

// Explore links
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

function startRotatingAnimation() {
  const typeSpeed = 50
  const deleteSpeed = 30
  const pauseAfterType = 4000
  const pauseAfterDelete = 300

  function typePhrase(phrase: string, index: number, callback: () => void) {
    if (index <= phrase.length) {
      rotatingText.value = phrase.substring(0, index)
      setTimeout(() => typePhrase(phrase, index + 1, callback), typeSpeed + Math.random() * 30)
    } else {
      setTimeout(callback, pauseAfterType)
    }
  }

  function deletePhrase(callback: () => void) {
    if (rotatingText.value.length > 0) {
      rotatingText.value = rotatingText.value.substring(0, rotatingText.value.length - 1)
      setTimeout(() => deletePhrase(callback), deleteSpeed)
    } else {
      setTimeout(callback, pauseAfterDelete)
    }
  }

  function animateNext() {
    const phrase = rotatingPhrases[currentPhraseIndex.value]!
    typePhrase(phrase, 0, () => {
      deletePhrase(() => {
        currentPhraseIndex.value = (currentPhraseIndex.value + 1) % rotatingPhrases.length
        animateNext()
      })
    })
  }

  animateNext()
}

// Compute terminal wrapper classes based on phase
const terminalWrapperClass = computed(() => {
  if (phase.value !== 'complete') {
    // During animation: fixed positioning
    return [
      'fixed z-40',
      transitionsEnabled.value ? 'transition-all duration-[2000ms] ease-in-out' : ''
    ]
  }
  // After animation: static positioning, centered like content
  // pt-6 (1.5rem) matches the fixed position's top: 1.5rem
  return 'flex justify-center px-6 pt-6'
})

// Compute terminal box classes based on phase
const terminalBoxClass = computed(() => {
  if (phase.value !== 'complete') {
    return [
      transitionsEnabled.value ? 'transition-all duration-[2000ms] ease-in-out' : '',
      phase.value === 'centered' ? 'px-8 py-5 text-2xl md:text-3xl' : 'px-4 py-3 text-sm md:text-base'
    ]
  }
  return 'px-4 py-3 text-sm md:text-base'
})

// Compute terminal position based on phase
const terminalStyle = computed(() => {
  if (phase.value === 'centered') {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  } else {
    // Move diagonally to top-left, aligned with centered content (max-w-4xl)
    // Left edge = viewport center - half of max-w-4xl (56rem/2 = 28rem)
    // top: 1.5rem matches the theme toggle position (top-6)
    return {
      top: '1.5rem',
      left: 'max(1.5rem, calc(50% - 28rem))',
      transform: 'translate(0, 0)'
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScale)
})

onMounted(() => {
  window.addEventListener('resize', updateScale)

  // Enable transitions after initial render to prevent visual glitches
  nextTick(() => {
    transitionsEnabled.value = true
  })

  // Start typing after initial delay
  setTimeout(() => {
    let index = 0

    const typeNextChar = () => {
      if (index < fullText.length) {
        displayedText.value += fullText[index]
        index++
        setTimeout(typeNextChar, typingSpeed + Math.random() * 60)
      } else {
        // Typing complete - simulate "enter" press
        setTimeout(() => {
          phase.value = 'moving'
          // After move animation completes (2000ms), show content
          setTimeout(() => {
            phase.value = 'complete'
            emit('animation-complete')
            // Start rotating tagline animation after a short delay
            setTimeout(startRotatingAnimation, 500)
          }, 2200)
        }, 800)
      }
    }

    typeNextChar()
  }, 800)
})
</script>
