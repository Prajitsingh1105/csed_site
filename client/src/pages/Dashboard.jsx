import React, { useContext, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { LogOut, Bell, FileCheck, Users, MessageSquare, LayoutDashboard } from 'lucide-react'

const Dashboard = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { companyData, setCompanyData, companyToken, setCompanyToken } = useContext(AppContext)

    // Function to logout for company
    const logout = () => {
        setCompanyToken(null)
        localStorage.removeItem('companyToken')
        setCompanyData(null)
        localStorage.removeItem('companyData')
        navigate('/')
    }

    // Ensure only authenticated coordinators can access the dashboard
    useEffect(() => {
        if (!companyToken) {
            navigate('/')
        }
    }, [companyToken, navigate])

    const navLinks = [
        { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
        { path: '/dashboard/placement-records', label: 'Placement Records', icon: FileCheck },
        { path: '/dashboard/student-database', label: 'Student Base', icon: Users },
        { path: '/dashboard/manage-notices', label: 'Manage Notices', icon: Bell },
        { path: '/dashboard/manage-queries', label: 'Query Forum', icon: MessageSquare },
    ]

    return (
        <div className='min-h-screen flex flex-col bg-[#F9F8F5] font-sans relative'>
            {/* Subtle background noise */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-noise mix-blend-multiply z-0"></div>

            {/* Top Navbar */}
            <header className='bg-[#FFFDF8] border-b border-[#11241a]/10 sticky top-0 z-50 shadow-sm flex flex-col'>
                
                {/* Top Tier: Brand & Profile */}
                <div className='max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center shrink-0'>
                    <div onClick={() => navigate('/')} className='flex items-center gap-3 cursor-pointer group'>
                        <img className='w-8 sm:w-10 mix-blend-multiply transition-transform group-hover:scale-105' src={assets.iet_logo_2} alt="IET Logo" />
                        <div>
                            <h1 className='text-base sm:text-xl font-serif font-medium text-[#11241a] tracking-tight leading-none'>
                                CSED Portal
                            </h1>
                            <div className="text-[9px] sm:text-[10px] text-[#D4AF37] font-bold uppercase tracking-[0.2em] mt-1">
                                Coordinator Dashboard
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center gap-5'>
                        <div className='text-right hidden sm:block'>
                            <p className='text-sm font-bold text-[#11241a] leading-tight'>Admin Access</p>
                            <button onClick={logout} className='text-[11px] text-red-600/80 hover:text-red-600 font-bold mt-0.5 transition-colors flex items-center justify-end gap-1 w-full uppercase tracking-wider'>
                                <LogOut size={12} /> Logout
                            </button>
                        </div>
                        <div className='relative group'>
                            <div className="w-9 h-9 rounded-full bg-[#11241a] flex items-center justify-center shadow-md border border-[#D4AF37]/30 cursor-pointer text-[#D4AF37] font-serif font-medium text-lg group-hover:bg-[#1a1728] transition-colors">
                                C
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Tier: Navigation Links */}
                <div className='bg-[#11241a] border-t border-white/10'>
                    <div className='max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 shrink-0'>
                        <div className='flex items-center gap-2 overflow-x-auto -mb-px [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    end={link.exact}
                                    className={({ isActive }) => `
                                        flex items-center gap-2 py-3.5 px-4 whitespace-nowrap text-[12px] font-bold uppercase tracking-wider transition-colors border-b-2
                                        ${isActive 
                                            ? 'border-[#D4AF37] text-[#D4AF37]' 
                                            : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'}
                                    `}
                                >
                                    <link.icon size={15} />
                                    {link.label}
                                </NavLink>
                            ))}
                            {/* Mobile Logout Button */}
                            <button
                                onClick={logout}
                                className='sm:hidden flex items-center gap-2 py-3.5 px-4 whitespace-nowrap text-[12px] font-bold uppercase tracking-wider text-red-400 border-b-2 border-transparent transition-all hover:bg-red-500/10 hover:text-red-300'
                            >
                                <LogOut size={15} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className='flex-1 w-full flex flex-col relative z-10'>
                <Outlet />
            </main>

        </div>
    )
}

export default Dashboard