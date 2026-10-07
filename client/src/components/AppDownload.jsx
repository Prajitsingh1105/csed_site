import React from 'react'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'
import { Building2, TrendingUp } from 'lucide-react'

const students = [
  { name: 'Aditi Kesarwani', company: 'Amazon', package: '50 LPA', batch: '2024', image: assets.user_img },
  { name: 'Kinjal Gupta', company: 'Hummingwave', package: '13 LPA', batch: '2024', image: assets.user_img },
  { name: 'Deepali Sayana', company: 'BEL', package: '12.5 LPA', batch: '2024', image: assets.user_img },
  { name: 'Khushi Rawat', company: 'HUL', package: '11 LPA', batch: '2024', image: assets.user_img },
]

const HIGHLIGHTS = [
  { label: 'Highest Package', value: '49+ LPA' },
  { label: 'Session', value: '2024–25' },
  { label: 'Companies Visited', value: '120+' },
  { label: 'Offers Made', value: '400+' },
]

const PlacementHighlights = () => {
  return (
    <section id="placements" className="py-24 bg-[#11241a] text-[#FFFDF8] relative bg-noise overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1a3828] rounded-full blur-[150px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-[#D4AF37]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                Student Success
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif font-medium tracking-tight">
              Outstanding Achievements
            </h2>
            <p className="mt-6 text-gray-400 text-[16px] leading-relaxed font-medium">
              Recognizing our brilliant scholars who secured remarkable opportunities through talent, preparation, and academic excellence.
            </p>
          </div>

          {/* Key stats (Dark Glassmorphic) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:min-w-[480px]">
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} className="glass-dark-card rounded-xl p-5 text-center">
                <p className="text-2xl sm:text-3xl font-serif font-medium text-[#FFFDF8]">{h.value}</p>
                <p className="text-[10px] text-[#D4AF37] font-bold mt-2 uppercase tracking-widest">{h.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Student Cards (Light Glass/Elegant) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {students.map((student, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 group backdrop-blur-md"
            >
              {/* Card top strip */}
              <div className="h-1 w-full bg-gradient-to-r from-[#D4AF37] to-[#f9e596]" />

              <div className="p-6">
                {/* Student info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-1 rounded-full bg-white/10 border border-white/20">
                    <img
                      src={student.image}
                      alt={student.name}
                      className="h-12 w-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-bold text-[#FFFDF8] truncate font-serif">{student.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Building2 size={12} className="text-[#D4AF37] shrink-0" />
                      <p className="text-[12px] text-gray-400 font-medium truncate">{student.company}</p>
                    </div>
                  </div>
                </div>

                {/* Package */}
                <div className="border-t border-white/10 pt-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1.5">
                    Annual Package
                  </p>
                  <div className="flex items-baseline justify-between">
                    <p className="text-3xl font-serif font-medium text-[#FFFDF8] tracking-tight">
                      {student.package}
                    </p>
                    <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                      <TrendingUp size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Secured</span>
                    </div>
                  </div>
                </div>

                {/* Batch */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37]">Batch {student.batch}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <a
            href="/placements"
            className="inline-flex items-center gap-3 px-8 py-4 text-[13px] font-bold uppercase tracking-wider text-[#11241a] bg-[#D4AF37] hover:bg-[#e6c148] rounded shadow-lg hover:shadow-xl transition-all duration-300"
          >
            View All Placement Records
          </a>
        </div>

      </div>
    </section>
  )
}

export default PlacementHighlights