import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { Plus, Trash2, Megaphone, AlertCircle, Clock } from 'lucide-react'
import { toast } from 'react-toastify'
import moment from 'moment'
import axios from 'axios'

const ManageNotices = () => {
    const { notices, backendUrl, fetchBackendData, getAdminHeaders } = useContext(AppContext)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [urgency, setUrgency] = useState('General')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim()) {
            toast.error("Please fill all fields")
            return
        }

        try {
            await axios.post(`${backendUrl}/api/admin/notices`, { title, content, urgency }, await getAdminHeaders())
            setTitle('')
            setContent('')
            setUrgency('General')
            toast.success("Notice broadcasted successfully!")
            fetchBackendData()
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${backendUrl}/api/admin/notices/${id}`, await getAdminHeaders())
            toast.success("Notice removed")
            fetchBackendData()
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8'
        >
            <div className='border-b border-[#11241a]/10 pb-6'>
                <h2 className='text-3xl font-serif font-medium text-[#11241a] tracking-tight'>Announcements Portal</h2>
                <p className='text-gray-500 mt-2 text-[12px] font-bold uppercase tracking-wider'>Broadcast active drives, news, and critical updates to all students.</p>
            </div>

            <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>

                {/* Create Notice Form */}
                <div className='xl:col-span-1'>
                    <div className='bg-white p-6 rounded-xl shadow-sm border border-[#11241a]/10 sticky top-6 hover:border-[#D4AF37]/30 transition-colors'>
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#11241a]/10">
                            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#11241a] border border-[#D4AF37]/20">
                                <Megaphone size={20} />
                            </div>
                            <div>
                                <h3 className="font-serif font-medium text-[#11241a] text-lg">New Notice</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Push a real-time update</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">Headline</label>
                                <input
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#0B2447] focus:border-transparent outline-none font-medium transition-all"
                                    placeholder="e.g. Amazon Drive Rescheduled"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    maxLength={50}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">Details</label>
                                <textarea
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#0B2447] focus:border-transparent outline-none font-medium transition-all h-28 resize-none"
                                    placeholder="Brief explanation..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">Priority Level</label>
                                <select
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#0B2447] focus:border-transparent outline-none font-medium transition-all"
                                    value={urgency}
                                    onChange={(e) => setUrgency(e.target.value)}
                                >
                                    <option value="General">🔵 General Information</option>
                                    <option value="Urgent">🔴 Urgent Action Required</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full py-3 bg-[#0B2447] hover:bg-[#113264] text-white rounded-lg font-bold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 mt-4">
                                <Plus size={18} /> Broadcast Now
                            </button>
                        </form>
                    </div>
                </div>

                {/* Manage Notices List */}
                <div className='xl:col-span-2 space-y-4'>
                    <h3 className="font-extrabold text-[#0F172A] text-lg flex items-center gap-2 mb-4">
                        <Clock size={18} className="text-gray-400" /> Active Broadcasts
                    </h3>

                    {notices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-200 shadow-sm">
                            <Megaphone size={32} className="text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No active notices.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {notices.map((notice) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={notice._id}
                                    className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-start gap-4 hover:shadow-md transition-shadow relative overflow-hidden group"
                                >
                                    {/* Left Accent Bar */}
                                    <div className={`absolute top-0 left-0 w-1 h-full ${notice.urgency === 'Urgent' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                    
                                    <div className={`mt-1 shrink-0 ${notice.urgency === 'Urgent' ? 'text-red-500 bg-red-50' : 'text-blue-600 bg-blue-50'} p-2 rounded-lg border ${notice.urgency === 'Urgent' ? 'border-red-100' : 'border-blue-100'}`}>
                                        {notice.urgency === 'Urgent' ? <AlertCircle size={20} /> : <Megaphone size={20} />}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-2">
                                            <h4 className="font-extrabold text-[#0F172A] text-lg leading-tight truncate">{notice.title}</h4>
                                            <span className="text-xs font-bold text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                                {moment(notice.date).fromNow()}
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{notice.content}</p>
                                        
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className={`px-2.5 py-1 rounded tracking-wide uppercase border ${notice.urgency === 'Urgent' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                                                {notice.urgency}
                                            </span>
                                            
                                            <button
                                                onClick={() => handleDelete(notice._id)}
                                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition-all flex items-center gap-1.5 opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-100"
                                            >
                                                <Trash2 size={14} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </motion.div>
    )
}

export default ManageNotices
