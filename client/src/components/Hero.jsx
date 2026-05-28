import { useContext, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { FileCheck, UserRound } from 'lucide-react'

const STATS = [
  { value: '49+', label: 'Highest LPA', sub: 'Session 2024–25' },
  { value: '120+', label: 'Companies', sub: 'On-campus recruiters' },
  { value: '95%', label: 'Placement Rate', sub: 'Eligible students' },
]

const RECRUITERS = [
  { src: assets.microsoft_logo, alt: 'Microsoft' },
  { src: assets.amazon_logo, alt: 'Amazon' },
  { src: assets.adobe_logo, alt: 'Adobe' },
  { src: assets.tcs_logo, alt: 'TCS' },
  { src: assets.hero_logo, alt: 'Hero' },
]

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext)
  const titleRef = useRef(null)
  const locationRef = useRef(null)

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current?.value || '',
      location: locationRef.current?.value || '',
    })
    setIsSearched(true)
  }

  return (
    <section className="relative overflow-hidden">
      {/* Hero Image Block */}
      <div className="relative h-[480px] sm:h-[540px] lg:h-[600px]">
        <motion.img
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: 'easeOut' }}
          src={assets.IET_Lucknow}
          alt="IET Lucknow Campus"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay — strong left, fades to transparent right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001845]/92 via-[#001845]/70 to-[#001845]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001845]/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px w-8 bg-blue-400" />
              <span className="text-blue-300 text-[11px] font-bold uppercase tracking-[0.22em]">
                Placement Portal
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white leading-[1.08] tracking-tight">
              Department of
              <br />
              <span className="text-blue-300">Computer Science</span>
              <br />
              &amp; Engineering
            </h1>

            <p className="mt-5 text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Connecting IET Lucknow students with premier on-campus opportunities,
              recruiters, and placement resources.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/no-dues"
                onClick={onSearch}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#001845] text-sm font-bold rounded-md hover:bg-blue-50 transition-all shadow-lg"
              >
                <FileCheck size={15} />
                No Dues
              </Link>

              <Link
                to="/profile"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white text-sm font-semibold rounded-md border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                <UserRound size={15} />
                View Profile
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats Bar — overlapping bottom */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-3 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
            >
              {STATS.map((stat, i) => (
                <div
                  key={i}
                  className={`px-4 sm:px-8 py-5 sm:py-6 text-center ${
                    i < STATS.length - 1 ? 'border-r border-gray-100' : ''
                  }`}
                >
                  <p className="text-2xl sm:text-3xl font-black text-[#003087] tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[12px] sm:text-[13px] font-semibold text-gray-800">
                    {stat.label}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Recruiters strip */}
      <div className="bg-gray-50 border-b border-gray-200 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-400 whitespace-nowrap shrink-0">
              Top Recruiters
            </p>

            <div className="flex-1 h-px bg-gray-200 hidden sm:block" />

            <div className="flex items-center gap-8 sm:gap-12 flex-wrap justify-center">
              {RECRUITERS.map((r, i) => (
                <div key={i} className="h-8 flex items-center justify-center">
                  <img
                    src={r.src}
                    alt={r.alt}
                    className="max-h-full max-w-[80px] object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero