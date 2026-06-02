import { StrictMode } from 'react' // Import StrictMode standalone (No 'React.' prefix needed)
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import { AppContextProvider } from './context/AppContext'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')).render(
  <StrictMode> {/* Use it cleanly without the "React." prefix */}
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AppContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppContextProvider>
    </ClerkProvider>
  </StrictMode>,
)