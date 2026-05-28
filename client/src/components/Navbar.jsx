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
  ChevronDown,
  Menu,
  X
} from 'lucide-react'

const Navbar = () => {
  const { openSignIn } = useClerk()
  const { user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const { setShowRecruiterLogin } = useContext(AppContext)

  const [scrolled, setScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const mobileMenuRef = useRef(null)

  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase() || ''
  const isAlumni = useMemo(() => {
    if (!user || !email) return false
    return !email.endsWith('@ietlucknow.ac.in')
  }, [user, email])

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

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 w-full"
      >
        <div className="h-[3px] w-full bg-gradient-to-r from-[#003087] via-[#0055b3] to-[#003087]" />

        <div
          className={`w-full transition-all duration-300 ${
            scrolled
              ? 'bg-white/96 backdrop-blur-md shadow-[0_1px_0_0_#e5e7eb,0_4px_16px_rgba(0,48,135,0.06)]'
              : 'bg-white border-b border-gray-200/80'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-[72px]">
              <Link to="/" className="flex items-center gap-3 group shrink-0 min-w-0">
                <img
                  src={assets.iet_logo}
                  alt="IET Lucknow"
                  className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
                />
                <div className="border-l border-gray-200 pl-3 leading-snug min-w-0">
                  <p className="text-[13px] font-bold text-[#003087] tracking-tight truncate">
                    IET Lucknow
                  </p>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] truncate hidden xs:block sm:block">
                    Dept. of Computer Science
                  </p>
                </div>
              </Link>

              {user ? (
                <div className="hidden sm:flex items-center gap-1">
                  {!isAlumni && (
                    <Link
                      to="/doubts"
                      className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-gray-600 rounded-md hover:text-[#003087] hover:bg-blue-50/60 transition-all"
                    >
                      <HelpCircle size={14} />
                      Doubts Forum
                    </Link>
                  )}

                  <Link
                    to="/no-dues"
                    className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-gray-600 rounded-md hover:text-[#003087] hover:bg-blue-50/60 transition-all"
                  >
                    <BriefcaseBusiness size={14} />
                    No Dues Form
                  </Link>

                  {!isAlumni && (
                    <Link
                      to="/profile"
                      className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-gray-600 rounded-md hover:text-[#003087] hover:bg-blue-50/60 transition-all"
                    >
                      <UserRound size={14} />
                      Profile
                    </Link>
                  )}

                  <div className="ml-3 pl-3 border-l border-gray-200 flex items-center gap-2.5">
                    <span className="text-[13px] font-medium text-gray-700 hidden lg:block">
                      {user.firstName || 'User'}
                    </span>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => setShowRecruiterLogin(true)}
                    className="px-3 py-2 text-[13px] font-medium text-gray-600 rounded-md hover:text-[#003087] hover:bg-blue-50/60 transition-all"
                  >
                    Coordinator Login
                  </button>

                  <button
                    onClick={() => navigate('/no-dues')}
                    className="px-4 py-2 text-[13px] font-medium text-gray-700 border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50 transition-all"
                  >
                    Alumni Login
                  </button>

                  <button
                    onClick={() => openSignIn()}
                    className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-[#003087] rounded-md hover:bg-[#002266] transition-all shadow-sm"
                  >
                    <LogIn size={13} />
                    Student Login
                  </button>
                </div>
              )}

              <div className="sm:hidden relative" ref={mobileMenuRef}>
                <div className="flex items-center gap-2">
                  {user && <UserButton afterSignOutUrl="/" />}

                  <button
                    onClick={() => setShowMobileMenu((p) => !p)}
                    aria-expanded={showMobileMenu}
                    aria-label="Toggle mobile menu"
                    className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-[#003087]/20 bg-blue-50/70 text-[#003087] shadow-sm"
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
                      {user ? (
                        <div>
                          <div className="px-4 py-3 bg-gradient-to-r from-[#001845] to-[#003087]">
                            <p className="text-sm font-semibold text-white truncate">
                              {user.fullName || user.firstName || 'User'}
                            </p>
                            <p className="text-[11px] text-blue-100 truncate">
                              {email || 'Signed in'}
                            </p>
                          </div>

                          <div className="py-1">
                            {userMobileItems.map((item, i) => (
                              <button
                                key={i}
                                onClick={item.action}
                                className={`w-full flex items-center gap-2.5 text-left px-4 py-3 text-[13px] font-medium text-gray-700 hover:bg-blue-50 hover:text-[#003087] transition-colors ${
                                  i > 0 ? 'border-t border-gray-100' : ''
                                }`}
                              >
                                {item.icon}
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="py-1">
                          {guestMobileItems.map((item, i) => (
                            <button
                              key={i}
                              onClick={item.action}
                              className={`w-full text-left px-4 py-3 text-[13px] font-medium text-gray-700 hover:bg-blue-50 hover:text-[#003087] transition-colors ${
                                i > 0 ? 'border-t border-gray-100' : ''
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="h-[67px] sm:h-[75px]" />
    </>
  )
}

export default Navbar