import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useUser, RedirectToSignIn, useAuth } from '@clerk/react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { CheckCircle, Clock, XCircle, Printer, FileCheck, ArrowRight } from 'lucide-react'
import NoDuesForm from '../components/NoDuesForm'


const THEME = {
    navy: '#001845',
    navySoft: '#0a234f',
    brand: '#003087',
    brandHover: '#00256b',
    blue50: '#eff6ff',
    blue100: '#dbeafe',
    blue200: '#bfdbfe',
    blue300: '#93c5fd',
    blue400: '#60a5fa',
    pageBg: '#f8fafc',
    cardBg: '#ffffff',
    border: '#e5e7eb',
    borderSoft: '#eef2f7',
    text: '#1f2937',
    textMuted: '#6b7280',
    textFaint: '#9ca3af',
    successBg: '#eff6ff',
    successText: '#1d4ed8',
    dangerBg: '#fef2f2',
    dangerBorder: '#fecaca',
    dangerText: '#b91c1c',
}

const NoDues = () => {
    const { backendUrl } = useContext(AppContext)
    const { isSignedIn, user, isLoaded } = useUser()
    const { getToken } = useAuth() // Securely handles background token caching
    
    const [existingRequest, setExistingRequest] = useState(null)
    const [loadingData, setLoadingData] = useState(true)
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const [formData, setFormData] = useState({
        name: user?.fullName || '',
        rollNumber: '',
        branch: '',
        year: '',
        company: '',
        package: '',
        letterPdf: null,
        type: 'Job'
    })

    useEffect(() => {
        const fetchStatus = async () => {
            // Guard clause: Do nothing until Clerk is completely ready
            if (!isLoaded) return
            
            if (!isSignedIn) {
                setLoadingData(false)
                return
            }

            try {
                // Fetch the JWT bearer token cleanly from the hook hook context
                const token = await getToken()
                
                if (!token) {
                    console.warn("Clerk authentication token is still generating...")
                    return
                }

                const response = await axios.get(`${backendUrl}/api/student/no-dues/status`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (response.data.success && response.data.request) {
                    setExistingRequest(response.data.request)
                }
            } catch (error) {
                console.error('Failed to fetch no dues status:', error)
                // If it's a 401/unauthenticated error, we gracefully handle it without throwing a crash loop
                if (error.response?.status === 401) {
                    toast.error("Session expired. Please log out and sign in again.")
                }
            } finally {
                setLoadingData(false)
            }
        }

        fetchStatus()
    }, [isSignedIn, isLoaded, backendUrl, getToken])

    if (!isSignedIn) return <RedirectToSignIn forceRedirectUrl="/no-dues" />

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const uploadData = new FormData()
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                uploadData.append(key, formData[key])
            }
        })

        try {
            const token = await window.Clerk.session.getToken()
            const response = await axios.post(`${backendUrl}/api/student/no-dues`, uploadData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.data.success) {
                toast.success(response.data.message)
                setExistingRequest({ status: 'Pending' })
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    const approvedFormData = existingRequest?.status === 'Approved'
        ? {
            name: existingRequest.formData?.name || existingRequest.name,
            rollNumber: existingRequest.formData?.rollNumber || existingRequest.rollNumber,
            branch: existingRequest.formData?.branch || existingRequest.branch,
            year: existingRequest.formData?.year || existingRequest.year,
            company: existingRequest.formData?.company || existingRequest.company,
            package: existingRequest.formData?.package || existingRequest.package,
            type: existingRequest.formData?.type || existingRequest.type,
            approvedAt: existingRequest.formData?.approvedAt || existingRequest.approvedAt,
            projectStatus: existingRequest.formData?.projectStatus || 'Yes',
            placementRecordStatus: existingRequest.formData?.placementRecordStatus || 'Yes',
            feedbackStatus: existingRequest.formData?.feedbackStatus || 'Yes',
            signatureSvg: existingRequest.formData?.signatureSvg || null,
        }
        : null

    const handlePrint = () => {
        const paperEl = document.querySelector('.paper')
        if (!paperEl) return

        const printWindow = window.open('', '_blank', 'width=960,height=700')
        printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
    <title>No Dues Certificate — ${approvedFormData?.name || ''}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Times New Roman", Times, serif; background: white; }
        @page { margin: 10mm; size: A4; }
        .paper { width: 100%; background: white; padding: 20px 30px; color: #111; }
        .dept { text-align: center; font-size: 14px; margin-bottom: 2px; }
        .college { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 12px; }
        .title { text-align: center; font-size: 20px; font-weight: bold; text-decoration: underline; margin-bottom: 8px; }
        .subtitle { text-align: center; font-size: 14px; margin-bottom: 16px; }
        .student-details { display: flex; justify-content: space-between; margin-bottom: 16px; padding: 0 20px; gap: 20px; }
        .student-details ul { list-style: none; font-size: 13px; line-height: 2; width: 48%; }
        .student-field { display: flex; align-items: center; gap: 8px; }
        .student-field label { font-weight: bold; white-space: nowrap; min-width: 100px; }
        .student-input, .student-value { flex: 1; border: none; border-bottom: 1px solid #111; font-family: "Times New Roman", Times, serif; font-size: 13px; padding: 1px 3px; display: inline-block; min-width: 60px; background: transparent; }
        .info { font-size: 13px; margin-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; margin-top: 6px; margin-bottom: 20px; }
        th, td { border: 1px solid #999; padding: 6px 8px; vertical-align: middle; font-size: 12px; }
        th { text-align: left; font-weight: bold; }
        .sn { width: 7%; text-align: center; }
        .activity { width: 30%; }
        .status { width: 14%; text-align: center; }
        .verify { width: 25%; }
        .sign { width: 24%; text-align: center; }
        .signature-box { display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.2; }
        .signature-svg, .signature-svg-wrapper svg { width: 70px; height: auto; display: block; margin: 0 auto 2px; }
        .sign-name { font-size: 11px; font-weight: bold; margin-top: 2px; }
        .sign-date { font-size: 10px; margin-top: 2px; }
        .bottom { display: flex; justify-content: space-between; gap: 20px; margin-top: 6px; }
        .box { width: 48%; }
        .box-title { font-size: 13px; font-weight: bold; margin-bottom: 6px; }
        .box ul { padding-left: 20px; font-size: 12px; line-height: 1.6; }
    </style>
</head>
<body>${paperEl.outerHTML}</body>
</html>`)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
            printWindow.print()
            printWindow.close()
        }, 600)
    }

    if (!loadingData && existingRequest?.status === 'Approved') {
        return (
            <div className="min-h-screen flex flex-col" style={{ background: THEME.pageBg }}>
                <Navbar />

                <AnimatePresence mode="wait">
                    {!showForm ? (
                        <motion.div
                            key="cert-card"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="flex-grow flex items-center justify-center p-4 sm:p-6"
                        >
                            <div
                                style={{
                                    width: '100%',
                                    maxWidth: '580px',
                                    background: THEME.cardBg,
                                    borderRadius: '20px',
                                    border: `1px solid ${THEME.border}`,
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 30px rgba(0, 24, 69, 0.08)'
                                }}
                            >
                                <div className="approved-hero">
                                    <div
                                        style={{
                                            width: 52,
                                            height: 52,
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.14)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            marginTop: 2
                                        }}
                                    >
                                        <FileCheck size={26} color="white" />
                                    </div>

                                    <div style={{ minWidth: 0 }}>
                                        <p
                                            style={{
                                                color: 'rgba(255,255,255,0.72)',
                                                fontSize: 12,
                                                fontWeight: 700,
                                                letterSpacing: '0.08em',
                                                textTransform: 'uppercase',
                                                marginBottom: 4
                                            }}
                                        >
                                            Clearance Status
                                        </p>
                                        <h2
                                            style={{
                                                color: 'white',
                                                fontSize: 24,
                                                fontWeight: 700,
                                                lineHeight: 1.2,
                                                marginBottom: 6
                                            }}
                                        >
                                            No Dues Certificate Ready
                                        </h2>
                                        <p
                                            style={{
                                                color: 'rgba(255,255,255,0.78)',
                                                fontSize: 13.5,
                                                lineHeight: 1.5
                                            }}
                                        >
                                            Your placement record has been verified and approved by the Faculty Coordinator.
                                        </p>
                                    </div>
                                </div>

                                <div className="approved-grid">
                                    {[
                                        { label: 'Student Name', value: approvedFormData.name },
                                        { label: 'Roll Number', value: approvedFormData.rollNumber },
                                        { label: 'Branch', value: approvedFormData.branch },
                                        { label: 'Batch', value: approvedFormData.year },
                                    ].map(({ label, value }) => (
                                        <div key={label}>
                                            <p
                                                style={{
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    color: THEME.textFaint,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.06em',
                                                    marginBottom: 2
                                                }}
                                            >
                                                {label}
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    color: THEME.text,
                                                    wordBreak: 'break-word'
                                                }}
                                            >
                                                {value || '—'}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div
                                    className="approved-meta"
                                    style={{
                                        borderBottom: `1px solid ${THEME.borderSoft}`
                                    }}
                                >
                                    <span
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            background: THEME.blue50,
                                            color: THEME.successText,
                                            border: `1px solid ${THEME.blue200}`,
                                            borderRadius: 20,
                                            padding: '5px 14px',
                                            fontSize: 12.5,
                                            fontWeight: 700,
                                            maxWidth: '100%',
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {approvedFormData.type === 'Higher Studies' ? '🎓' : '💼'}
                                        {approvedFormData.company}
                                    </span>

                                    <span
                                        style={{
                                            fontSize: 13,
                                            color: THEME.textMuted,
                                            fontWeight: 500,
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {approvedFormData.package}
                                    </span>
                                </div>

                                <div
                                    style={{
                                        padding: '24px clamp(16px, 5vw, 40px)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 12
                                    }}
                                >
                                    <button
                                        onClick={() => setShowForm(true)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 8,
                                            width: '100%',
                                            padding: '13px 24px',
                                            background: THEME.brand,
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: 10,
                                            fontSize: 14,
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            letterSpacing: '0.01em',
                                            transition: 'background 0.15s'
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = THEME.brandHover)}
                                        onMouseLeave={e => (e.currentTarget.style.background = THEME.brand)}
                                    >
                                        View Certificate <ArrowRight size={16} />
                                    </button>
                                </div>

                                <div style={{ padding: '0 clamp(16px, 5vw, 40px) 20px', textAlign: 'center' }}>
                                    <p
                                        style={{
                                            fontSize: 12,
                                            color: THEME.textFaint,
                                            lineHeight: 1.5
                                        }}
                                    >
                                        Submit the printed certificate to the Head of Department to complete your No Dues process.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="cert-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-grow"
                        >
                            <div
                                className="sticky-cert-bar"
                                style={{
                                    background: 'white',
                                    borderBottom: `1px solid ${THEME.border}`,
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 40,
                                    boxShadow: '0 1px 10px rgba(0, 24, 69, 0.08)'
                                }}
                            >
                                <div className="sticky-cert-bar__left">
                                    <div
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            background: THEME.blue50,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}
                                    >
                                        <CheckCircle size={15} color={THEME.brand} />
                                    </div>

                                    <div style={{ minWidth: 0 }}>
                                        <p
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 700,
                                                color: THEME.text,
                                                lineHeight: 1.2
                                            }}
                                        >
                                            No Dues Certificate
                                        </p>
                                        <p
                                            style={{
                                                fontSize: 11.5,
                                                color: THEME.textMuted,
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            {approvedFormData.name} · {approvedFormData.rollNumber}
                                        </p>
                                    </div>
                                </div>

                                <div className="sticky-cert-bar__actions">
                                    <button
                                        onClick={() => setShowForm(false)}
                                        style={{
                                            padding: '10px 18px',
                                            borderRadius: 8,
                                            border: `1px solid ${THEME.border}`,
                                            background: 'white',
                                            fontSize: 13,
                                            fontWeight: 500,
                                            color: THEME.textMuted,
                                            cursor: 'pointer',
                                            transition: 'background 0.15s',
                                            minHeight: 44
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                                    >
                                        ← Back
                                    </button>

                                    <button
                                        onClick={handlePrint}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 7,
                                            padding: '10px 20px',
                                            borderRadius: 8,
                                            border: 'none',
                                            background: THEME.brand,
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: 'white',
                                            cursor: 'pointer',
                                            transition: 'background 0.15s',
                                            minHeight: 44
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = THEME.brandHover)}
                                        onMouseLeave={e => (e.currentTarget.style.background = THEME.brand)}
                                    >
                                        <Printer size={14} /> Print / Download PDF
                                    </button>
                                </div>
                            </div>

                            <div style={{ padding: 'clamp(20px, 5vw, 32px) 16px', background: THEME.pageBg }}>
                                <NoDuesForm prefillData={approvedFormData} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Footer />

                <style>{`
                    .approved-hero {
                        background: linear-gradient(135deg, ${THEME.navy} 0%, ${THEME.brand} 100%);
                        padding: 32px clamp(16px, 5vw, 40px) 28px;
                        display: flex;
                        align-items: flex-start;
                        gap: 18px;
                    }

                    .approved-grid {
                        padding: 20px clamp(16px, 5vw, 40px);
                        border-bottom: 1px solid ${THEME.borderSoft};
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 14px;
                    }

                    .approved-meta {
                        padding: 16px clamp(16px, 5vw, 40px);
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        flex-wrap: wrap;
                    }

                    .sticky-cert-bar {
                        padding: 12px clamp(16px, 4vw, 32px);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 16px;
                    }

                    .sticky-cert-bar__left {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        min-width: 0;
                        flex: 1;
                    }

                    .sticky-cert-bar__actions {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        flex-wrap: wrap;
                        justify-content: flex-end;
                    }

                    @media (max-width: 640px) {
                        .approved-hero {
                            flex-direction: column;
                            gap: 14px;
                        }

                        .approved-grid {
                            grid-template-columns: 1fr;
                            gap: 12px;
                        }

                        .sticky-cert-bar {
                            flex-direction: column;
                            align-items: stretch;
                        }

                        .sticky-cert-bar__actions {
                            width: 100%;
                            justify-content: stretch;
                            flex-direction: column;
                        }

                        .sticky-cert-bar__actions button {
                            width: 100%;
                        }
                    }
                `}</style>
            </div>
        )
    }

    if (loadingData) {
        return (
            <div className="min-h-screen flex flex-col" style={{ background: THEME.pageBg }}>
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div
                        className="w-8 h-8 rounded-full border-4 animate-spin"
                        style={{
                            borderColor: THEME.blue200,
                            borderTopColor: THEME.brand
                        }}
                    />
                </div>
                <Footer />
            </div>
        )
    }

    if (existingRequest?.status === 'Pending') {
        return (
            <div className="min-h-screen flex flex-col" style={{ background: THEME.pageBg }}>
                <Navbar />
                <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            width: '100%',
                            maxWidth: 480,
                            background: THEME.cardBg,
                            borderRadius: 20,
                            border: `1px solid ${THEME.border}`,
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0, 24, 69, 0.08)'
                        }}
                    >
                        <div
                            className="pending-hero"
                            style={{
                                background: `linear-gradient(135deg, ${THEME.navy} 0%, ${THEME.brand} 100%)`,
                            }}
                        >
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.14)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}
                            >
                                <Clock size={24} color="white" />
                            </div>

                            <div style={{ minWidth: 0 }}>
                                <p
                                    style={{
                                        color: 'rgba(255,255,255,0.72)',
                                        fontSize: 11,
                                        fontWeight: 700,
                                        letterSpacing: '0.09em',
                                        textTransform: 'uppercase',
                                        marginBottom: 4
                                    }}
                                >
                                    Under Review
                                </p>
                                <h2
                                    style={{
                                        color: 'white',
                                        fontSize: 22,
                                        fontWeight: 700,
                                        lineHeight: 1.2,
                                        marginBottom: 6
                                    }}
                                >
                                    Approval Pending
                                </h2>
                                <p
                                    style={{
                                        color: 'rgba(255,255,255,0.78)',
                                        fontSize: 13,
                                        lineHeight: 1.6
                                    }}
                                >
                                    Your submission is currently under review by the placement coordinator. You will be notified once it is processed.
                                </p>
                            </div>
                        </div>

                        <div style={{ padding: '24px clamp(16px, 5vw, 40px)' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '14px 18px',
                                    background: THEME.blue50,
                                    borderRadius: 10,
                                    border: `1px solid ${THEME.blue200}`
                                }}
                            >
                                <span style={{ fontSize: 20, flexShrink: 0 }}>⏳</span>
                                <p
                                    style={{
                                        fontSize: 13,
                                        color: THEME.brand,
                                        lineHeight: 1.5
                                    }}
                                >
                                    Typically reviewed within <strong>1–2 working days</strong>. Check back here for updates.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <Footer />

                <style>{`
                    .pending-hero {
                        padding: 32px clamp(16px, 5vw, 40px) 28px;
                        display: flex;
                        align-items: flex-start;
                        gap: 18px;
                    }

                    @media (max-width: 640px) {
                        .pending-hero {
                            flex-direction: column;
                            gap: 14px;
                        }
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ background: THEME.pageBg }}>
            <Navbar />

            <div className="flex-grow flex items-center justify-center p-4 sm:p-6 py-8 sm:py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        width: '100%',
                        maxWidth: 680,
                        background: THEME.cardBg,
                        borderRadius: 20,
                        border: `1px solid ${THEME.border}`,
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0, 24, 69, 0.08)'
                    }}
                >
                    <div
                        style={{
                            background: `linear-gradient(135deg, ${THEME.navy} 0%, ${THEME.navySoft} 45%, ${THEME.brand} 100%)`,
                            padding: '32px clamp(16px, 5vw, 40px) 28px',
                            borderBottom: `1px solid ${THEME.borderSoft}`
                        }}
                    >
                        <p
                            style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: 'rgba(255,255,255,0.72)',
                                letterSpacing: '0.09em',
                                textTransform: 'uppercase',
                                marginBottom: 6
                            }}
                        >
                            Department of Computer Science &amp; Engineering
                        </p>
                        <h1
                            style={{
                                fontSize: 'clamp(22px, 4vw, 24px)',
                                fontWeight: 700,
                                color: 'white',
                                marginBottom: 8,
                                lineHeight: 1.2
                            }}
                        >
                            No Dues Clearance Form
                        </h1>
                        <p
                            style={{
                                fontSize: 14,
                                color: 'rgba(255,255,255,0.82)',
                                lineHeight: 1.6
                            }}
                        >
                            Submit your placement or higher studies outcome to complete your graduation clearance process.
                        </p>

                        {existingRequest?.status === 'Rejected' && (
                            <div
                                style={{
                                    marginTop: 16,
                                    padding: '12px 16px',
                                    background: 'rgba(255,255,255,0.96)',
                                    borderRadius: 10,
                                    border: `1px solid ${THEME.dangerBorder}`,
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 10
                                }}
                            >
                                <XCircle size={17} color={THEME.dangerText} style={{ flexShrink: 0, marginTop: 1 }} />
                                <p
                                    style={{
                                        fontSize: 13,
                                        color: THEME.dangerText,
                                        lineHeight: 1.5
                                    }}
                                >
                                    <strong>Your previous submission was rejected.</strong><br />
                                    Reason: {existingRequest.remarks || "No reason provided."}<br />
                                    Please verify your details and re-submit with the correct information below.
                                </p>
                            </div>
                        )}
                    </div>

                    <div style={{ padding: '28px clamp(16px, 5vw, 40px) 36px' }}>
                        <div
                            className="type-toggle-wrap"
                            style={{
                                display: 'flex',
                                gap: 8,
                                padding: 6,
                                background: '#f3f7fd',
                                borderRadius: 12,
                                marginBottom: 28,
                                maxWidth: 320,
                                border: `1px solid ${THEME.border}`
                            }}
                        >
                            {['Job', 'Higher Studies'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    disabled={formData.type === 'Not Placed'}
                                    onClick={() => setFormData({ ...formData, type })}
                                    style={{
                                        flex: 1,
                                        padding: '10px 16px',
                                        borderRadius: 8,
                                        border: 'none',
                                        fontSize: 13,
                                        fontWeight: 700,
                                        cursor: formData.type === 'Not Placed' ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.15s',
                                        background: formData.type === type ? 'white' : 'transparent',
                                        color: formData.type === type ? THEME.brand : THEME.textMuted,
                                        boxShadow: formData.type === type ? '0 1px 6px rgba(0, 24, 69, 0.08)' : 'none',
                                        opacity: formData.type === 'Not Placed' ? 0.5 : 1,
                                        minHeight: 44
                                    }}
                                >
                                    {type === 'Job' ? 'Job Offer' : 'Higher Studies'}
                                </button>
                            ))}
                        </div>

                        <div
                            style={{
                                marginBottom: 20,
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 10
                            }}
                        >
                            <input
                                type="checkbox"
                                id="notPlacedCheck"
                                checked={formData.type === 'Not Placed'}
                                onChange={(e) => setFormData({ ...formData, type: e.target.checked ? 'Not Placed' : 'Job', company: '', package: '' })}
                                style={{ width: 16, height: 16, cursor: 'pointer', marginTop: 2, flexShrink: 0 }}
                            />
                            <label htmlFor="notPlacedCheck" style={{ fontSize: 14, color: THEME.text, cursor: 'pointer', lineHeight: 1.5 }}>
                                Not placed and not going for higher studies
                            </label>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <Field label="Student Name">
                                    <input
                                        required
                                        type="text"
                                        className="glass-input w-full p-3"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Full name"
                                    />
                                </Field>

                                <Field label="Roll Number">
                                    <input
                                        required
                                        type="text"
                                        className="glass-input w-full p-3"
                                        value={formData.rollNumber}
                                        onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
                                        placeholder="University roll no."
                                    />
                                </Field>

                                <Field label="Branch">
                                    <select
                                        required
                                        className="glass-input w-full p-3 appearance-none text-sm bg-white"
                                        value={formData.branch}
                                        onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                    >
                                        <option value="" disabled>Select branch</option>
                                        <option>Computer Science and Engineering-Regular</option>
                                        <option>Computer Science and Engineering-Self Finance</option>
                                        <option>Computer Science and Engineering-Artificial Intelligence</option>
                                    </select>
                                </Field>

                                <Field label="Graduation Year">
                                    <input
                                        required
                                        type="text"
                                        className="glass-input w-full p-3"
                                        value={formData.year}
                                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                                        placeholder="e.g. 2025"
                                    />
                                </Field>

                                <Field label={formData.type === 'Higher Studies' ? 'University / Institute' : 'Company'}>
                                    <input
                                        required={formData.type !== 'Not Placed'}
                                        disabled={formData.type === 'Not Placed'}
                                        type="text"
                                        className="glass-input w-full p-3"
                                        value={formData.company}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        placeholder={formData.type === 'Not Placed' ? 'N/A' : (formData.type === 'Higher Studies' ? 'e.g. IIT Delhi' : 'Company name')}
                                        style={{ opacity: formData.type === 'Not Placed' ? 0.6 : 1 }}
                                    />
                                </Field>

                                <Field label={formData.type === 'Higher Studies' ? 'Program / Degree' : 'Package'}>
                                    <input
                                        required={formData.type !== 'Not Placed'}
                                        disabled={formData.type === 'Not Placed'}
                                        type="text"
                                        className="glass-input w-full p-3"
                                        value={formData.package}
                                        onChange={e => setFormData({ ...formData, package: e.target.value })}
                                        placeholder={formData.type === 'Not Placed' ? 'N/A' : (formData.type === 'Higher Studies' ? 'e.g. M.Tech AI' : 'e.g. 12 LPA')}
                                        style={{ opacity: formData.type === 'Not Placed' ? 0.6 : 1 }}
                                    />
                                </Field>
                            </div>

                            <div style={{ marginBottom: 28 }}>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: THEME.text,
                                        marginBottom: 8,
                                        lineHeight: 1.5
                                    }}
                                >
                                    Proof Document{' '}
                                    <span style={{ color: THEME.textFaint, fontWeight: 400 }}>
                                        ({formData.type === 'Not Placed' ? 'Application Letter — PDF' : 'Offer / Admission Letter — PDF'})
                                    </span>
                                </label>

                                <input
                                    required
                                    type="file"
                                    accept="application/pdf"
                                    className="glass-input w-full p-3 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    onChange={e => setFormData({ ...formData, letterPdf: e.target.files[0] })}
                                />

                                <p
                                    style={{
                                        fontSize: 12,
                                        color: THEME.textFaint,
                                        marginTop: 6,
                                        lineHeight: 1.5
                                    }}
                                >
                                    {formData.type === 'Not Placed'
                                        ? 'Upload a scanned copy or digital PDF of your application letter stating you are not placed.'
                                        : 'Upload a scanned copy or digital PDF of your offer or admission letter.'}
                                </p>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '14px 24px',
                                    background: loading ? '#9ca3af' : THEME.brand,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 10,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    transition: 'background 0.15s',
                                    minHeight: 48
                                }}
                                onMouseEnter={e => {
                                    if (!loading) e.currentTarget.style.background = THEME.brandHover
                                }}
                                onMouseLeave={e => {
                                    if (!loading) e.currentTarget.style.background = THEME.brand
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span
                                            style={{
                                                width: 15,
                                                height: 15,
                                                border: '2px solid rgba(255,255,255,0.35)',
                                                borderTopColor: 'white',
                                                borderRadius: '50%',
                                                display: 'inline-block',
                                                animation: 'spin 0.7s linear infinite'
                                            }}
                                        />
                                        Submitting…
                                    </>
                                ) : (
                                    <>
                                        Submit No Dues Form <ArrowRight size={15} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }

                .glass-input {
                    width: 100%;
                    border: 1px solid ${THEME.border};
                    border-radius: 10px;
                    background: #ffffff;
                    color: ${THEME.text};
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
                    min-height: 44px;
                }

                .glass-input::placeholder {
                    color: ${THEME.textFaint};
                }

                .glass-input:focus {
                    border-color: ${THEME.blue300};
                    box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.15);
                    background: #ffffff;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px 24px;
                    margin-bottom: 20px;
                }

                @media (max-width: 640px) {
                    .glass-input {
                        font-size: 14px;
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }

                    .type-toggle-wrap {
                        max-width: 100% !important;
                        width: 100%;
                    }
                }
            `}</style>

            <Footer />
        </div>
    )
}

const Field = ({ label, children }) => (
    <div>
        <label
            style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: THEME.text,
                marginBottom: 6,
                lineHeight: 1.4
            }}
        >
            {label}
        </label>
        {children}
    </div>
)

export default NoDues