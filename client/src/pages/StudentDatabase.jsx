import React, { useContext, useState, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import {
    Search,
    UserX,
    UserCheck,
    ShieldAlert,
    Filter,
    Upload,
    FileSpreadsheet,
    Users,
    Trash2,
    Download
} from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'

const VALID_BRANCHES = [
    'Computer Science and Engineering-Regular',
    'Computer Science and Engineering-Self Finance',
    'Computer Science and Engineering-Artificial Intelligence'
]

const normalizeBranch = (branch) => {
    const value = (branch || '')
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/sciemce/g, 'science')

    if (!value) return ''

    if (
        value.includes('artificial intelligence') ||
        value === 'cse ai' ||
        value === 'ai' ||
        value === 'cse artificial intelligence' ||
        value === 'computer science engineering artificial intelligence' ||
        value === 'computer science and engineering artificial intelligence'
    ) {
        return 'Computer Science and Engineering-Artificial Intelligence'
    }

    if (
        value.includes('self finance') ||
        value === 'cse self finance' ||
        value === 'cse sf' ||
        value === 'sf' ||
        value === 'self finance'
    ) {
        return 'Computer Science and Engineering-Self Finance'
    }

    if (
        value.includes('regular') ||
        value === 'cse regular' ||
        value === 'regular' ||
        value === 'cse reg' ||
        value === 'reg' ||
        value === 'computer science and engineering' ||
        value === 'computer science engineering'
    ) {
        return 'Computer Science and Engineering-Regular'
    }

    if (
        value === 'computer science and engineering regular' ||
        value === 'computer science and engineering self finance' ||
        value === 'computer science and engineering artificial intelligence'
    ) {
        return VALID_BRANCHES.find(b => normalizeBranch(b) === normalizeBranch(value)) || ''
    }

    return ''
}

const StudentDatabase = () => {
    const { students, studentRecords, offerLetters, backendUrl, fetchBackendData, getAdminHeaders } = useContext(AppContext)
    const [search, setSearch] = useState('')
    const [branchFilter, setBranchFilter] = useState('All')
    const [yearFilter, setYearFilter] = useState('2026')
    const [statusFilter, setStatusFilter] = useState('All')
    const [activeTab, setActiveTab] = useState('registered')
    const fileInputRef = useRef(null)

    React.useEffect(() => {
        if (fetchBackendData) {
            fetchBackendData();
        }
    }, []);

    const handleToggleBlacklist = async (id) => {
        try {
            const res = await axios.put(`${backendUrl}/api/admin/students/${id}/blacklist`, {}, await getAdminHeaders())
            fetchBackendData()
            if (res.data.isBlacklisted) toast.error("Student has been blacklisted.")
            else toast.success("Student blacklist lifted.")
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleClearLedger = async () => {
        if (!window.confirm("Are you ABSOLUTELY sure you want to clear the entire Master Ledger? This action cannot be undone.")) return;
        try {
            await axios.delete(`${backendUrl}/api/admin/student-records/clear`, await getAdminHeaders())
            fetchBackendData()
            toast.success("Master ledger has been completely cleared.")
        } catch (error) {
            toast.error("Failed to clear ledger.")
        }
    }

    const handleDeleteLedgerRecord = async (id) => {
        if (!window.confirm("Delete this student record from the ledger?")) return;
        try {
            await axios.delete(`${backendUrl}/api/admin/student-records/${id}`, await getAdminHeaders())
            fetchBackendData()
            toast.success("Record deleted successfully.")
        } catch (error) {
            toast.error("Failed to delete record.")
        }
    }

    const filteredStudents = students.filter((s, idx) => {
        const matchesSearch =
            (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (s.rollNumber || '').includes(search)

        const studentBranchClean = (s.branch || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const filterBranchClean = branchFilter.toLowerCase().replace(/[^a-z0-9]/g, '');

        const matchesBranch =
            branchFilter === 'All' ||
            studentBranchClean.includes(filterBranchClean) ||
            normalizeBranch(s.branch) === normalizeBranch(branchFilter);

        const matchesStatus =
            statusFilter === 'All' ||
            (statusFilter === 'Active' && !s.isBlacklisted) ||
            (statusFilter === 'Blacklisted' && s.isBlacklisted)

        let studentYear = s.passingYear || s.year;
        if (!studentYear) {
            const ledgerRecord = studentRecords.find(r => r.rollNumber === s.rollNumber);
            if (ledgerRecord) studentYear = ledgerRecord.year;
        }
        const matchesYear = yearFilter === 'All' || String(studentYear || '') === yearFilter

        return matchesSearch && matchesBranch && matchesStatus && matchesYear
    })

    const filteredLedgerRecords = studentRecords.filter(s => {
        const matchesSearch = 
            (s.name || '').toLowerCase().includes(search.toLowerCase()) || 
            (s.rollNumber || '').includes(search);
            
        const recordBranchClean = (s.branch || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const filterBranchClean = branchFilter.toLowerCase().replace(/[^a-z0-9]/g, '');

        const matchesBranch =
            branchFilter === 'All' ||
            recordBranchClean.includes(filterBranchClean) ||
            normalizeBranch(s.branch) === normalizeBranch(branchFilter);

        const matchesYear = yearFilter === 'All' || String(s.year || '') === yearFilter;

        return matchesSearch && matchesBranch && matchesYear;
    }).sort((a, b) => {
        return String(a.rollNumber || '').localeCompare(String(b.rollNumber || ''), undefined, { numeric: true, sensitivity: 'base' });
    })

    const branches = ['All', ...VALID_BRANCHES]
    const availableYears = ['All', ...Array.from(new Set([
        ...studentRecords.map(r => r.year),
        ...students.map(s => s.passingYear || s.year)
    ].filter(y => y))).sort().reverse()]

    const exportToCsv = (filename, rows) => {
        if (!rows || rows.length === 0) {
            toast.error('No data available to export.')
            return
        }
        const escapeCsvValue = (value) => {
            const stringValue = value == null ? '' : String(value)
            if (/[",\n]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`
            return stringValue
        }
        const csvContent = rows.map(row => row.map(cell => escapeCsvValue(cell)).join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const handleExportRegistered = () => {
        const rows = [
            ['Roll Number', 'Full Name', 'Branch', 'Account Status'],
            ...filteredStudents.map(student => [
                student.rollNumber || '',
                student.name || '',
                normalizeBranch(student.branch) || student.branch || '',
                student.isBlacklisted ? 'Blacklisted' : 'Active'
            ])
        ]
        exportToCsv('registered-students.csv', rows)
        toast.success('Registered students exported successfully.')
    }

    const handleExportLedger = () => {
        const rows = [
            ['Roll Number', 'Full Name', 'Degree', 'Branch', 'Year', 'Registration Status', 'Placement Status'],
            ...filteredLedgerRecords.map(record => {
                const isRegistered = students.some(rs => rs.rollNumber === record.rollNumber)
                const placementInfo = offerLetters.find(offer => offer.rollNumber === record.rollNumber);
                let placementStatus = '-';
                if (placementInfo) {
                    if (placementInfo.type === 'Job') placementStatus = `Placed - ${placementInfo.company}`;
                    else if (placementInfo.type === 'Higher Studies') placementStatus = `Higher Studies - ${placementInfo.company}`;
                    else if (placementInfo.type === 'Not Placed') placementStatus = 'Not Placed';
                    else placementStatus = placementInfo.type;
                } else if (record.placementType) {
                    const pTypeLower = String(record.placementType).trim().toLowerCase();
                    if (pTypeLower === 'job' || pTypeLower === 'placed') placementStatus = `Placed - ${record.company || ''}`.replace(/ -$/, '').trim();
                    else if (pTypeLower === 'higher studies') placementStatus = `Higher Studies - ${record.company || ''}`.replace(/ -$/, '').trim();
                    else if (pTypeLower === 'not placed') placementStatus = 'Not Placed';
                    else {
                        placementStatus = record.placementType;
                        if (record.company) placementStatus += ` - ${record.company}`;
                    }
                }
                return [
                    record.rollNumber || '',
                    record.name || '',
                    record.degree || '',
                    normalizeBranch(record.branch) || record.branch || '',
                    record.year || '',
                    isRegistered ? 'Registered' : 'Unregistered',
                    placementStatus
                ]
            })
        ]
        exportToCsv('master-ledger.csv', rows)
        toast.success('Master ledger exported successfully.')
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            const text = await file.text()
            const rows = text.split('\n').map(r => r.trim()).filter(r => r.length > 0)
            if (rows.length < 2) return toast.error("File is empty or missing headers")

            const parseCsvRow = (row) => {
                const cols = [];
                let current = '';
                let inQuotes = false;
                for (let i = 0; i < row.length; i++) {
                    if (row[i] === '"') inQuotes = !inQuotes;
                    else if (row[i] === ',' && !inQuotes) {
                        cols.push(current.trim().replace(/^"|"$/g, ''));
                        current = '';
                    } else current += row[i];
                }
                cols.push(current.trim().replace(/^"|"$/g, ''));
                return cols;
            };

            const headers = parseCsvRow(rows[0]).map(h => h.toLowerCase())
            const rollIdx = headers.findIndex(h => h.includes('roll'))
            const nameIdx = headers.findIndex(h => h.includes('name'))
            const emailIdx = headers.findIndex(h => h.includes('email'))
            const branchIdx = headers.findIndex(h => h.includes('branch'))
            const degreeIdx = headers.findIndex(h => h.includes('degree'))
            const yearIdx = headers.findIndex(h => h.includes('year'))
            const placementTypeIdx = headers.findIndex(h => h.includes('placement status') || h.includes('placement type') || h === 'status')
            const companyIdx = headers.findIndex(h => h.includes('company') || h.includes('employer'))

            if (rollIdx === -1 || nameIdx === -1 || branchIdx === -1 || yearIdx === -1) {
                return toast.error("CSV Headers missing. Required: Roll, Name, Branch, Year.");
            }

            const records = rows.slice(1).map(row => {
                const cols = parseCsvRow(row);
                let rRoll = cols[rollIdx] ? cols[rollIdx].trim() : '';
                let rName = cols[nameIdx] ? cols[nameIdx].trim() : '';
                if (!rRoll && rName) {
                    const match = rName.match(/^(\d+|\d\.\d+E\+\d+)\s+(.+)$/i);
                    if (match) { rRoll = match[1]; rName = match[2]; }
                }
                return {
                    rollNumber: rRoll,
                    name: rName,
                    email: emailIdx !== -1 ? cols[emailIdx] : '',
                    branch: cols[branchIdx] ? cols[branchIdx].trim() : '',
                    degree: (degreeIdx !== -1 && cols[degreeIdx]) ? cols[degreeIdx].trim() : 'B.Tech',
                    year: cols[yearIdx] ? cols[yearIdx].trim() : '',
                    placementType: (placementTypeIdx !== -1 && cols[placementTypeIdx]) ? cols[placementTypeIdx].trim() : '',
                    company: (companyIdx !== -1 && cols[companyIdx]) ? cols[companyIdx].trim() : ''
                }
            }).filter(r => r.rollNumber && r.name && r.branch && r.year)

            if (records.length === 0) return toast.error("No valid records found in the CSV.");

            await axios.post(`${backendUrl}/api/admin/student-records/bulk`, { records }, await getAdminHeaders())
            toast.success(`Successfully processed ${records.length} valid records!`)
            fetchBackendData()
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to parse or upload CSV")
        }
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 h-full flex flex-col'>
            
            {/* Structural Tabs */}
            <div className="border-b border-[#11241a]/10 shrink-0">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('registered')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-[12px] uppercase tracking-wider flex items-center gap-2 transition-colors ${activeTab === 'registered' ? 'border-[#11241a] text-[#11241a]' : 'border-transparent text-gray-500 hover:text-[#11241a] hover:border-[#D4AF37]/50'}`}
                    >
                        <Users size={16} /> Registered Accounts
                    </button>
                    <button
                        onClick={() => setActiveTab('ledger')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-[12px] uppercase tracking-wider flex items-center gap-2 transition-colors ${activeTab === 'ledger' ? 'border-[#11241a] text-[#11241a]' : 'border-transparent text-gray-500 hover:text-[#11241a] hover:border-[#D4AF37]/50'}`}
                    >
                        <FileSpreadsheet size={16} /> Master Ledger
                    </button>
                </nav>
            </div>

            {/* Header & Description */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
                <div>
                    <h2 className='text-2xl font-serif font-medium text-[#11241a] tracking-tight'>
                        {activeTab === 'registered' && 'Student Directory'}
                        {activeTab === 'ledger' && 'Official Batch Ledger'}
                    </h2>
                    <p className='text-gray-500 text-[12px] font-bold uppercase tracking-wider mt-2'>
                        {activeTab === 'registered' && 'Manage registered candidates and enforce strict disciplinary actions.'}
                        {activeTab === 'ledger' && 'Upload official CSVs and track the entire enrolled branch.'}
                    </p>
                    {activeTab === 'registered' && studentRecords.length > 0 && (
                        <div className="mt-4 flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1.5 rounded text-[10px] font-bold text-[#11241a] uppercase tracking-widest w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                            {students.length} of {studentRecords.length} Master Ledger Students Registered
                        </div>
                    )}
                </div>
                
                <div className="flex gap-2">
                    {activeTab === 'registered' && (
                        <button onClick={handleExportRegistered} className="flex items-center gap-2 bg-[#FFFDF8] border border-[#11241a]/10 hover:border-[#D4AF37] hover:text-[#11241a] text-gray-700 px-5 py-2.5 rounded text-[11px] font-bold uppercase tracking-wider transition-colors active:scale-95 duration-200">
                            <Download size={14} /> Export CSV
                        </button>
                    )}
                    {activeTab === 'ledger' && (
                        <>
                            <button onClick={handleExportLedger} className="flex items-center gap-2 bg-[#FFFDF8] border border-[#11241a]/10 hover:border-[#D4AF37] hover:text-[#11241a] text-gray-700 px-5 py-2.5 rounded text-[11px] font-bold uppercase tracking-wider transition-colors active:scale-95 duration-200">
                                <Download size={14} /> Export
                            </button>
                            <button onClick={handleClearLedger} className="flex items-center gap-2 bg-white border border-red-200 hover:bg-red-50 hover:text-red-700 text-red-600 px-5 py-2.5 rounded text-[11px] font-bold uppercase tracking-wider transition-colors active:scale-95 duration-200">
                                <Trash2 size={14} /> Clear Ledger
                            </button>
                            <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-[#11241a] hover:bg-[#1a1728] text-[#FFFDF8] px-5 py-2.5 rounded shadow-xl font-bold text-[11px] uppercase tracking-wider transition-all active:scale-95 duration-200">
                                <Upload size={14} /> Import CSV
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Filters Bar */}
            <div className='bg-white p-4 rounded-xl shadow-sm border border-[#11241a]/10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 shrink-0 hover:border-[#D4AF37]/30 transition-colors'>
                <div className='flex flex-wrap items-center gap-3 w-full'>
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            placeholder="Search Name or Roll No..."
                            className="w-full pl-9 pr-4 py-2.5 bg-[#F9F8F5] border border-[#11241a]/10 rounded text-[12px] font-bold uppercase tracking-wider focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all outline-none text-[#11241a] placeholder:text-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#0B2447] outline-none min-w-[140px]">
                            {branches.map(b => (<option key={`branch-${b}`} value={b}>{b === 'All' ? 'All Branches' : b}</option>))}
                        </select>
                    </div>

                    <div className="relative">
                        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#0B2447] outline-none min-w-[120px]">
                            {!availableYears.includes('2026') && yearFilter === '2026' && <option value="2026">2026</option>}
                            {availableYears.map(y => (<option key={`year-${y}`} value={y}>{y === 'All' ? 'All Years' : y}</option>))}
                        </select>
                    </div>

                    {activeTab === 'registered' && (
                        <div className="relative">
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#0B2447] outline-none min-w-[140px]">
                                <option value="All">All Statuses</option>
                                <option value="Active">🟢 Active Only</option>
                                <option value="Blacklisted">🔴 Blacklisted</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Data Table */}
            <div className='bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm flex-1 flex flex-col min-h-0'>
                <div className='overflow-x-auto overflow-y-auto flex-1'>
                    <table className='w-full text-sm text-left'>
                        <thead className='bg-[#F8F9FA] border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px] sticky top-0 z-10'>
                            <tr>
                                <th className='py-4 px-6 w-32'>Roll Number</th>
                                <th className='py-4 px-6'>Student Identity</th>
                                <th className='py-4 px-6'>{activeTab === 'ledger' ? 'Course Details' : 'Branch Details'}</th>
                                {activeTab === 'registered' && <th className='py-4 px-6 w-40'>Access Status</th>}
                                {activeTab === 'ledger' && <th className='py-4 px-6 w-48'>Current Outcome</th>}
                                <th className='py-4 px-6 text-center w-24'>{activeTab === 'ledger' ? 'Actions' : 'Modify'}</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {activeTab === 'registered' && filteredStudents.map((student, index) => (
                                <tr key={index} className={`transition-colors ${student.isBlacklisted ? 'bg-red-50/20' : 'hover:bg-gray-50'}`}>
                                    <td className='py-4 px-6 font-semibold text-gray-500'>{student.rollNumber}</td>
                                    <td className='py-4 px-6 font-bold text-[#0F172A]'>{student.name}</td>
                                    <td className='py-4 px-6 font-medium text-gray-600'>{student.branch}</td>
                                    <td className='py-4 px-6'>
                                        {student.isBlacklisted ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 tracking-wide uppercase">
                                                <ShieldAlert size={12} /> Banned
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 tracking-wide uppercase">
                                                <UserCheck size={12} /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <button
                                            onClick={() => handleToggleBlacklist(student._id)}
                                            title={student.isBlacklisted ? "Restore Access" : "Blacklist Account"}
                                            className={`p-2 rounded-lg border transition-all shadow-sm ${student.isBlacklisted ? 'bg-white text-gray-600 border-gray-200 hover:border-gray-300' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600'}`}
                                        >
                                            {student.isBlacklisted ? <UserCheck size={16} /> : <UserX size={16} />}
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {activeTab === 'ledger' && filteredLedgerRecords.map((record, index) => {
                                const isRegistered = students.some(rs => rs.rollNumber === record.rollNumber);
                                const placementInfo = offerLetters.find(offer => offer.rollNumber === record.rollNumber);
                                let placementStatus = '-';
                                if (placementInfo) {
                                    if (placementInfo.type === 'Job') placementStatus = `Placed - ${placementInfo.company}`;
                                    else if (placementInfo.type === 'Higher Studies') placementStatus = `Higher Studies - ${placementInfo.company}`;
                                    else if (placementInfo.type === 'Not Placed') placementStatus = 'Not Placed';
                                    else placementStatus = placementInfo.type;
                                } else if (record.placementType) {
                                    const pTypeLower = String(record.placementType).trim().toLowerCase();
                                    if (pTypeLower === 'job' || pTypeLower === 'placed') placementStatus = `Placed - ${record.company || ''}`.replace(/ -$/, '').trim();
                                    else if (pTypeLower === 'higher studies') placementStatus = `Higher Studies - ${record.company || ''}`.replace(/ -$/, '').trim();
                                    else if (pTypeLower === 'not placed') placementStatus = 'Not Placed';
                                    else {
                                        placementStatus = record.placementType;
                                        if (record.company) placementStatus += ` - ${record.company}`;
                                    }
                                }

                                const actualPlacementType = placementInfo?.type || (String(record.placementType).trim().toLowerCase() === 'placed' ? 'Job' : record.placementType);

                                return (
                                    <tr key={index} className='hover:bg-gray-50 transition-colors'>
                                        <td className='py-4 px-6 font-semibold text-gray-500'>{record.rollNumber}</td>
                                        <td className='py-4 px-6 font-bold text-[#0F172A]'>{record.name}</td>
                                        <td className='py-4 px-6'>
                                            <p className="font-medium text-gray-700 text-sm">{record.degree} - {record.branch}</p>
                                            <p className="text-gray-400 text-xs font-semibold mt-0.5">Batch of {record.year}</p>
                                        </td>
                                        <td className='py-4 px-6'>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded tracking-wide uppercase border ${
                                                actualPlacementType === 'Job' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                actualPlacementType === 'Higher Studies' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                                actualPlacementType === 'Not Placed' ? 'bg-gray-50 text-gray-600 border-gray-200' :
                                                'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                                {placementStatus}
                                            </span>
                                        </td>
                                        <td className='py-4 px-6 text-center'>
                                            <div className="flex items-center justify-center gap-2">
                                                {isRegistered ?
                                                    <span className='px-2 py-1 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 tracking-wide uppercase'>Registered</span> :
                                                    <span className='px-2 py-1 rounded text-[10px] font-bold bg-white text-gray-400 border border-gray-200 tracking-wide uppercase'>Unregistered</span>
                                                }
                                                <button onClick={() => handleDeleteLedgerRecord(record._id)} title="Delete Record" className="p-1.5 rounded bg-white border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}

                            {((activeTab === 'registered' && filteredStudents.length === 0) || (activeTab === 'ledger' && filteredLedgerRecords.length === 0)) && (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-500 font-medium bg-gray-50/50">
                                        No students found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    )
}

export default StudentDatabase