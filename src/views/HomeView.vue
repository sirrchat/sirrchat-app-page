<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

const faqItems = ref([
  { id: 1, open: false },
  { id: 2, open: false },
  { id: 3, open: false },
  { id: 4, open: false },
  { id: 5, open: false }
])

function toggleFaq(id) {
  const item = faqItems.value.find(i => i.id === id)
  if (item) item.open = !item.open
}
</script>

<template>
  <main>
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <span class="hero-badge">{{ t('hero.badge') }}</span>
          <h1 class="hero-title">{{ t('hero.title') }}</h1>
          <p class="hero-subtitle">{{ t('hero.subtitle') }}</p>
          <div class="hero-buttons">
            <a href="#download" class="btn btn-primary">{{ t('hero.downloadBtn') }}</a>
            <a href="#features" class="btn btn-secondary">{{ t('hero.learnMoreBtn') }}</a>
            <router-link to="/node" class="btn btn-outline">{{ t('hero.selfHostBtn') }}</router-link>
          </div>
        </div>
        <div class="hero-visual">
          <img src="/assets/app_frame_v2.png" alt="Sirr App" class="hero-app-screenshot">
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">{{ t('features.title') }}</h2>
          <p class="section-subtitle">{{ t('features.subtitle') }}</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">&#128274;</div>
            <h3 class="feature-title">{{ t('features.noserver.title') }}</h3>
            <p class="feature-desc">{{ t('features.noserver.desc') }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">&#127760;</div>
            <h3 class="feature-title">{{ t('features.selfhost.title') }}</h3>
            <p class="feature-desc">{{ t('features.selfhost.desc') }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">&#128279;</div>
            <h3 class="feature-title">{{ t('features.crossnode.title') }}</h3>
            <p class="feature-desc">{{ t('features.crossnode.desc') }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">&#128187;</div>
            <h3 class="feature-title">{{ t('features.opensource.title') }}</h3>
            <p class="feature-desc">{{ t('features.opensource.desc') }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">&#128272;</div>
            <h3 class="feature-title">{{ t('features.encryption.title') }}</h3>
            <p class="feature-desc">{{ t('features.encryption.desc') }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">&#128241;</div>
            <h3 class="feature-title">{{ t('features.multidevice.title') }}</h3>
            <p class="feature-desc">{{ t('features.multidevice.desc') }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">&#128737;</div>
            <h3 class="feature-title">{{ t('features.censorship.title') }}</h3>
            <p class="feature-desc">{{ t('features.censorship.desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works" id="how-it-works">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">{{ t('howItWorks.title') }}</h2>
        </div>
        <div class="content-text">
          <p>{{ t('howItWorks.content') }}</p>
        </div>
      </div>
    </section>

    <!-- Wallet Feature -->
    <section class="wallet-feature">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">{{ t('wallet.title') }}</h2>
        </div>
        <div class="content-text">
          <p>{{ t('wallet.content') }}</p>
        </div>
      </div>
    </section>

    <!-- Download Section -->
    <section class="download" id="download">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">{{ t('download.title') }}</h2>
          <p class="section-subtitle">{{ t('download.subtitle') }}</p>
        </div>
        <div class="download-buttons">
          <a href="#" class="download-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.523 2c1.116.943 1.477 2.786 1.477 4.286v11.428c0 1.5-.36 3.343-1.477 4.286L12 17.714V24l-7-4.286V4.286L12 0v6.286l5.523-4.286zM12 12.857l3.684 2.857V8.286L12 11.143v1.714z"/>
            </svg>
            <div class="download-btn-text">
              <small>Download for</small>
              <span>{{ t('download.android') }}</span>
            </div>
          </a>
          <a href="#" class="download-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div class="download-btn-text">
              <small>Download for</small>
              <span>{{ t('download.ios') }}</span>
            </div>
          </a>
          <a href="#" class="download-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div class="download-btn-text">
              <small>Download for</small>
              <span>{{ t('download.macos') }}</span>
            </div>
          </a>
          <a href="#" class="download-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
            </svg>
            <div class="download-btn-text">
              <small>Download for</small>
              <span>{{ t('download.windows') }}</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq" id="faq">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">{{ t('faq.title') }}</h2>
        </div>
        <div class="faq-list">
          <div v-for="item in faqItems" :key="item.id" class="faq-item" :class="{ active: item.open }">
            <button class="faq-question" @click="toggleFaq(item.id)">
              <span>{{ t(`faq.q${item.id}.question`) }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <div class="faq-answer">
              <p>{{ t(`faq.q${item.id}.answer`) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 6rem 2rem 4rem;
  background: linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-alt) 100%);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -25%;
  width: 80%;
  height: 150%;
  background: radial-gradient(ellipse, rgba(91, 141, 239, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(91, 141, 239, 0.1);
  color: var(--color-accent);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--color-text-light);
  margin-bottom: 2rem;
  max-width: 500px;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-app-screenshot {
  max-width: 100%;
  max-height: 600px;
  width: auto;
  height: auto;
  position: relative;
  z-index: 2;
}

/* Features Section */
.features {
  padding: 6rem 2rem;
  background: var(--color-bg);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.feature-card {
  background: var(--color-bg-alt);
  padding: 2rem;
  border-radius: var(--radius-lg);
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: var(--gradient-primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  font-size: 1.5rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.feature-desc {
  color: var(--color-text-light);
  font-size: 0.95rem;
}

/* How It Works & Wallet */
.how-it-works,
.wallet-feature {
  padding: 6rem 2rem;
  background: var(--color-bg-alt);
}

.content-text {
  margin-top: 2rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.content-text p {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--color-text-light);
  text-align: center;
}

/* Download Section */
.download {
  padding: 6rem 2rem;
  background: var(--gradient-primary);
  color: white;
  text-align: center;
}

.download .section-title {
  color: white;
}

.download .section-subtitle {
  color: rgba(255, 255, 255, 0.8);
}

.download-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  color: var(--color-text);
  padding: 1rem 1.75rem;
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.download-btn svg {
  width: 28px;
  height: 28px;
}

.download-btn-text {
  text-align: left;
}

.download-btn-text small {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-light);
  font-weight: 400;
}

.download-btn-text span {
  font-size: 1.125rem;
}

/* FAQ Section */
.faq {
  padding: 6rem 2rem;
  background: var(--color-bg);
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.faq-question {
  width: 100%;
  background: none;
  border: none;
  padding: 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 600;
  text-align: left;
  color: var(--color-text);
}

.faq-question svg {
  width: 24px;
  height: 24px;
  transition: transform 0.2s;
}

.faq-item.active .faq-question svg {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-item.active .faq-answer {
  max-height: 500px;
}

.faq-answer p {
  padding-bottom: 1.5rem;
  color: var(--color-text-light);
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-content {
    order: 1;
  }

  .hero-visual {
    order: 0;
    margin-bottom: 2rem;
  }

  .hero-subtitle {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-app-screenshot {
    max-height: 480px;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero {
    padding-top: 5rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
