import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import routes from './router'
import en from './locales/en.json'
import zh from './locales/zh.json'
import ar from './locales/ar.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import './styles/main.css'

// Router
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// i18n
const savedLang = localStorage.getItem('lang') || 'en'
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: savedLang,
  fallbackLocale: 'en',
  messages: { en, zh, ar, ja, ko }
})

// Create App
const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
