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
        <div className='min-h-screen flex flex-col bg-[#F8F9FA] font-sans'>

            {/* Top Navbar */}
            <header className='bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm flex flex-col'>
                
                {/* Top Tier: Brand & Profile */}
                <div className='max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center shrink-0'>
                    <div onClick={() => navigate('/')} className='flex items-center gap-3 cursor-pointer'>
                        <img className='w-8 sm:w-10 mix-blend-multiply' src={assets.iet_logo_2} alt="IET Logo" />
                        <div>
                            <h1 className='text-base sm:text-lg font-extrabold text-[#0B2447] tracking-tight leading-tight'>
                                CSED Placement Portal
                            </h1>
                            <div className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                Coordinator Dashboard
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center gap-5'>
                        <div className='text-right hidden sm:block'>
                            <p className='text-sm font-extrabold text-[#0F172A] leading-tight'>Admin Access</p>
                            <button onClick={logout} className='text-xs text-red-500 hover:text-red-700 font-bold mt-0.5 transition-colors flex items-center justify-end gap-1 w-full'>
                                <LogOut size={12} /> Logout
                            </button>
                        </div>
                        <div className='relative group'>
                            <div className="w-9 h-9 rounded-full bg-[#0B2447] flex items-center justify-center shadow-sm border border-gray-200 cursor-pointer text-white font-extrabold text-sm hover:scale-105 transition-transform">
                                C
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Tier: Navigation Links */}
                <div className='max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 shrink-0'>
                    <div className='flex items-center gap-2 overflow-x-auto -mb-px [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                end={link.exact}
                                className={({ isActive }) => `
                                    flex items-center gap-2 py-3.5 px-4 whitespace-nowrap text-sm font-bold transition-all border-b-2
                                    ${isActive 
                                        ? 'border-[#0B2447] text-[#0B2447]' 
                                        : 'border-transparent text-gray-500 hover:text-[#0F172A] hover:border-gray-300'}
                                `}
                            >
                                <link.icon size={16} />
                                {link.label}
                            </NavLink>
                        ))}
                        {/* Mobile Logout Button */}
                        <button
                            onClick={logout}
                            className='sm:hidden flex items-center gap-2 py-3.5 px-4 whitespace-nowrap text-sm font-bold text-red-500 border-b-2 border-transparent transition-all hover:text-red-700'
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className='flex-1 w-full flex flex-col relative'>
                <Outlet />
            </main>

        </div>
    )
}

export default Dashboard