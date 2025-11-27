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
            description: 'Founder of AccessDevOps, Creator of S3 Explorer. DevOps Consultant & AI Enthusiast.',
            email: 'clement.baranger@accessdevops.com',
            sameAs: [
              'https://github.com/cbarange',
              'https://github.com/AccessDevops',
              'https://medium.com/@cbarange.dev',
              'https://www.linkedin.com/in/cbarange',
              'https://x.com/cbarange_dev'
            ],
            worksFor: { '@id': 'https://cbarange.com/#organization' },
            knowsAbout: ['DevOps', 'Software Development', 'Cloud Computing', 'AI', 'S3', 'AWS']
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
          }
        ]
      })
    }
  ]
})
</script>
