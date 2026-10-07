import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { FileCheck, UserRound, ArrowRight } from 'lucide-react'

const STATS = [
  { value: '4', label: 'Academic Programs', sub: 'B.Tech, M.Tech, MCA & PhD' },
  { value: '30+', label: 'Faculty Members', sub: 'Experienced Academicians' },
  { value: '1000+', label: 'Active Students', sub: 'Across all programs' },
]

const Hero = () => {
  return (
    <section className="relative mb-24 lg:mb-32 -mt-[67px] sm:-mt-[100px]">
      {/* Hero Image Block */}
      <div className="relative h-[100dvh] min-h-[750px] max-h-[1080px]">
        
        {/* Image and Gradients Container */}
        <div className="absolute inset-0 overflow-hidden bg-[#11241a]">
          {/* 1. Campus Image */}
          <motion.img
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: 'easeOut' }}
            style={{ willChange: 'transform', transformOrigin: 'center' }}
            src={assets.IET_Lucknow}
            alt="IET Lucknow Campus"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />

          {/* 2. Brand Gradient Overlays (Dark to Light to reveal image) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#11241a] via-[#1a1728]/80 to-[#11241a]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1410] via-[#0d1410]/20 to-transparent" />
          
          {/* 3. Tactile Noise Overlay - Optimized for GPU */}
          <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" style={{ transform: 'translateZ(0)' }} />
        </div>

        {/* Content */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-[140px] pb-[120px] sm:pt-20 sm:pb-48">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[2px] w-12 bg-[#D4AF37]" /> {/* Elegant Gold Accent */}
              <span className="text-[#E8E2D6] text-xs font-semibold uppercase tracking-[0.3em]">
                Institute of Engineering & Technology, Lucknow
              </span>
            </div>

            {/* Prestige Typography for Headline */}
            <h1 className="text-[40px] sm:text-6xl lg:text-[72px] font-serif font-medium text-[#FFFDF8] leading-[1.1] sm:leading-[1.05] tracking-tight">
              Department of
              <br />
              <span className="italic text-[#D4AF37] font-serif font-light">Computer Science</span>
              <br />
              <span className="font-serif">&amp; Engineering</span>
            </h1>

            <p className="mt-8 text-[#D1D5DB] text-lg sm:text-xl font-light leading-relaxed max-w-2xl tracking-wide">
              Fostering innovation, research, and technical excellence. Empowering the next generation of computer scientists and software engineers.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/profile"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#FFFDF8] text-[#11241a] text-sm font-bold tracking-wide uppercase rounded hover:bg-[#E8E2D6] transition-all shadow-xl"
              >
                <UserRound size={16} className="text-[#11241a]" />
                Student Portal
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/no-dues"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white/5 text-[#FFFDF8] text-sm font-semibold tracking-wide uppercase rounded border border-white/20 hover:bg-white/10 transition-all backdrop-blur-md"
              >
                <FileCheck size={16} />
                Clearance / No-Dues
              </Link>
            </div>
          </motion.div>
        </div>

        {/* High-Impact Metric Grid (Glassmorphic Dark Cards with Paper Grain) */}
        <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 z-30 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="glass-dark-card rounded-2xl overflow-hidden grid grid-cols-3 divide-x divide-white/10"
            >
              {STATS.map((stat, i) => (
                <div
                  key={i}
                  className="px-2 sm:px-10 py-4 sm:py-8 flex flex-col items-center sm:items-start text-center sm:text-left group hover:bg-white/5 transition-colors duration-500"
                >
                  {/* Kinetic Numerals (Serif) */}
                  <p className="text-2xl sm:text-5xl font-serif font-medium text-[#FFFDF8] tracking-tight group-hover:scale-105 transition-transform origin-center sm:origin-left duration-500">
                    {stat.value}
                  </p>
                  <p className="mt-1 sm:mt-3 text-[9px] sm:text-[13px] font-bold text-[#E8E2D6] tracking-wide uppercase leading-tight max-w-[120px]">
                    {stat.label}
                  </p>
                  <p className="hidden sm:block text-[12px] text-gray-300 mt-1.5 font-medium tracking-wide">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero