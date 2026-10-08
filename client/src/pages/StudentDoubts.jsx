import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import {
  Send,
  CheckCheck,
  Clock3,
  MessageCircleMore,
  Sparkles,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '@clerk/react'
import axios from 'axios'

const StudentDoubts = () => {
  const { backendUrl } = useContext(AppContext)
  const { getToken, isLoaded } = useAuth()

  const [myQueries, setMyQueries] = useState([])
  const [newQuery, setNewQuery] = useState('')

  const syncProfileAndFetchDoubts = async () => {
    try {
      const token = await getToken()
      if (!token) return

      await axios.get(`${backendUrl}/api/student/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const res = await axios.get(`${backendUrl}/api/student/doubts`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setMyQueries(res.data.queries || [])
    } catch (error) {// console.('Student Doubts Error:', error)
    }
  }

  useEffect(() => {
    if (isLoaded) {
      syncProfileAndFetchDoubts()
    }
  }, [isLoaded])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newQuery.trim()) return

    try {
      const token = await getToken()

      await axios.post(
        `${backendUrl}/api/student/doubts`,
        { query: newQuery },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setNewQuery('')
      toast.success('Message sent to placement cell')
      await syncProfileAndFetchDoubts()
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }



  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#11241a] mb-2">Query Forum</h2>
          <p className="text-gray-500 font-medium text-sm">Submit your queries regarding placements, drives, and eligibility.</p>
        </div>

        {/* New Query Form */}
        <div className="bg-white rounded-[24px] border border-[#11241a]/10 p-6 shadow-sm">
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#11241a] mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-[#D4AF37]" />
                Submit New Query
            </h3>
            <form onSubmit={handleSubmit}>
                <textarea 
                    className="w-full min-h-[100px] p-4 rounded-xl border border-[#11241a]/10 bg-[#F9F8F5] focus:outline-none focus:border-[#D4AF37]/50 text-sm font-medium text-[#11241a] placeholder:text-gray-400 mb-4 resize-y"
                    placeholder="Describe your query clearly..."
                    value={newQuery}
                    onChange={(e) => setNewQuery(e.target.value)}
                />
                <div className="flex justify-end">
                    <button 
                        type="submit"
                        disabled={!newQuery.trim()}
                        className="flex items-center gap-2 bg-[#11241a] text-[#D4AF37] px-6 py-2.5 rounded-xl font-bold text-[12px] uppercase tracking-wider hover:bg-[#1a3828] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <Send size={15} />
                        Submit
                    </button>
                </div>
            </form>
        </div>

        {/* Query History */}
        <div>
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-gray-500 mb-4">Your Query History</h3>
            
            {myQueries.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-[24px] border border-dashed border-[#11241a]/10">
                    <MessageCircleMore size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No queries submitted yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {myQueries.map((q) => (
                        <div key={q._id} className="bg-white rounded-[24px] border border-[#11241a]/10 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-[#11241a]/5 bg-[#F9F8F5] flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Clock3 size={14} className="text-gray-400" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                        {/* Use Date fallback if moment isn't available, but we can assume simple string if createdAt isn't populated */}
                                        {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : 'Query Date'}
                                    </span>
                                </div>
                                <span className={`px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${
                                    q.isResolved 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : 'bg-[#D4AF37]/10 text-[#11241a] border-[#D4AF37]/30'
                                }`}>
                                    {q.isResolved ? 'Resolved' : 'Pending'}
                                </span>
                            </div>

                            <div className="p-6">
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Question</h4>
                                <p className="text-[#11241a] font-medium text-sm whitespace-pre-wrap">{q.query}</p>
                            </div>

                            {q.reply && (
                                <div className="bg-[#11241a]/5 p-6 border-t border-[#11241a]/10">
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] mb-2 flex items-center gap-1.5">
                                        <CheckCheck size={14} /> Coordinator Response
                                    </h4>
                                    <p className="text-[#11241a] font-medium text-sm whitespace-pre-wrap leading-relaxed">{q.reply}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default StudentDoubts