import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { AlertCircle, Info } from 'lucide-react'

const NoticeBanner = () => {
  const { notices } = useContext(AppContext)

  if (!notices || notices.length === 0) return null

  return (
    <div className="w-full bg-[#002266] border-b border-white/10 overflow-hidden">
      <div className="flex items-stretch">
        {/* Label */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#003087] shrink-0 border-r border-white/10">
          <Info size={13} className="text-blue-200" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-100 whitespace-nowrap">
            Notices
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
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-red-500 text-white">
                    <AlertCircle size={9} />
                    Urgent
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-white/15 text-blue-100">
                    Info
                  </span>
                )}
                <span className="text-[13px] font-semibold text-white">{notice.title}:</span>
                <span className="text-[13px] text-blue-200 font-normal">{notice.content}</span>
                <span className="text-blue-400/50 text-lg">·</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default NoticeBanner