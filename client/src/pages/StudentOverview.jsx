import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useAuth, useUser } from '@clerk/react'
import axios from 'axios'
import { Clock3, FileCheck, MessageSquare, AlertCircle, Bell, Download, Calendar, Library, AlertTriangle, Wifi, BookOpen, ChevronRight } from 'lucide-react'

const StudentOverview = () => {
    const { backendUrl } = useContext(AppContext)
    const { getToken, isLoaded } = useAuth()
    const { user } = useUser()
    const [stats, setStats] = useState({ queries: 0, noDuesStatus: 'Not Applied' })
    const [profileIncomplete, setProfileIncomplete] = useState(false)

    const [displayName, setDisplayName] = useState(user?.fullName || 'Student')
    const [notices, setNotices] = useState([])

    useEffect(() => {
        const fetchOverview = async () => {
            if (!isLoaded) return
            try {
                const token = await getToken()
                if (!token) return

                const profileRes = await axios.get(`${backendUrl}/api/student/profile`, { headers: { Authorization: `Bearer ${token}` } })
                const u = profileRes.data.user
                if (!u || !u.branch || !u.phone || !u.passingYear) {
                    setProfileIncomplete(true)
                }
                
                if (u && u.name) {
                    setDisplayName(u.name)
                }

                const doubtsRes = await axios.get(`${backendUrl}/api/student/doubts`, { headers: { Authorization: `Bearer ${token}` } })
                const noDuesRes = await axios.get(`${backendUrl}/api/student/no-dues/status`, { headers: { Authorization: `Bearer ${token}` } })
                const noticesRes = await axios.get(`${backendUrl}/api/public/notices`)

                setStats({
                    queries: doubtsRes.data.queries?.length || 0,
                    noDuesStatus: noDuesRes.data.request?.status || 'Not Applied'
                })

                if (noticesRes.data.success) {
                    setNotices(noticesRes.data.notices || [])
                }
            } catch (err) {
                // Ignore errors
            }
        }
        fetchOverview()
    }, [isLoaded, getToken, backendUrl, user])


    return (
        <div className="w-full">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-[#11241a] mb-2">Welcome, {displayName}!</h2>
                    <p className="text-gray-500 font-medium text-sm">Here is a quick overview of your dashboard activities.</p>
                </div>

                {/* Action Center Banner - Shows Incomplete Profile OR Pending No Dues */}
                {profileIncomplete ? (
                    <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-[24px] p-5 flex items-start gap-4 shadow-sm">
                        <AlertCircle className="text-[#D4AF37] shrink-0 mt-0.5" size={20} />
                        <div>
                            <h3 className="font-bold text-[#11241a] text-sm uppercase tracking-wider mb-1">Action Required: Complete Profile</h3>
                            <p className="text-[#11241a]/80 text-sm font-medium">Your student profile is missing some mandatory details. Please update it to access all portal features smoothly.</p>
                        </div>
                    </div>
                ) : stats.noDuesStatus === 'Pending' ? (
                     <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-[24px] p-5 flex items-start gap-4 shadow-sm">
                        <Clock3 className="text-[#D4AF37] shrink-0 mt-0.5" size={20} />
                        <div>
                            <h3 className="font-bold text-[#11241a] text-sm uppercase tracking-wider mb-1">Action Pending: No Dues</h3>
                            <p className="text-[#11241a]/80 text-sm font-medium">Your Library No Dues application is currently under review by the coordinator.</p>
                        </div>
                    </div>
                ) : null}

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    <div className="bg-white rounded-[24px] border border-[#11241a]/10 p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Query Forum</h3>
                            <p className="text-2xl font-serif font-bold text-[#11241a]">{stats.queries}</p>
                            <p className="text-xs text-gray-400 mt-1 font-medium">Total queries submitted</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#11241a]/5 flex items-center justify-center text-[#11241a]">
                            <MessageSquare size={20} />
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] border border-[#11241a]/10 p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">No Dues Status</h3>
                            <p className="text-xl font-bold text-[#11241a] mt-1 tracking-tight">{stats.noDuesStatus}</p>
                            <p className="text-xs text-gray-400 mt-1 font-medium">Clearance portal</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                            <FileCheck size={20} />
                        </div>
                    </div>
                </div>

                {/* Main Content 3-Col Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                    
                    {/* Noticeboard (Spans 2 columns on large screens) */}
                    <div className="bg-white rounded-[24px] border border-[#11241a]/10 p-6 shadow-sm lg:col-span-2 flex flex-col h-[400px]">
                        <div className="flex items-center justify-between mb-5 border-b border-[#11241a]/10 pb-4">
                            <h3 className="text-[#11241a] font-serif font-bold text-lg">Department Noticeboard</h3>
                            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                                <Bell size={16} className="text-[#D4AF37]" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-3 space-y-5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                            {notices.length > 0 ? notices.map(notice => (
                                <div key={notice._id || Math.random()} className={`border-l-[3px] ${notice.urgency === 'Urgent' ? 'border-red-500' : 'border-[#D4AF37]'} pl-4 py-1 group cursor-pointer hover:bg-gray-50/50 rounded-r-lg transition-colors`}>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${notice.urgency === 'Urgent' ? 'text-red-500' : 'text-gray-400'}`}>
                                        {new Date(notice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        {notice.urgency === 'Urgent' && ' • URGENT'}
                                    </span>
                                    <h4 className="text-sm font-bold text-[#11241a] mt-1 group-hover:text-[#D4AF37] transition-colors">{notice.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1.5 font-medium leading-relaxed">{notice.content}</p>
                                </div>
                            )) : (
                                <p className="text-xs text-gray-400 font-medium italic mt-2">No department notices at this time.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Academic Snapshot & Quick Links */}
                    <div className="flex flex-col gap-4 lg:gap-6 h-[400px]">
                        {/* Academic Snapshot Card */}
                        <div className="bg-white rounded-[24px] border border-[#11241a]/10 p-6 shadow-sm">
                            <h3 className="text-[#11241a] font-serif font-bold text-lg mb-5">Academic Snapshot</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <span className="text-gray-500 text-sm font-medium">Current Semester</span>
                                    <span className="text-[#11241a] font-bold text-[13px] bg-[#11241a]/5 px-2.5 py-1 rounded-md">6th Semester</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <span className="text-gray-500 text-sm font-medium">Faculty Mentor</span>
                                    <span className="text-[#11241a] font-bold text-[13px]">Dr. A. Sharma</span>
                                </div>
                                <div className="pt-1 flex flex-col gap-2.5">
                                    <button className="flex items-center justify-between w-full text-sm text-[#11241a] bg-[#11241a]/5 hover:bg-[#11241a]/10 p-3 rounded-xl font-bold transition-colors">
                                        <span className="flex items-center gap-2.5">
                                            <Download size={16} className="text-[#D4AF37]" /> Syllabus
                                        </span>
                                        <ChevronRight size={16} className="text-gray-400" />
                                    </button>
                                    <button className="flex items-center justify-between w-full text-sm text-[#11241a] bg-[#11241a]/5 hover:bg-[#11241a]/10 p-3 rounded-xl font-bold transition-colors">
                                        <span className="flex items-center gap-2.5">
                                            <Calendar size={16} className="text-[#D4AF37]" /> Calendar
                                        </span>
                                        <ChevronRight size={16} className="text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links Card */}
                        <div className="bg-white rounded-[24px] border border-[#11241a]/10 p-5 shadow-sm flex-1">
                            <h3 className="text-[#11241a] font-serif font-bold text-lg mb-3">Quick Links</h3>
                            <div className="grid grid-cols-2 gap-2.5">
                                <button className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all text-gray-600 hover:text-[#11241a]">
                                    <Library size={18} className="text-[#D4AF37]" />
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-center">Library</span>
                                </button>
                                <button className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all text-gray-600 hover:text-[#11241a]">
                                    <AlertTriangle size={18} className="text-[#D4AF37]" />
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-center">Grievance</span>
                                </button>
                                <button className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all text-gray-600 hover:text-[#11241a]">
                                    <Wifi size={18} className="text-[#D4AF37]" />
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-center">Wi-Fi</span>
                                </button>
                                <button className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all text-gray-600 hover:text-[#11241a]">
                                    <BookOpen size={18} className="text-[#D4AF37]" />
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-center">Resources</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentOverview

