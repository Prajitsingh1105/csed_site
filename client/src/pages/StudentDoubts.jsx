import React, { useContext, useState, useEffect, useMemo, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  CheckCheck,
  Clock3,
  MessageCircleMore,
  Sparkles,
} from 'lucide-react'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '@clerk/react'
import axios from 'axios'

const StudentDoubts = () => {
  const { backendUrl } = useContext(AppContext)
  const { getToken, isLoaded } = useAuth()

  const [myQueries, setMyQueries] = useState([])
  const [newQuery, setNewQuery] = useState('')
  const chatEndRef = useRef(null)

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
    } catch (error) {
      console.error('Student Doubts Error:', error)
    }
  }

  useEffect(() => {
    if (isLoaded) {
      syncProfileAndFetchDoubts()
    }
  }, [isLoaded])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [myQueries])

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

  const chatMessages = useMemo(() => {
    const sortedQueries = [...myQueries].sort((a, b) => {
      const aTime = new Date(a.createdAt || a.updatedAt || 0).getTime()
      const bTime = new Date(b.createdAt || b.updatedAt || 0).getTime()
      return aTime - bTime
    })

    const msgs = []

    sortedQueries.forEach((q) => {
      msgs.push({
        id: `${q._id}-student`,
        type: 'student',
        text: q.query,
        status: q.isResolved ? 'resolved' : 'pending',
      })

      if (q.reply) {
        msgs.push({
          id: `${q._id}-reply`,
          type: 'coordinator',
          text: q.reply,
          status: 'replied',
        })
      } else {
        msgs.push({
          id: `${q._id}-pending-note`,
          type: 'system',
          text: 'Your message has been received. Waiting for coordinator reply.',
          status: 'waiting',
        })
      }
    })

    return msgs
  }, [myQueries])

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <Navbar />

      <div className="px-3 sm:px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-auto max-w-md"
        >
          <div className="overflow-hidden rounded-[30px] border border-[#d7e3f4] bg-white shadow-[0_24px_80px_rgba(0,24,69,0.12)]">
            {/* Header */}
            <div className="border-b border-white/10 bg-gradient-to-r from-[#001845] via-[#002a66] to-[#003087] px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/10">
                  <MessageCircleMore size={20} />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-sm font-semibold text-white">
                    Department Support Chat
                  </h1>
                  <p className="text-xs text-blue-100/90">
                    Depeartment of Computer Science & Engineering
                  </p>
                </div>
              </div>
            </div>

            {/* Chat shell */}
            <div className="relative h-[calc(100vh-180px)] bg-[#f7faff]">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_1px_1px,rgba(0,48,135,0.09)_1px,transparent_0)] bg-[size:22px_22px]" />

              <div className="relative flex h-full flex-col">
                {/* Hint */}
                <div className="px-3 pt-3">
                  <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-[#33507a] shadow-sm">
                    <Sparkles size={13} className="text-[#3b82f6]" />
                    Ask short and clear questions
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-3 pb-28 pt-3 space-y-3">
                  {chatMessages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="w-full rounded-[24px] border border-[#dbe7f5] bg-white p-6 text-center shadow-sm">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#003087]">
                          <MessageCircleMore size={22} />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-[#001845]">
                          Start chatting
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#6b7a90]">
                          Ask about eligibility, drive dates, offers, or any
                          placement-related doubt.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {chatMessages.map((msg, index) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.02 }}
                          className={`flex ${
                            msg.type === 'student'
                              ? 'justify-end'
                              : msg.type === 'coordinator'
                              ? 'justify-start'
                              : 'justify-center'
                          }`}
                        >
                          {msg.type === 'system' ? (
                            <div className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-medium text-[#31507a] shadow-sm">
                              {msg.text}
                            </div>
                          ) : (
                            <div
                              className={`max-w-[82%] rounded-[22px] px-4 py-3 shadow-sm ${
                                msg.type === 'student'
                                  ? 'rounded-br-md bg-[#003087] text-white'
                                  : 'rounded-bl-md border border-[#dbe6f3] bg-white text-[#001845]'
                              }`}
                            >
                              {msg.type === 'coordinator' && (
                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3b82f6]">
                                  Placement Cell
                                </p>
                              )}

                              <p className="whitespace-pre-wrap text-[14px] leading-6">
                                {msg.text}
                              </p>

                              <div
                                className={`mt-2 flex items-center gap-1 text-[10px] ${
                                  msg.type === 'student'
                                    ? 'justify-end text-blue-100'
                                    : 'justify-start text-[#7b8aa3]'
                                }`}
                              >
                                {msg.type === 'student' && msg.status === 'resolved' && (
                                  <>
                                    <CheckCheck size={13} className="text-[#93c5fd]" />
                                    <span>Seen</span>
                                  </>
                                )}

                                {msg.type === 'student' && msg.status === 'pending' && (
                                  <>
                                    <Clock3 size={12} className="text-[#bfdbfe]" />
                                    <span>Pending</span>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <form
                    onSubmit={handleSubmit}
                    className="flex items-end gap-2 rounded-[24px] border border-[#dbe6f3] bg-white p-2.5 shadow-[0_12px_30px_rgba(0,24,69,0.08)]"
                  >
                    <div className="flex-1">
                      <textarea
                        rows={1}
                        className="min-h-[44px] max-h-28 w-full resize-none rounded-2xl bg-transparent px-3 py-2.5 text-sm text-[#001845] outline-none placeholder:text-[#7b8aa3]"
                        placeholder="Type your doubt here..."
                        value={newQuery}
                        onChange={(e) => setNewQuery(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!newQuery.trim()}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#003087] text-white shadow-sm transition hover:scale-[1.03] hover:bg-[#002766] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send size={17} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default StudentDoubts