import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { MessageSquare, Reply, CheckCircle2, X } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'

const ManageQueries = () => {
    const { queries, backendUrl, fetchBackendData, getAdminHeaders } = useContext(AppContext)
    const [replyingTo, setReplyingTo] = useState(null)
    const [replyText, setReplyText] = useState('')

    const handleResolve = async (id) => {
        try {
            await axios.put(`${backendUrl}/api/admin/queries/${id}/resolve`, { reply: "" }, await getAdminHeaders())
            fetchBackendData()
            toast.success("Query marked as Resolved.")
        } catch (error) { toast.error(error.message) }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${backendUrl}/api/admin/queries/${id}`, await getAdminHeaders())
            fetchBackendData()
            toast.success("Query permanently removed.")
        } catch (error) { toast.error(error.message) }
    }

    const handleSubmitReply = async (id) => {
        if(!replyText.trim()) return;
        try {
            await axios.put(`${backendUrl}/api/admin/queries/${id}/resolve`, { reply: replyText }, await getAdminHeaders())
            setReplyingTo(null)
            setReplyText('')
            fetchBackendData()
            toast.success("Reply sent & query resolved.")
        } catch (error) { toast.error(error.message) }
    }

    const pendingQueries = queries.filter(q => !q.isResolved)
    const resolvedQueries = queries.filter(q => q.isResolved)

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8'
        >
            <div className='border-b border-gray-200 pb-6'>
                <h2 className='text-3xl font-extrabold text-[#0F172A] tracking-tight'>Query Resolution Forum</h2>
                <p className='text-gray-500 mt-1 font-medium'>Manage and reply to student doubt tickets.</p>
            </div>

            <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
                {/* Pending Queries */}
                <div>
                    <h3 className="font-extrabold text-[#0F172A] text-lg flex items-center gap-2 mb-4">
                        <MessageSquare size={18} className="text-amber-500" /> Action Required 
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{pendingQueries.length}</span>
                    </h3>
                    
                    <div className="space-y-4">
                        {pendingQueries.map(q => (
                            <div key={q._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-extrabold text-[#0F172A]">{q.studentName}</h4>
                                    <button 
                                        onClick={() => handleResolve(q._id)}
                                        className="text-[10px] uppercase tracking-wide font-bold text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded transition-colors flex items-center gap-1 border border-transparent hover:border-emerald-200"
                                    >
                                        <CheckCircle2 size={14}/> Mark Resolved
                                    </button>
                                </div>
                                <p className="text-gray-600 font-medium mb-4 text-sm leading-relaxed">{q.query}</p>
                                
                                {replyingTo === q._id ? (
                                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                        <input 
                                            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-[#0B2447] focus:border-transparent outline-none font-medium transition-all"
                                            placeholder="Type your reply..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleSubmitReply(q._id)}
                                                className="bg-[#0B2447] hover:bg-[#113264] text-white py-2 px-4 rounded-lg text-sm font-bold shadow-sm transition-colors active:scale-95"
                                            >
                                                Send
                                            </button>
                                            <button 
                                                onClick={() => setReplyingTo(null)}
                                                className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => { setReplyingTo(q._id); setReplyText(''); }}
                                        className="text-[#0B2447] bg-blue-50 border border-blue-100 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors inline-flex"
                                    >
                                        <Reply size={16} /> Reply to Student
                                    </button>
                                )}
                            </div>
                        ))}
                        {pendingQueries.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-xl border border-dashed border-gray-200 shadow-sm">
                                <MessageSquare size={28} className="text-gray-300 mb-3" />
                                <p className="text-gray-500 font-medium text-sm">No pending queries! Great job.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Resolved Queries */}
                <div>
                    <h3 className="font-extrabold text-[#0F172A] text-lg flex items-center gap-2 mb-4">
                        <CheckCircle2 size={18} className="text-emerald-500" /> Resolved Tickets 
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-gray-200">{resolvedQueries.length}</span>
                    </h3>
                    
                    <div className="space-y-4">
                        {resolvedQueries.map(q => (
                            <div key={q._id} className="bg-gray-50 p-5 rounded-xl border border-gray-200 relative group opacity-90 hover:opacity-100 transition-opacity">
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-xl"></div>
                                <button 
                                    onClick={() => handleDelete(q._id)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-100"
                                >
                                    <X size={16} />
                                </button>
                                <div className="mb-2 pr-6">
                                    <h4 className="font-extrabold text-gray-700">{q.studentName}</h4>
                                </div>
                                <p className="text-gray-500 font-medium mb-4 text-sm leading-relaxed">{q.query}</p>
                                
                                {q.reply && (
                                    <div className="bg-white border border-emerald-100 rounded-lg p-3.5 shadow-sm">
                                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-1.5 block">Your Reply:</span>
                                        <p className="text-gray-700 text-sm font-medium">{q.reply}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default ManageQueries
