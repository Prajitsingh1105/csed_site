import { useContext, useEffect, useRef, useState, useMemo } from 'react'
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from '@clerk/react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BriefcaseBusiness,
  UserRound,
  LogIn,
  HelpCircle,
  Menu,
  X,
  Search,
  Eye,
  ChevronDown
} from 'lucide-react'

const Navbar = () => {
  const { openSignIn } = useClerk()
  const { user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const { setShowRecruiterLogin } = useContext(AppContext)

  const [scrolled, setScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isHighContrast, setIsHighContrast] = useState(false)
  const mobileMenuRef = useRef(null)

  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase() || ''
  const isAlumni = useMemo(() => {
    if (!user || !email) return false
    return !email.endsWith('@ietlucknow.ac.in')
  }, [user, email])

  const toggleContrast = () => {
    const next = !isHighContrast
    setIsHighContrast(next)
    if (next) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setShowMobileMenu(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setShowMobileMenu(false)
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') setShowMobileMenu(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const guestMobileItems = [
    {
      label: 'Student Login',
      action: () => {
        openSignIn()
        setShowMobileMenu(false)
      }
    },
    {
      label: 'Alumni Login',
      action: () => {
        navigate('/no-dues')
        setShowMobileMenu(false)
      }
    },
    {
      label: 'Coordinator Login',
      action: () => {
        setShowRecruiterLogin(true)
        setShowMobileMenu(false)
      }
    }
  ]

  const userMobileItems = [
    ...(!isAlumni
      ? [
          {
            label: 'Doubts Forum',
            action: () => {
              navigate('/doubts')
              setShowMobileMenu(false)
            },
            icon: <HelpCircle size={15} />
          }
        ]
      : []),
    {
      label: 'No Dues Form',
      action: () => {
        navigate('/no-dues')
        setShowMobileMenu(false)
      },
      icon: <BriefcaseBusiness size={15} />
    },
    ...(!isAlumni
      ? [
          {
            label: 'Profile',
            action: () => {
              navigate('/profile')
              setShowMobileMenu(false)
            },
            icon: <UserRound size={15} />
          }
        ]
      : [])
  ]

  const handleScrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 100
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 100)
    } else {
      const el = document.getElementById(id)
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 100
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
  }

  const megaMenuItems = [
    { label: 'Academics & Admissions', id: 'academics' },
    { label: 'Placement', id: 'placements' },
    { 
      label: 'People', 
      id: 'people',
      dropdown: [
        { label: 'Regular Faculty', to: '/faculty/regular' },
        { label: 'Contractual Faculty', to: '/faculty/contractual' },
        { label: 'Teaching Supporting', to: '/faculty/supporting' },
        { label: 'Research Scholars', to: '/faculty/scholars' }
      ]
    }
  ]

  const isHomePage = location.pathname === '/';

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 sm:top-5 left-0 right-0 z-50 w-full flex justify-center px-0 sm:px-6 pointer-events-none"
      >
        <div
          className={`pointer-events-auto w-full max-w-[1400px] transition-all duration-300 ${
            scrolled || !isHomePage
              ? 'bg-[#11241a]/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:rounded-full border-b sm:border border-white/10 h-16'
              : 'bg-white/5 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] sm:rounded-full border-b sm:border border-white/10 h-[72px] sm:shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0 min-w-0 mr-4">
              <img
                src={assets.iet_logo}
                alt="IET Lucknow"
                className="h-9 sm:h-10 w-auto object-contain grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="border-l border-white/20 pl-3 leading-snug min-w-0">
                <p className="text-[14px] font-bold text-[#FFFDF8] tracking-tight truncate font-serif">
                  IET Lucknow
                </p>
                <p className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] truncate hidden xs:block sm:block">
                  Dept. of Computer Science
                </p>
              </div>
            </Link>

            {/* Center: Mega Menu Triggers */}
            <div className="hidden lg:flex items-center gap-8">
              {megaMenuItems.map((item) => (
                <div key={item.label} className="relative group h-full flex items-center py-4">
                  {item.dropdown ? (
                    <>
                      <button className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-colors">
                        {item.label}
                        <ChevronDown size={12} className="text-gray-400 group-hover:text-[#D4AF37] transition-transform group-hover:rotate-180" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                        <div className="bg-[#11241a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 overflow-hidden">
                          {item.dropdown.map(subItem => (
                            <Link
                              key={subItem.label}
                              to={subItem.to}
                              className="block px-5 py-2.5 text-[12px] font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => handleScrollTo(item.id)}
                      className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Right: Tools & Auth */}
            <div className="hidden sm:flex items-center gap-4">
              {/* Accessibility & Search */}
              <div className="flex items-center gap-2 pr-4 border-r border-white/20">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-gray-300 hover:bg-white/10 hover:text-white transition-colors" title="Search">
                  <Search size={16} />
                </button>
                <button 
                  onClick={toggleContrast}
                  className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${isHighContrast ? 'bg-white/20 text-[#D4AF37]' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`} title="High Contrast Mode">
                  <Eye size={16} />
                </button>
              </div>

              {user ? (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/no-dues"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold uppercase tracking-wider text-gray-300 rounded-full hover:text-white hover:bg-white/10 transition-all"
                  >
                    Portals
                  </Link>

                  <div className="ml-2 pl-2 flex items-center gap-2.5">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowRecruiterLogin(true)}
                    className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-300 rounded-full hover:text-white hover:bg-white/10 transition-all"
                  >
                    Staff
                  </button>
                  <button
                    onClick={() => navigate('/no-dues')}
                    className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-300 rounded-full hover:text-white hover:bg-white/10 transition-all"
                  >
                    Alumni
                  </button>

                  <button
                    onClick={() => openSignIn()}
                    className="ml-1 flex items-center gap-1.5 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#11241a] bg-[#D4AF37] rounded-full hover:bg-[#e6c148] transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  >
                    <LogIn size={13} />
                    Student Login
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <div className="sm:hidden relative" ref={mobileMenuRef}>
              <div className="flex items-center gap-2">
                {user && <UserButton afterSignOutUrl="/" />}

                <button
                  onClick={() => setShowMobileMenu((p) => !p)}
                  aria-expanded={showMobileMenu}
                  aria-label="Toggle mobile menu"
                  className={`inline-flex items-center justify-center h-10 w-10 rounded-md shadow-sm transition-colors ${
                    scrolled || !isHomePage 
                      ? 'border border-white/20 bg-white/10 text-white hover:bg-white/20'
                      : 'border border-white/20 bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>

              <AnimatePresence>
                {showMobileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-[60]"
                  >
                    <div className="max-h-[80vh] overflow-y-auto">
                      {user && (
                        <div className="px-4 py-4 bg-gradient-to-r from-[#11241a] to-[#1a1728]">
                          <p className="text-sm font-semibold text-white truncate">
                            {user?.fullName || user?.firstName || 'User'}
                          </p>
                          <p className="text-[11px] text-gray-300 truncate">
                            {email || 'Signed in'}
                          </p>
                        </div>
                      )}

                      {/* Main Navigation Links */}
                      <div className="py-2 border-b border-gray-100">
                        {megaMenuItems.map((item) => (
                          <div key={item.label}>
                            {item.dropdown ? (
                              <div className="px-4 py-2">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">{item.label}</p>
                                <div className="space-y-1 pl-3 border-l-2 border-[#D4AF37]/30 ml-1">
                                  {item.dropdown.map(subItem => (
                                    <Link
                                      key={subItem.label}
                                      to={subItem.to}
                                      onClick={() => setShowMobileMenu(false)}
                                      className="block px-3 py-2 text-[13px] font-medium text-gray-600 hover:text-[#11241a] hover:bg-gray-50 rounded-md transition-colors"
                                    >
                                      {subItem.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  handleScrollTo(item.id)
                                  setShowMobileMenu(false)
                                }}
                                className="w-full text-left px-4 py-3 text-[13px] font-bold uppercase tracking-wider text-gray-700 hover:bg-[#11241a]/5 hover:text-[#11241a] transition-colors"
                              >
                                {item.label}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Auth / Tool Links */}
                      <div className="py-2 bg-gray-50/50">
                        {user ? (
                          userMobileItems.map((item, i) => (
                            <button
                              key={i}
                              onClick={item.action}
                              className="w-full flex items-center gap-2.5 text-left px-4 py-3 text-[13px] font-medium text-gray-700 hover:bg-[#11241a]/5 hover:text-[#11241a] transition-colors"
                            >
                              {item.icon}
                              {item.label}
                            </button>
                          ))
                        ) : (
                          guestMobileItems.map((item, i) => (
                            <button
                              key={i}
                              onClick={item.action}
                              className="w-full flex items-center gap-2.5 text-left px-4 py-3 text-[13px] font-medium text-gray-700 hover:bg-[#11241a]/5 hover:text-[#11241a] transition-colors"
                            >
                              {item.icon}
                              {item.label}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="h-[67px] sm:h-[100px]" />

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-32 px-4"
          >
            <div className="bg-[#FFFDF8] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[#11241a]/10 relative">
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
              <div className="p-8 sm:p-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-3">
                  Search Portal
                </p>
                <div className="relative">
                  <Search size={24} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search courses, notices, or directories..."
                    className="w-full text-2xl font-serif text-[#11241a] placeholder-gray-300 bg-transparent border-b-2 border-gray-200 py-4 pl-10 focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0">Popular:</span>
                  <div className="flex flex-wrap gap-2">
                    {['Syllabus 2024', 'Placement Records', 'Holiday List'].map(term => (
                      <button key={term} className="text-[11px] font-medium text-[#11241a] bg-gray-100 px-3 py-1.5 rounded-full hover:bg-[#D4AF37] hover:text-white transition-colors">
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar