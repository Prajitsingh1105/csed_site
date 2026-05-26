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
    <section id="placements" className="py-20 bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-[#003087]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003087]">
                Placement Highlights
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Outstanding Student Placements
            </h2>
            <p className="mt-4 text-gray-500 text-[15px] leading-relaxed">
              Recognizing students who secured remarkable opportunities through talent,
              preparation, and academic excellence.
            </p>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:min-w-[400px]">
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-xl sm:text-2xl font-black text-[#003087]">{h.value}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-1 uppercase tracking-wide">{h.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Student Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {students.map((student, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-[#003087]/30 transition-all duration-300 group"
            >
              {/* Card top strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#003087] to-[#0055b3]" />

              <div className="p-5">
                {/* Student info */}
                <div className="flex items-center gap-3 mb-5">
                  <img
                    src={student.image}
                    alt={student.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-bold text-gray-900 truncate">{student.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Building2 size={11} className="text-gray-400 shrink-0" />
                      <p className="text-[12px] text-gray-500 truncate">{student.company}</p>
                    </div>
                  </div>
                </div>

                {/* Package */}
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Annual Package
                  </p>
                  <div className="flex items-baseline justify-between">
                    <p className="text-3xl font-black text-[#003087] tracking-tight">
                      {student.package}
                    </p>
                    <div className="flex items-center gap-1 text-emerald-600">
                      <TrendingUp size={13} />
                      <span className="text-[11px] font-semibold">Placed</span>
                    </div>
                  </div>
                </div>

                {/* Batch */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-[11px] text-gray-400">Batch {student.batch}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href="/placements"
            className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold text-[#003087] border border-[#003087]/30 rounded-md hover:bg-[#003087] hover:text-white transition-all duration-200"
          >
            View All Placement Records
          </a>
        </div>

      </div>
    </section>
  )
}

export default PlacementHighlights