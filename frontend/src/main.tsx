import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// When a new build is deployed, old lazy-loaded chunk hashes no longer exist.
// Reload once automatically so the browser fetches the fresh index.html.
window.addEventListener('vite:preloadError', () => {
  const reloadKey = 'vite_preload_reloaded'
  if (!sessionStorage.getItem(reloadKey)) {
    sessionStorage.setItem(reloadKey, '1')
    window.location.reload()
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
