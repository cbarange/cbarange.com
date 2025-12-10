<template>
  <div class="relative">
    <!-- Main content -->
    <main>
      <HeroSection />
    </main>
  </div>
</template>

<script setup lang="ts">

// JSON-LD structured data for SEO
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Person',
            '@id': 'https://cbarange.com/#person',
            name: 'Clement Baranger',
            url: 'https://cbarange.com',
            jobTitle: 'Software Developer & DevOps Consultant',
            description: 'Founder of AccessDevOps, Creator of S3 Explorer & S2Tui. DevOps Consultant & AI Enthusiast.',
            email: 'clement.baranger@accessdevops.com',
            sameAs: [
              'https://github.com/cbarange',
              'https://github.com/AccessDevops',
              'https://medium.com/@cbarange.dev',
              'https://www.linkedin.com/in/cbarange',
              'https://x.com/cbarange_dev'
            ],
            worksFor: { '@id': 'https://cbarange.com/#organization' },
            knowsAbout: ['DevOps', 'Software Development', 'Cloud Computing', 'AI', 'S3', 'GCP', 'Speech Recognition', 'Voice Technology']
          },
          {
            '@type': 'Organization',
            '@id': 'https://cbarange.com/#organization',
            name: 'AccessDevOps',
            url: 'https://accessdevops.com',
            logo: 'https://accessdevops.com/logo.png',
            founder: { '@id': 'https://cbarange.com/#person' },
            description: 'DevOps consulting and software development services.'
          },
          {
            '@type': 'WebSite',
            '@id': 'https://cbarange.com/#website',
            url: 'https://cbarange.com',
            name: 'Clement Baranger',
            description: 'Personal website of Clement Baranger - Software Developer & DevOps Consultant',
            publisher: { '@id': 'https://cbarange.com/#person' }
          },
          {
            '@type': 'SoftwareApplication',
            '@id': 'https://cbarange.com/#s3explorer',
            name: 'S3 Explorer',
            url: 'https://s3explorer.accessdevops.com',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web',
            description: 'Best Bucket-type S3 UI tool for managing AWS S3 buckets',
            author: { '@id': 'https://cbarange.com/#person' },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD'
            }
          },
          {
            '@type': 'SoftwareApplication',
            '@id': 'https://cbarange.com/#s2tui',
            name: 'S2Tui',
            url: 'https://s2tui.accessdevops.com/',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: ['Windows', 'macOS', 'Linux'],
            description: 'Speech to Text desktop application, 100% offline & private. Free and open-source voice transcription tool.',
            author: { '@id': 'https://cbarange.com/#person' },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD'
            }
          }
        ]
      })
    }
  ]
})
</script>
