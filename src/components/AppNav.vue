<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t, locale } = useI18n()
const route = useRoute()

const mobileNavOpen = ref(false)
const langDropdownOpen = ref(false)

const languages = [
  { code: 'en', flag: '🇺🇸', name: 'English', short: 'EN' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية', short: 'AR' },
  { code: 'zh', flag: '🇨🇳', name: '中文', short: '中' },
  { code: 'ja', flag: '🇯🇵', name: '日本語', short: '日' },
  { code: 'ko', flag: '🇰🇷', name: '한국어', short: '한' }
]

const currentLang = () => languages.find(l => l.code === locale.value) || languages[0]

function setLanguage(code) {
  locale.value = code
  localStorage.setItem('lang', code)
  langDropdownOpen.value = false
}

function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value
}

function toggleLangDropdown() {
  langDropdownOpen.value = !langDropdownOpen.value
}

function closeMobileNav() {
  mobileNavOpen.value = false
}
</script>

<template>
  <nav class="nav">
    <div class="nav-container">
      <router-link to="/" class="nav-logo">
        <img src="/assets/identity.svg" alt="Sirr Logo">
        <span>Sirr</span>
      </router-link>

      <ul class="nav-links">
        <li><router-link to="/#features">{{ t('nav.features') }}</router-link></li>
        <li><router-link to="/#how-it-works">{{ t('nav.howItWorks') }}</router-link></li>
        <li><router-link to="/#faq">{{ t('nav.faq') }}</router-link></li>
        <li><a href="http://docs.mailcoin.org/" target="_blank">{{ t('nav.docs') }}</a></li>
        <li><router-link to="/node-registry">{{ t('nav.nodeRegistry') }}</router-link></li>
        <li><router-link to="/#download" class="nav-cta">{{ t('nav.download') }}</router-link></li>
      </ul>

      <div class="lang-switcher" :class="{ active: langDropdownOpen }">
        <button class="lang-btn" @click="toggleLangDropdown">
          <span class="lang-current-flag">{{ currentLang().flag }}</span>
          <span class="lang-current-name">{{ currentLang().short }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        <div class="lang-dropdown">
          <div
            v-for="lang in languages"
            :key="lang.code"
            class="lang-option"
            :class="{ active: locale === lang.code }"
            @click="setLanguage(lang.code)"
          >
            <span class="lang-flag">{{ lang.flag }}</span>
            <span>{{ lang.name }}</span>
          </div>
        </div>
      </div>

      <button class="nav-menu-btn" @click="toggleMobileNav">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
    </div>

    <div class="nav-mobile" :class="{ active: mobileNavOpen }">
      <router-link to="/#features" @click="closeMobileNav">{{ t('nav.features') }}</router-link>
      <router-link to="/#how-it-works" @click="closeMobileNav">{{ t('nav.howItWorks') }}</router-link>
      <router-link to="/#faq" @click="closeMobileNav">{{ t('nav.faq') }}</router-link>
      <a href="http://docs.mailcoin.org/" target="_blank" @click="closeMobileNav">{{ t('nav.docs') }}</a>
      <router-link to="/node-registry" @click="closeMobileNav">{{ t('nav.nodeRegistry') }}</router-link>
      <router-link to="/#download" @click="closeMobileNav">{{ t('nav.download') }}</router-link>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--color-text);
}

.nav-logo img {
  width: 36px;
  height: 36px;
}

.nav-logo span {
  font-size: 1.25rem;
  font-weight: 700;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  list-style: none;
}

.nav-links a {
  text-decoration: none;
  color: var(--color-text-light);
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--color-text);
}

.nav-cta {
  background: var(--gradient-primary);
  color: white !important;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-lg);
  font-weight: 600 !important;
}

.nav-cta:hover {
  opacity: 0.9;
}

.nav-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.nav-menu-btn svg {
  width: 24px;
  height: 24px;
  stroke: var(--color-text);
}

/* Language Switcher */
.lang-switcher {
  position: relative;
  margin-left: 1rem;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-bg-alt);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  transition: all 0.2s;
}

.lang-btn:hover {
  border-color: var(--color-primary-2);
}

.lang-btn svg {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}

.lang-switcher.active .lang-btn svg {
  transform: rotate(180deg);
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 140px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s;
  z-index: 100;
  overflow: hidden;
}

.lang-switcher.active .lang-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.875rem;
}

.lang-option:hover {
  background: var(--color-bg-alt);
}

.lang-option.active {
  background: var(--color-bg-alt);
  font-weight: 600;
}

.lang-flag {
  font-size: 1.25rem;
}

/* Mobile Nav */
.nav-mobile {
  display: none;
  position: fixed;
  top: 68px;
  left: 0;
  right: 0;
  background: white;
  padding: 1rem;
  box-shadow: var(--shadow-lg);
  z-index: 999;
}

.nav-mobile.active {
  display: block;
}

.nav-mobile a {
  display: block;
  padding: 0.75rem 1rem;
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  border-radius: var(--radius-sm);
}

.nav-mobile a:hover {
  background: var(--color-bg-alt);
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .nav-menu-btn {
    display: block;
  }

  .lang-switcher {
    margin-left: 0;
    margin-right: 0.5rem;
  }
}
</style>
