import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { MessageSquare, Reply, CheckCircle2, Trash2, X } from 'lucide-react'
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
            className='container mx-auto p-2 sm:p-4'
        >
            <div className='mb-8'>
                <h2 className='text-3xl font-extrabold text-gray-800 tracking-tight'>Query Resolution Forum</h2>
                <p className='text-gray-500 mt-1 font-medium'>Manage and reply to student doubt tickets.</p>
            </div>

            <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
                {/* Pending Queries */}
                <div>
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-4">
                        <MessageSquare size={20} className="text-orange-500" /> Action Required <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{pendingQueries.length}</span>
                    </h3>
                    
                    <div className="space-y-4">
                        {pendingQueries.map(q => (
                            <div key={q._id} className="glass-panel p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-gray-800">{q.studentName}</h4>
                                    <button 
                                        onClick={() => handleResolve(q._id)}
                                        className="text-xs font-bold text-gray-400 hover:text-green-600 transition-colors flex items-center gap-1"
                                    >
                                        <CheckCircle2 size={14}/> Mark Resolved
                                    </button>
                                </div>
                                <p className="text-gray-600 font-medium mb-4">{q.query}</p>
                                
                                {replyingTo === q._id ? (
                                    <div className="mt-4 flex gap-2">
                                        <input 
                                            className="glass-input w-full px-4 py-2 text-sm"
                                            placeholder="Type your reply..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            autoFocus
                                        />
                                        <button 
                                            onClick={() => handleSubmitReply(q._id)}
                                            className="btn-primary py-2 px-4 rounded-xl text-sm whitespace-nowrap"
                                        >
                                            Send
                                        </button>
                                        <button 
                                            onClick={() => setReplyingTo(null)}
                                            className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => { setReplyingTo(q._id); setReplyText(''); }}
                                        className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors inline-flex"
                                    >
                                        <Reply size={16} /> Reply to Student
                                    </button>
                                )}
                            </div>
                        ))}
                        {pendingQueries.length === 0 && (
                            <div className="text-center py-10 bg-white/50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-500 font-medium text-sm">No pending queries! Great job.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Resolved Queries */}
                <div>
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-4">
                        <CheckCircle2 size={20} className="text-green-500" /> Resolved Tickets <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{resolvedQueries.length}</span>
                    </h3>
                    
                    <div className="space-y-4 opacity-75 grayscale-[0.2]">
                        {resolvedQueries.map(q => (
                            <div key={q._id} className="glass-panel p-5 rounded-2xl shadow-sm border border-gray-100 relative group">
                                <button 
                                    onClick={() => handleDelete(q._id)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={18} />
                                </button>
                                <div className="mb-2 pr-6">
                                    <h4 className="font-bold text-gray-800">{q.studentName}</h4>
                                </div>
                                <p className="text-gray-500 font-medium mb-3">{q.query}</p>
                                
                                {q.reply && (
                                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                                        <span className="text-xs font-bold font-bold text-indigo-800 mb-1 block">Your Reply:</span>
                                        <p className="text-gray-600 text-sm">{q.reply}</p>
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
