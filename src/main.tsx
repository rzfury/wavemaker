import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '~/App.tsx'
import '~/index.css'

window.waveMakerContext = {
  controls: new WeakMap(),
  signals: new WeakMap(),
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
