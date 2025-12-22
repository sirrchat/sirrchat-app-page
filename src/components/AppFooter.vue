<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">
            <img src="/assets/identity.svg" alt="Sirr Logo">
            <span>Sirr</span>
          </div>
          <p class="footer-desc">{{ t('footer.desc') }}</p>
        </div>
        <div>
          <h4 class="footer-title">{{ t('footer.product') }}</h4>
          <ul class="footer-links">
            <li><router-link to="/#features">{{ t('nav.features') }}</router-link></li>
            <li><router-link to="/#download">{{ t('nav.download') }}</router-link></li>
            <li><router-link to="/#faq">{{ t('nav.faq') }}</router-link></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-title">{{ t('footer.resources') }}</h4>
          <ul class="footer-links">
            <li><a href="https://github.com/mail-chat-chain/mailchatd" target="_blank">{{ t('footer.documentation') }}</a></li>
            <li><a href="#">{{ t('footer.blog') }}</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-title">{{ t('footer.legal') }}</h4>
          <ul class="footer-links">
            <li><a href="https://github.com/mail-chat-chain/mailchatd" target="_blank">{{ t('footer.openSource') }}</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copyright">© 2024 Sirr. Open source software.</p>
        <div class="footer-social">
          <a href="https://github.com/mail-chat-chain/mailchatd" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
          <a href="#" aria-label="Twitter">
            <svg viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--color-primary-3);
  color: white;
  padding: 4rem 2rem 2rem;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.footer-brand img {
  width: 40px;
  height: 40px;
}

.footer-brand span {
  font-size: 1.25rem;
  font-weight: 700;
}

.footer-desc {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  max-width: 300px;
}

.footer-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-copyright {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
}

.footer-social {
  display: flex;
  gap: 1rem;
}

.footer-social a {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.footer-social a:hover {
  background: rgba(255, 255, 255, 0.2);
}

.footer-social svg {
  width: 20px;
  height: 20px;
  fill: white;
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-desc {
    margin: 0 auto;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
