import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { Megaphone, AlertCircle, Info, Calendar } from 'lucide-react'

const NoticeBoard = () => {
    const { notices } = useContext(AppContext)

    return (
        <div id="notices" className="w-full bg-[#FFFDF8] py-20 border-b border-[#11241a]/10 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col items-center text-center mb-12">
                    <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#11241a] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                        <Megaphone size={12} />
                        Important Updates
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#11241a] tracking-tight">Official Notice Board</h2>
                    <p className="mt-4 text-gray-500 text-sm max-w-2xl uppercase tracking-wider font-bold">Latest announcements, placement drives, and critical information for all students.</p>
                </div>

                {(!notices || notices.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-xl border border-[#11241a]/10 shadow-sm text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                            <Megaphone size={24} />
                        </div>
                        <h3 className="text-lg font-serif font-medium text-[#11241a] mb-2">No Active Announcements</h3>
                        <p className="text-gray-500 text-sm max-w-md font-medium">There are currently no active notices. Any new updates from the placement cell will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notices.map((notice, idx) => (
                            <motion.div 
                                key={notice._id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-xl p-6 shadow-sm border border-[#11241a]/10 hover:border-[#D4AF37]/50 hover:shadow-md transition-all flex flex-col h-full group relative overflow-hidden"
                            >
                                {/* Decorative Top Accent */}
                                <div className={`absolute top-0 left-0 w-full h-1 ${notice.urgency === 'Urgent' ? 'bg-red-500' : 'bg-[#D4AF37]'}`}></div>

                                <div className="flex justify-between items-start mb-4">
                                    {notice.urgency === 'Urgent' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded bg-red-50 text-red-600 border border-red-100">
                                            <AlertCircle size={12} />
                                            Urgent
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded bg-[#11241a]/5 text-[#11241a] border border-[#11241a]/10">
                                            <Info size={12} />
                                            General
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        <Calendar size={12} />
                                        {new Date(notice.date || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>

                                <h3 className="font-serif font-medium text-lg text-[#11241a] mb-3 group-hover:text-[#D4AF37] transition-colors leading-snug">
                                    {notice.title}
                                </h3>
                                
                                <p className="text-sm text-gray-600 leading-relaxed font-medium mb-4 flex-grow">
                                    {notice.content}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default NoticeBoard
