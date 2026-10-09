import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useAuth, useUser } from '@clerk/react'
import axios from 'axios'
import { Clock3, FileCheck, MessageSquare, AlertCircle } from 'lucide-react'

const StudentOverview = () => {
    const { backendUrl } = useContext(AppContext)
    const { getToken, isLoaded } = useAuth()
    const { user } = useUser()
    const [stats, setStats] = useState({ queries: 0, noDuesStatus: 'Not Applied' })
    const [profileIncomplete, setProfileIncomplete] = useState(false)

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

                const doubtsRes = await axios.get(`${backendUrl}/api/student/doubts`, { headers: { Authorization: `Bearer ${token}` } })
                const noDuesRes = await axios.get(`${backendUrl}/api/student/no-dues/status`, { headers: { Authorization: `Bearer ${token}` } })

                setStats({
                    queries: doubtsRes.data.queries?.length || 0,
                    noDuesStatus: noDuesRes.data.request?.status || 'Not Applied'
                })
            } catch (err) {
                // Ignore errors
            }
        }
        fetchOverview()
    }, [isLoaded, getToken, backendUrl])

    return (
        <div className="w-full">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-[#11241a] mb-2">Welcome, {user?.fullName || 'Student'}!</h2>
                    <p className="text-gray-500 font-medium text-sm">Here is a quick overview of your dashboard activities.</p>
                </div>

                {profileIncomplete && (
                    <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                        <AlertCircle className="text-[#D4AF37] shrink-0 mt-0.5" size={20} />
                        <div>
                            <h3 className="font-bold text-[#11241a] text-sm uppercase tracking-wider mb-1">Incomplete Profile</h3>
                            <p className="text-[#11241a]/80 text-sm font-medium mb-3">Your student profile is missing some mandatory details. Please update it to access all portal features smoothly.</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
        </div>
    )
}

export default StudentOverview
