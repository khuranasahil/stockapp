import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import './index.css'
import App from './App.tsx'

// Temporarily commenting out StrictMode to prevent potential double-rendering
// which might be causing unintended fetch operations during development
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
    </ThemeProvider>
  // </StrictMode>,
)
