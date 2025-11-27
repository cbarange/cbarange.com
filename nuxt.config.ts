// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Static site generation for Netlify
  ssr: true,
  nitro: {
    preset: 'static',
    output: {
      dir: 'dist',
      publicDir: 'dist'
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@nuxtjs/sitemap'
  ],

  site: {
    url: 'https://cbarange.com',
    name: 'Clement Baranger'
  },

  routeRules: {
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
      }
    }
  },

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark'
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Clement Baranger — Developer • Founder • Builder',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Clement Baranger — Software Developer, Founder of AccessDevOps, Creator of S3 Explorer. DevOps Consultant & AI Enthusiast. Ideas are cheap, execution is everything.'
        },
        { name: 'author', content: 'Clement Baranger' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#3b82f6' },
        // Google Search Console verification (replace YOUR_VERIFICATION_CODE)
        // { name: 'google-site-verification', content: 'YOUR_VERIFICATION_CODE' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://cbarange.com' },
        { property: 'og:title', content: 'Clement Baranger — Developer • Founder • Builder' },
        {
          property: 'og:description',
          content: 'Software Developer, Founder of AccessDevOps, Creator of S3 Explorer. DevOps Consultant & AI Enthusiast.'
        },
        { property: 'og:image', content: 'https://cbarange.com/og-image.png' },
        { property: 'og:site_name', content: 'Clement Baranger' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Clement Baranger — Developer • Founder • Builder' },
        {
          name: 'twitter:description',
          content: 'Software Developer, Founder of AccessDevOps, Creator of S3 Explorer. DevOps Consultant & AI Enthusiast.'
        },
        { name: 'twitter:image', content: 'https://cbarange.com/og-image.png' }
      ],
      script: [
        // Google Analytics (gtag.js)
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-G1DXQH3Q8V',
          async: true
        },
        {
          innerHTML: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-G1DXQH3Q8V');`
        }
      ],
      link: [
        { rel: 'canonical', href: 'https://cbarange.com' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'preload',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
          as: 'style'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'
        }
      ]
    }
  }
})
