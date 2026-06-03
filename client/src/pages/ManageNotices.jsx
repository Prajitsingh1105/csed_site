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
            className='container mx-auto max-w-5xl'
        >
            <div className='mb-8'>
                <h2 className='text-3xl font-extrabold text-gray-800 tracking-tight'>Announcements Portal</h2>
                <p className='text-gray-500 mt-1 font-medium'>Broadcast active drives, news, and critical updates to all students.</p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

                {/* Create Notice Form */}
                <div className='lg:col-span-1'>
                    <div className='glass-panel p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-6'>
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Megaphone size={20} />
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg">New Notice</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Headline</label>
                                <input
                                    className="glass-input w-full px-4 py-3"
                                    placeholder="e.g. Amazon Drive Rescheduled"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    maxLength={50}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Details</label>
                                <textarea
                                    className="glass-input w-full px-4 py-3 h-28 resize-none"
                                    placeholder="Brief explanation..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Priority Level</label>
                                <select
                                    className="glass-input w-full px-4 py-3"
                                    value={urgency}
                                    onChange={(e) => setUrgency(e.target.value)}
                                >
                                    <option value="General">🔵 General Information</option>
                                    <option value="Urgent">🔴 Urgent Action Required</option>
                                </select>
                            </div>

                            <button type="submit" className="btn-primary w-full py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 mt-2">
                                <Plus size={18} /> Broadcast Now
                            </button>
                        </form>
                    </div>
                </div>

                {/* Manage Notices List */}
                <div className='lg:col-span-2 space-y-4'>
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-2">
                        <Clock size={18} className="text-gray-400" /> Active Broadcasts
                    </h3>

                    {notices.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium">No active notices.</p>
                        </div>
                    ) : (
                        notices.map((notice) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={notice._id}
                                className="glass-panel p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow"
                            >
                                <div className={`mt-1 shrink-0 ${notice.urgency === 'Urgent' ? 'text-red-500' : 'text-blue-500'}`}>
                                    {notice.urgency === 'Urgent' ? <AlertCircle size={24} /> : <Megaphone size={24} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-gray-800 text-lg leading-tight">{notice.title}</h4>
                                        <span className="text-xs font-semibold text-gray-400">{moment(notice.date).fromNow()}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3">{notice.content}</p>
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className={`px-2 py-1 rounded-full uppercase tracking-wider ${notice.urgency === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                            {notice.urgency}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(notice._id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                                        >
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

            </div>
        </motion.div>
    )
}

export default ManageNotices
