import { StrictMode } from 'react' // Import StrictMode standalone (No 'React.' prefix needed)
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import { AppContextProvider } from './context/AppContext'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

import { assets } from './assets/assets.js'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      localization={{
        signIn: {
          start: {
            title: 'Student Portal Access',
            subtitle: 'Secure login for IET Lucknow students',
          },
        },
        signUp: {
          start: {
            title: 'Student Registration',
            subtitle: 'Secure registration for IET Lucknow students',
          },
        }
      }}
      appearance={{
        layout: {
          logoImageUrl: assets.iet_logo_2,
          socialButtonsPlacement: 'bottom',
          showOptionalFields: false,
        },
        variables: {
          colorPrimary: '#11241a', // Dark Green
          colorBackground: '#FFFDF8', // Cream
          colorText: '#11241a',
          colorInputBackground: '#ffffff',
          colorInputText: '#11241a',
          colorTextOnPrimaryBackground: '#ffffff',
          fontFamily: '"Inter", sans-serif',
          borderRadius: '0.75rem',
        },
        elements: {
          card: 'shadow-2xl border border-[#11241a]/10 rounded-3xl',
          headerTitle: 'font-serif text-2xl font-bold text-[#11241a]',
          headerSubtitle: 'text-gray-500 font-medium',
          logoImage: 'h-16 w-auto object-contain mx-auto mb-4',
          formButtonPrimary: 'bg-[#11241a] hover:bg-[#1a3828] text-[#FFFDF8] transition-all font-bold uppercase tracking-wider',
          socialButtonsBlockButton: 'border border-[#11241a]/10 hover:bg-[#11241a]/5 transition-colors',
          socialButtonsBlockButtonText: 'font-semibold',
          formFieldLabel: 'font-bold uppercase tracking-wider text-[11px] text-[#11241a]/70',
          formFieldInput: 'border-[#11241a]/20 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all rounded-xl py-2',
          footerActionLink: 'text-[#D4AF37] hover:text-[#b8952d] font-bold',
          dividerLine: 'bg-[#11241a]/10',
          dividerText: 'text-gray-400 font-medium'
        }
      }}
    >
      <AppContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppContextProvider>
    </ClerkProvider>
  </StrictMode>,
)