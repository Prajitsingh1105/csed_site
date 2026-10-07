import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { AlertCircle, Info } from 'lucide-react'

const NoticeBanner = () => {
  const { notices } = useContext(AppContext)

  if (!notices || notices.length === 0) return null

  return (
    <div id="notices" className="w-full bg-[#11241a] border-b border-white/5 overflow-hidden">
      <div className="flex items-stretch">
        {/* Label */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a3828] shrink-0 border-r border-white/5">
          <Info size={13} className="text-[#D4AF37]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E8E2D6] whitespace-nowrap">
            Announcements
          </span>
        </div>

        {/* Ticker */}
        <div className="relative flex-1 overflow-hidden flex items-center h-10">
          <motion.div
            className="flex items-center whitespace-nowrap gap-10 px-6"
            animate={{ x: [0, -1200] }}
            transition={{
              x: { repeat: Infinity, repeatType: 'loop', duration: notices.length * 12, ease: 'linear' },
            }}
          >
            {[...notices, ...notices, ...notices].map((notice, index) => (
              <div key={`${notice._id}-${index}`} className="flex items-center gap-3 shrink-0">
                {notice.urgency === 'Urgent' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-red-900/40 text-red-300 border border-red-800/50">
                    <AlertCircle size={9} />
                    Urgent
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-white/5 text-[#D4AF37] border border-white/10">
                    Info
                  </span>
                )}
                <span className="text-[13px] font-semibold text-[#FFFDF8]">{notice.title}:</span>
                <span className="text-[13px] text-gray-400 font-medium">{notice.content}</span>
                <span className="text-[#D4AF37]/30 text-lg">·</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default NoticeBanner