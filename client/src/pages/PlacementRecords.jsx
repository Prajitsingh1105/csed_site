import React, { useContext, useMemo, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, X, Trash2, Eye, Briefcase, Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const BRANCHES = [
  'Computer Science and Engineering-Regular',
  'Computer Science and Engineering-Self Finance',
  'Computer Science and Engineering-Artificial Intelligence'
]

const normalizeBranch = (branch = '') => {
  const value = branch.trim().toLowerCase()
  if (value.includes('computer') && value.includes('science') && value.includes('regular')) {
    return 'Computer Science and Engineering-Regular'
  }
  if (value.includes('computer') && value.includes('science') && value.includes('self') && value.includes('finance')) {
    return 'Computer Science and Engineering-Self Finance'
  }
  if (value.includes('computer') && value.includes('science') && (value.includes('artificial intelligence') || value.includes('-ai') || value.includes(' ai') || value.endsWith('ai'))) {
    return 'Computer Science and Engineering-Artificial Intelligence'
  }
  return branch
}

const PlacementRecords = () => {
  const {
    offerLetters = [],
    noDuesRequests = [],
    studentRecords = [],
    backendUrl,
    fetchBackendData,
    getAdminHeaders
  } = useContext(AppContext)

  const [activeTab, setActiveTab] = useState('Archive')
  const [search, setSearch] = useState('')
  const [branchFilter, setBranchFilter] = useState('All')
  const [companyFilter, setCompanyFilter] = useState('All')
  const [yearFilter, setYearFilter] = useState('All')
  const [placementStatusFilter, setPlacementStatusFilter] = useState('All')

  const [showAddModal, setShowAddModal] = useState(false)
  const [processingNoDuesId, setProcessingNoDuesId] = useState(null)
  const [isAddingPlacement, setIsAddingPlacement] = useState(false)

  const [newPlacement, setNewPlacement] = useState({
    name: '',
    rollNumber: '',
    branch: '',
    year: '',
    company: '',
    package: '',
    letterPdf: null,
    type: 'Job'
  })

  const resetPlacementForm = () => {
    setNewPlacement({ name: '', rollNumber: '', branch: '', year: '', company: '', package: '', letterPdf: null, type: 'Job' })
  }

  const handleAddPlacement = async (e) => {
    e.preventDefault()
    const uploadData = new FormData()
    Object.keys(newPlacement).forEach((key) => {
      if (newPlacement[key] !== null && newPlacement[key] !== undefined && newPlacement[key] !== '') {
        uploadData.append(key, newPlacement[key])
      }
    })
    try {
      setIsAddingPlacement(true)
      const adminHeaders = await getAdminHeaders()
      await axios.post(`${backendUrl}/api/admin/placements`, uploadData, {
        headers: { ...adminHeaders.headers, 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Record Added!')
      setShowAddModal(false)
      resetPlacementForm()
      await fetchBackendData()
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Failed to add record')
    } finally {
      setIsAddingPlacement(false)
    }
  }

  const handleDeletePlacement = async (id) => {
    if (!window.confirm('Are you sure you want to remove this placement record?')) return
    try {
      await axios.delete(`${backendUrl}/api/admin/placements/${id}`, await getAdminHeaders())
      await fetchBackendData()
      toast.success('Placement record deleted.')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Failed to delete record')
    }
  }

  const handleApproveNoDues = async (id) => {
    try {
      setProcessingNoDuesId(id)
      await axios.put(`${backendUrl}/api/admin/no-dues/${id}/approve`, {}, await getAdminHeaders())
      toast.success('Request Approved!')
      await fetchBackendData()
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Failed to approve request')
    } finally {
      setProcessingNoDuesId(null)
    }
  }

  const handleRejectNoDues = async (id) => {
    const remarks = window.prompt("Enter reason for rejection:");
    if (remarks === null) return;
    try {
      setProcessingNoDuesId(id)
      await axios.put(`${backendUrl}/api/admin/no-dues/${id}/reject`, { remarks }, await getAdminHeaders())
      toast.info('Request Rejected')
      await fetchBackendData()
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Failed to reject request')
    } finally {
      setProcessingNoDuesId(null)
    }
  }

  const filteredRecords = useMemo(() => {
    return offerLetters.filter((record) => {
      const matchesSearch = (record.name || '').toLowerCase().includes(search.toLowerCase()) || (record.rollNumber || '').includes(search)
      const matchesBranch = branchFilter === 'All' || normalizeBranch(record.branch) === branchFilter
      const matchesCompany = companyFilter === 'All' || record.company === companyFilter
      const matchesYear = yearFilter === 'All' || record.year === yearFilter
      return matchesSearch && matchesBranch && matchesCompany && matchesYear
    })
  }, [offerLetters, search, branchFilter, companyFilter, yearFilter])

  const pendingNoDues = useMemo(() => {
    return noDuesRequests?.filter((r) => r.status === 'Pending') || []
  }, [noDuesRequests])

  const placementData = useMemo(() => {
    return (studentRecords || []).map((student) => {
      const offer = (offerLetters || []).find((o) => o.rollNumber === student.rollNumber)
      let status = 'Pending'
      if (offer) {
        if (offer.type === 'Job') status = 'Job'
        else if (offer.type === 'Higher Studies') status = 'Higher Studies'
        else if (offer.type === 'Not Placed') status = 'Not Placed'
      } else if (student.status === 'Not Placed' || student.placementStatus === 'Not Placed') {
        status = 'Not Placed'
      }
      return { ...student, branch: normalizeBranch(student.branch), offer: offer || null, status }
    })
  }, [studentRecords, offerLetters])

  const filteredPlacementData = useMemo(() => {
    return placementData.filter((s) => {
      const matchesSearch = (s.name || '').toLowerCase().includes(search.toLowerCase()) || (s.rollNumber || '').includes(search)
      const matchesBranch = branchFilter === 'All' || normalizeBranch(s.branch) === branchFilter
      const matchesYear = yearFilter === 'All' || s.year === yearFilter
      const matchesStatus = placementStatusFilter === 'All' || s.status === placementStatusFilter
      return matchesSearch && matchesBranch && matchesYear && matchesStatus
    })
  }, [placementData, search, branchFilter, yearFilter, placementStatusFilter])

  const totalStudents = filteredPlacementData.length
  const uploadedCount = filteredPlacementData.filter((s) => s.offer && s.offer.type !== 'Not Placed').length
  const pendingCount = filteredPlacementData.filter((s) => s.status === 'Pending').length
  const unplacedCount = filteredPlacementData.filter((s) => s.status === 'Not Placed').length

  const branches = ['All', 'Computer Science and Engineering-Regular', 'Computer Science and Engineering-Self Finance', 'Computer Science and Engineering-Artificial Intelligence']
  const companiesList = ['All', ...new Set((offerLetters || []).map((r) => r.company).filter(Boolean))]
  const years = activeTab === 'Matcher'
    ? ['All', ...new Set((studentRecords || []).map((s) => s.year).filter(Boolean))]
    : ['All', ...new Set((offerLetters || []).map((r) => r.year).filter(Boolean))]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8'>
      
      {/* Structural Tabs */}
      <div className="border-b border-[#11241a]/10">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('Archive')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-[12px] uppercase tracking-wider flex items-center gap-2 transition-colors ${activeTab === 'Archive' ? 'border-[#11241a] text-[#11241a]' : 'border-transparent text-gray-500 hover:text-[#11241a] hover:border-[#D4AF37]/50'}`}
          >
            Placement Archive
          </button>
          <button
            onClick={() => setActiveTab('Queue')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-[12px] uppercase tracking-wider flex items-center gap-2 transition-colors ${activeTab === 'Queue' ? 'border-[#11241a] text-[#11241a]' : 'border-transparent text-gray-500 hover:text-[#11241a] hover:border-[#D4AF37]/50'}`}
          >
            No Dues Queue
            {pendingNoDues.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === 'Queue' ? 'bg-[#11241a] text-[#FFFDF8]' : 'bg-red-500 text-white'}`}>
                {pendingNoDues.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('Matcher')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-[12px] uppercase tracking-wider flex items-center gap-2 transition-colors ${activeTab === 'Matcher' ? 'border-[#11241a] text-[#11241a]' : 'border-transparent text-gray-500 hover:text-[#11241a] hover:border-[#D4AF37]/50'}`}
          >
            <Briefcase size={16} /> Placement Matcher
          </button>
        </nav>
      </div>

      {/* Stats Row */}
      {activeTab === 'Matcher' ? (
        <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
          <div className='bg-white p-5 rounded-xl border border-[#11241a]/10 shadow-sm flex items-center gap-4 transition-colors hover:border-[#D4AF37]/30'>
            <div className='w-12 h-12 rounded bg-[#11241a]/5 text-[#11241a] border border-[#11241a]/10 flex items-center justify-center font-serif text-xl'>{totalStudents}</div>
            <div>
              <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Master List</p>
              <p className='text-lg font-serif font-medium text-[#11241a]'>Total Scope</p>
            </div>
          </div>
          <div className='bg-white p-5 rounded-xl border border-[#11241a]/10 shadow-sm flex items-center gap-4 transition-colors hover:border-[#D4AF37]/30'>
            <div className='w-12 h-12 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-serif text-xl'>{uploadedCount}</div>
            <div>
              <p className='text-[10px] font-bold text-emerald-600 uppercase tracking-widest'>Verified</p>
              <p className='text-lg font-serif font-medium text-[#11241a]'>Uploaded</p>
            </div>
          </div>
          <div className='bg-white p-5 rounded-xl border border-[#11241a]/10 shadow-sm flex items-center gap-4 transition-colors hover:border-[#D4AF37]/30'>
            <div className='w-12 h-12 rounded bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-serif text-xl'>{pendingCount}</div>
            <div>
              <p className='text-[10px] font-bold text-amber-600 uppercase tracking-widest'>Defaulters</p>
              <p className='text-lg font-serif font-medium text-[#11241a]'>Pending</p>
            </div>
          </div>
          <div className='bg-white p-5 rounded-xl border border-[#11241a]/10 shadow-sm flex items-center gap-4 transition-colors hover:border-[#D4AF37]/30'>
            <div className='w-12 h-12 rounded bg-gray-50 text-gray-500 border border-[#11241a]/10 flex items-center justify-center font-serif text-xl'>{unplacedCount}</div>
            <div>
              <p className='text-[10px] font-bold text-gray-500 uppercase tracking-widest'>Status</p>
              <p className='text-lg font-serif font-medium text-[#11241a]'>Not Placed</p>
            </div>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
          <div className='bg-white p-5 rounded-xl border border-[#11241a]/10 shadow-sm flex items-center gap-4 transition-colors hover:border-[#D4AF37]/30'>
            <div className='w-12 h-12 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 flex items-center justify-center font-serif text-xl'>{offerLetters.length}</div>
            <div>
              <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Outcomes</p>
              <p className='text-lg font-serif font-medium text-[#11241a]'>Total Records</p>
            </div>
          </div>
          <div className='bg-white p-5 rounded-xl border border-[#11241a]/10 shadow-sm flex items-center gap-4 transition-colors hover:border-[#D4AF37]/30'>
            <div className='w-12 h-12 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-serif text-xl'>{offerLetters.filter((r) => r.type === 'Job' || !r.type).length}</div>
            <div>
              <p className='text-[10px] font-bold text-emerald-600 uppercase tracking-widest'>Placed</p>
              <p className='text-lg font-serif font-medium text-[#11241a]'>Job Offers</p>
            </div>
          </div>
          <div className='bg-white p-5 rounded-xl border border-[#11241a]/10 shadow-sm flex items-center gap-4 transition-colors hover:border-[#D4AF37]/30'>
            <div className='w-12 h-12 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-serif text-xl'>{offerLetters.filter((r) => r.type === 'Higher Studies').length}</div>
            <div>
              <p className='text-[10px] font-bold text-indigo-600 uppercase tracking-widest'>Pursuing</p>
              <p className='text-lg font-serif font-medium text-[#11241a]'>Higher Studies</p>
            </div>
          </div>
          <div className='bg-white p-5 rounded-xl border border-[#11241a]/10 shadow-sm flex items-center gap-4 transition-colors hover:border-[#D4AF37]/30'>
            <div className='w-12 h-12 rounded bg-gray-50 text-gray-500 border border-[#11241a]/10 flex items-center justify-center font-serif text-xl'>{offerLetters.filter((r) => r.type === 'Not Placed').length}</div>
            <div>
              <p className='text-[10px] font-bold text-gray-500 uppercase tracking-widest'>Status</p>
              <p className='text-lg font-serif font-medium text-[#11241a]'>Not Placed</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters & Actions Bar */}
      <div className='bg-white p-4 rounded-xl shadow-sm border border-[#11241a]/10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 hover:border-[#D4AF37]/30 transition-colors'>
        <div className='flex flex-wrap items-center gap-3 w-full xl:w-auto flex-1'>
          {(activeTab === 'Archive' || activeTab === 'Matcher') && (
            <div className='relative w-full sm:w-64'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Search size={16} className='text-gray-400' />
              </div>
              <input
                placeholder='Search Student/Roll...'
                className='w-full pl-9 pr-4 py-2.5 bg-[#F9F8F5] border border-[#11241a]/10 rounded text-[12px] font-bold uppercase tracking-wider focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all outline-none text-[#11241a] placeholder:text-gray-400'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}

          {(activeTab === 'Archive' || activeTab === 'Matcher') && (
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className='py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#0B2447] outline-none min-w-[140px]'
            >
              {branches.map((b) => (
                <option key={`branch-${b}`} value={b}>{b === 'All' ? 'All Branches' : b}</option>
              ))}
            </select>
          )}

          {activeTab === 'Archive' && (
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className='py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#0B2447] outline-none min-w-[140px]'
            >
              {companiesList.map((c) => (
                <option key={`company-${c}`} value={c}>{c === 'All' ? 'All Companies' : c}</option>
              ))}
            </select>
          )}

          {(activeTab === 'Archive' || activeTab === 'Matcher') && (
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className='py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#0B2447] outline-none min-w-[120px]'
            >
              {years.map((y) => (
                <option key={`year-${y}`} value={y}>{y === 'All' ? 'All Years' : y}</option>
              ))}
            </select>
          )}

          {activeTab === 'Matcher' && (
            <select
              value={placementStatusFilter}
              onChange={(e) => setPlacementStatusFilter(e.target.value)}
              className='py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#0B2447] outline-none min-w-[140px]'
            >
              <option value='All'>All Statuses</option>
              <option value='Job'>💼 Job Offers</option>
              <option value='Higher Studies'>🎓 Higher Studies</option>
              <option value='Not Placed'>📝 Not Placed</option>
              <option value='Pending'>⌛ Pending</option>
            </select>
          )}
        </div>

        {activeTab === 'Archive' && (
          <button
            onClick={() => setShowAddModal(true)}
            className='bg-[#0B2447] hover:bg-[#113264] text-white px-5 py-2.5 flex items-center justify-center gap-2 shadow-sm rounded-lg flex-shrink-0 text-sm font-bold transition-all active:scale-95'
          >
            <Plus size={16} /> Add Record
          </button>
        )}
      </div>

      {/* Main Data Tables */}
      <div className='bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm'>
        
        {activeTab === 'Archive' && (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm text-left'>
              <thead className='bg-[#F8F9FA] border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]'>
                <tr>
                  <th className='py-4 px-6 w-16 text-center'>#</th>
                  <th className='py-4 px-6'>Student Information</th>
                  <th className='py-4 px-6'>Destination / Institution</th>
                  <th className='py-4 px-6'>Package / Details</th>
                  <th className='py-4 px-6 text-center'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {filteredRecords.map((record, index) => (
                  <tr key={record._id || index} className='hover:bg-gray-50 transition-colors'>
                    <td className='py-4 px-6 text-center font-bold text-gray-400'>{index + 1}</td>
                    <td className='py-4 px-6'>
                      <p className='font-bold text-[#0F172A] text-sm'>{record.name}</p>
                      <p className='text-xs text-gray-500 font-medium mt-0.5'>{record.rollNumber} • {record.branch}</p>
                    </td>
                    <td className='py-4 px-6'>
                      <div className='flex flex-col items-start gap-1'>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border ${record.type === 'Higher Studies' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : record.type === 'Not Placed' ? 'bg-gray-50 text-gray-700 border-gray-200' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                          {record.type === 'Not Placed' ? 'Not Placed' : record.company}
                        </span>
                        <span className={`text-[10px] font-extrabold tracking-wider ${record.type === 'Higher Studies' ? 'text-indigo-400' : record.type === 'Not Placed' ? 'text-gray-400' : 'text-blue-400'}`}>
                          {record.type === 'Higher Studies' ? 'UNIVERSITY' : record.type === 'Not Placed' ? 'APPLICATION' : 'JOB OFFER'}
                        </span>
                      </div>
                    </td>
                    <td className='py-4 px-6'>
                      <span className={`font-black text-sm ${record.type === 'Higher Studies' ? 'text-indigo-600' : record.type === 'Not Placed' ? 'text-gray-400' : 'text-emerald-600'}`}>
                        {record.type === 'Not Placed' ? 'N/A' : record.package}
                      </span>
                    </td>
                    <td className='py-4 px-6'>
                      <div className='flex justify-center items-center gap-2'>
                        <button onClick={() => { if (!record.letterUrl || record.letterUrl === '#') toast.info('No link provided.'); else window.open(record.letterUrl, '_blank') }} className='p-2 rounded-lg bg-gray-50 text-gray-600 border border-gray-200 hover:bg-white hover:border-gray-300 hover:text-blue-600 transition-all shadow-sm' title='View Proof'>
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleDeletePlacement(record._id)} className='p-2 rounded-lg bg-gray-50 text-gray-600 border border-gray-200 hover:bg-white hover:border-red-300 hover:text-red-600 transition-all shadow-sm' title='Delete'>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr><td colSpan='5' className='py-12 text-center text-gray-500 font-medium'>No placement records match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Queue' && (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm text-left'>
              <thead className='bg-[#F8F9FA] border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]'>
                <tr>
                  <th className='py-4 px-6'>Student Information</th>
                  <th className='py-4 px-6'>Declared Outcome</th>
                  <th className='py-4 px-6 text-center'>Proof Document</th>
                  <th className='py-4 px-6 text-center'>Approval Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {pendingNoDues.map((req, index) => {
                  const isProcessing = processingNoDuesId === req._id
                  return (
                    <tr key={req._id || index} className='hover:bg-gray-50 transition-colors'>
                      <td className='py-4 px-6'>
                        <p className='font-bold text-[#0F172A] text-sm'>{req.name}</p>
                        <p className='text-xs text-gray-500 font-medium mt-0.5'>{req.rollNumber} • {req.branch} • {req.year}</p>
                      </td>
                      <td className='py-4 px-6'>
                        <div className='flex flex-col items-start gap-1'>
                          <span className='inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border border-gray-200 bg-white shadow-sm'>
                            {req.type === 'Not Placed' ? 'Not Placed' : `${req.company} • ${req.package}`}
                          </span>
                          <span className={`text-[10px] font-extrabold tracking-wider ${req.type === 'Higher Studies' ? 'text-indigo-400' : req.type === 'Not Placed' ? 'text-gray-400' : 'text-blue-400'}`}>
                            {req.type === 'Higher Studies' ? 'UNIVERSITY' : req.type === 'Not Placed' ? 'APPLICATION' : 'JOB OFFER'}
                          </span>
                        </div>
                      </td>
                      <td className='py-4 px-6 text-center'>
                        {req.letterUrl ? (
                          <a href={req.letterUrl} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:text-blue-800 text-xs font-bold underline underline-offset-2'>
                            View PDF Document
                          </a>
                        ) : <span className='text-gray-400 text-xs font-medium'>Not Uploaded</span>}
                      </td>
                      <td className='py-4 px-6'>
                        <div className='flex justify-center items-center gap-2'>
                          <button onClick={() => handleApproveNoDues(req._id)} disabled={isProcessing} className='px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg font-bold text-xs transition-all disabled:opacity-50 shadow-sm'>
                            {isProcessing ? 'Wait...' : 'Approve'}
                          </button>
                          <button onClick={() => handleRejectNoDues(req._id)} disabled={isProcessing} className='px-4 py-2 bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg font-bold text-xs transition-all disabled:opacity-50 shadow-sm'>
                            {isProcessing ? 'Wait...' : 'Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {pendingNoDues.length === 0 && (
                  <tr><td colSpan='4' className='py-12 text-center text-gray-500 font-medium'>No pending no dues requests in the queue.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Matcher' && (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm text-left'>
              <thead className='bg-[#F8F9FA] border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]'>
                <tr>
                  <th className='py-4 px-6'>Student Identity</th>
                  <th className='py-4 px-6'>Academic Program</th>
                  <th className='py-4 px-6'>Verification Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {filteredPlacementData.map((record, index) => (
                  <tr key={record._id || record.rollNumber || index} className='hover:bg-gray-50 transition-colors'>
                    <td className='py-4 px-6'>
                      <p className='font-bold text-[#0F172A] text-sm'>{record.name}</p>
                      <p className='text-xs font-semibold text-gray-500 mt-0.5'>{record.rollNumber}</p>
                    </td>
                    <td className='py-4 px-6'>
                      <p className='text-sm font-semibold text-gray-700'>{record.degree || 'B.Tech'} - {record.branch}</p>
                      <p className='text-xs text-gray-500 mt-0.5 font-medium'>Batch of {record.year}</p>
                    </td>
                    <td className='py-4 px-6'>
                      {record.status === 'Not Placed' ? (
                        <div className='flex flex-col items-start gap-1'>
                          <span className='inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-gray-50 text-gray-600 border border-gray-200'>📝 Declared Not Placed</span>
                          {record.offer?.letterUrl && record.offer.letterUrl !== '#' && (
                            <a href={record.offer.letterUrl} target='_blank' rel='noopener noreferrer' className='text-blue-500 hover:underline text-[10px] font-bold'>View Proof</a>
                          )}
                        </div>
                      ) : record.offer ? (
                        <div className='flex flex-col items-start gap-1'>
                          <div className='flex items-center gap-2'>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${record.offer.type === 'Higher Studies' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                              {record.offer.type === 'Higher Studies' ? 'University' : 'Placed'}
                            </span>
                            <span className='text-sm font-bold text-gray-800'>{record.offer.company}</span>
                          </div>
                          <div className='flex items-center gap-2 text-xs font-medium text-gray-500'>
                            <span className='font-bold text-gray-700'>{record.offer.package}</span>
                            {record.offer.letterUrl && record.offer.letterUrl !== '#' && (
                              <>
                                <span>•</span>
                                <a href={record.offer.letterUrl} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline font-bold'>Verify Document</a>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200'>
                          <Clock size={12} /> Awaiting Upload
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredPlacementData.length === 0 && (
                  <tr><td colSpan='3' className='py-12 text-center text-gray-500 font-medium'>No students found matching the selected filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isAddingPlacement && setShowAddModal(false)}
              className='absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm'
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className='w-full max-w-lg rounded-2xl bg-white shadow-2xl relative z-10 p-6 overflow-hidden max-h-[90vh] overflow-y-auto border border-gray-200'
            >
              <div className='flex justify-between items-center mb-6 border-b border-gray-100 pb-4'>
                <div>
                  <h3 className='text-xl font-extrabold text-[#0F172A]'>Add Outcome Record</h3>
                  <p className='text-xs font-medium text-gray-500 mt-1'>Record a job offer or higher education admission</p>
                </div>
                <button onClick={() => !isAddingPlacement && setShowAddModal(false)} disabled={isAddingPlacement} className='p-2 bg-gray-50 text-gray-500 hover:text-[#0F172A] hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors disabled:opacity-50'>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddPlacement} className='space-y-5 text-sm'>
                <div className='flex gap-2 p-1 bg-gray-100 rounded-lg border border-gray-200'>
                  <button type='button' onClick={() => setNewPlacement({ ...newPlacement, type: 'Job' })} className={`flex-1 py-2 rounded font-bold text-xs transition-all ${newPlacement.type === 'Job' ? 'bg-white text-[#0F172A] shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                    💼 Job Offer
                  </button>
                  <button type='button' onClick={() => setNewPlacement({ ...newPlacement, type: 'Higher Studies' })} className={`flex-1 py-2 rounded font-bold text-xs transition-all ${newPlacement.type === 'Higher Studies' ? 'bg-white text-[#0F172A] shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                    🎓 Higher Studies
                  </button>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-gray-800 font-bold text-xs mb-1.5 uppercase tracking-wide'>Student Name</label>
                    <input required type='text' className='w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0B2447] focus:border-transparent outline-none font-medium' value={newPlacement.name} onChange={(e) => setNewPlacement({ ...newPlacement, name: e.target.value })} placeholder='Full Name' />
                  </div>
                  <div>
                    <label className='block text-gray-800 font-bold text-xs mb-1.5 uppercase tracking-wide'>Roll Number</label>
                    <input required type='text' className='w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0B2447] focus:border-transparent outline-none font-medium' value={newPlacement.rollNumber} onChange={(e) => setNewPlacement({ ...newPlacement, rollNumber: e.target.value })} placeholder='Roll No.' />
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-gray-800 font-bold text-xs mb-1.5 uppercase tracking-wide'>Branch</label>
                    <select required className='w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0B2447] focus:border-transparent outline-none font-medium text-xs' value={newPlacement.branch} onChange={(e) => setNewPlacement({ ...newPlacement, branch: e.target.value })}>
                      <option value='' disabled>Select branch</option>
                      {BRANCHES.map((branch) => (<option key={branch} value={branch}>{branch}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-gray-800 font-bold text-xs mb-1.5 uppercase tracking-wide'>Graduation Year</label>
                    <input required type='text' className='w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0B2447] focus:border-transparent outline-none font-medium' value={newPlacement.year} onChange={(e) => setNewPlacement({ ...newPlacement, year: e.target.value })} placeholder='e.g. 2026' />
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-gray-800 font-bold text-xs mb-1.5 uppercase tracking-wide'>{newPlacement.type === 'Higher Studies' ? 'University / Institute' : 'Company'}</label>
                    <input required type='text' className='w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0B2447] focus:border-transparent outline-none font-medium' value={newPlacement.company} onChange={(e) => setNewPlacement({ ...newPlacement, company: e.target.value })} placeholder={newPlacement.type === 'Higher Studies' ? 'e.g. IIT Delhi' : 'Company Name'} />
                  </div>
                  <div>
                    <label className='block text-gray-800 font-bold text-xs mb-1.5 uppercase tracking-wide'>{newPlacement.type === 'Higher Studies' ? 'Program / Degree' : 'Package'}</label>
                    <input required type='text' className='w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0B2447] focus:border-transparent outline-none font-medium' value={newPlacement.package} onChange={(e) => setNewPlacement({ ...newPlacement, package: e.target.value })} placeholder={newPlacement.type === 'Higher Studies' ? 'e.g. M.Tech AI' : 'e.g. 12 LPA'} />
                  </div>
                </div>

                <div>
                  <label className='block text-gray-800 font-bold text-xs mb-1.5 uppercase tracking-wide'>Proof Document (PDF)</label>
                  <input type='file' accept='application/pdf' className='w-full p-2 bg-gray-50 border border-gray-200 rounded-lg file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#0B2447] file:text-white hover:file:bg-[#113264] text-sm' onChange={(e) => setNewPlacement({ ...newPlacement, letterPdf: e.target.files?.[0] || null })} />
                  <p className='text-xs font-medium text-gray-500 mt-2'>Provide a PDF copy of the offer or admission letter.</p>
                </div>

                <button type='submit' disabled={isAddingPlacement} className='w-full py-3 mt-2 bg-[#0B2447] hover:bg-[#113264] text-white rounded-lg font-bold shadow-sm transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2'>
                  {isAddingPlacement ? <Loader2 size={18} className='animate-spin' /> : null}
                  {isAddingPlacement ? 'Saving Record...' : 'Save Record'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default PlacementRecords