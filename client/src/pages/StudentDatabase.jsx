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
        value === 'reg'
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
    const [statusFilter, setStatusFilter] = useState('All')
    const [activeTab, setActiveTab] = useState('registered')
    const fileInputRef = useRef(null)

    // 👇 FORCE A RE-FETCH WHEN THIS DASHBOARD MOUNTS
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

        // 🔍 TEST THE FIRST RECORD TO SEE WHERE IT DROPS
        if (idx === 0) {// console.("🕵️‍♂️ [FILTER DEBUG] Inspecting first student record:", s);// console.("🔍 Search text:", `"${search}"`, "-> Matches?", matchesSearch);// console.("📐 Branch student vs filter:", `"${s.branch}"` || 'MISSING', "vs", `"${branchFilter}"`, "-> Matches?", matchesBranch);// console.("🛡️ Status:", `isBlacklisted: ${s.isBlacklisted}`, "Filter:", statusFilter, "-> Matches?", matchesStatus);
        }

        return matchesSearch && matchesBranch && matchesStatus
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

        return matchesSearch && matchesBranch;
    }).sort((a, b) => {
        return String(a.rollNumber || '').localeCompare(String(b.rollNumber || ''), undefined, { numeric: true, sensitivity: 'base' });
    })

    const branches = ['All', ...VALID_BRANCHES]

    const exportToCsv = (filename, rows) => {
        if (!rows || rows.length === 0) {
            toast.error('No data available to export.')
            return
        }

        const escapeCsvValue = (value) => {
            const stringValue = value == null ? '' : String(value)
            if (/[",\n]/.test(stringValue)) {
                return `"${stringValue.replace(/"/g, '""')}"`
            }
            return stringValue
        }

        const csvContent = rows
            .map(row => row.map(cell => escapeCsvValue(cell)).join(','))
            .join('\n')

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
                    if (placementInfo.type === 'Job') {
                        placementStatus = `Placed - ${placementInfo.company}`;
                    } else if (placementInfo.type === 'Higher Studies') {
                        placementStatus = `Higher Studies - ${placementInfo.company}`;
                    } else if (placementInfo.type === 'Not Placed') {
                        placementStatus = 'Not Placed';
                    } else {
                        placementStatus = placementInfo.type;
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
                    if (row[i] === '"') {
                        inQuotes = !inQuotes;
                    } else if (row[i] === ',' && !inQuotes) {
                        cols.push(current.trim().replace(/^"|"$/g, ''));
                        current = '';
                    } else {
                        current += row[i];
                    }
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

            if (rollIdx === -1 || nameIdx === -1 || branchIdx === -1 || yearIdx === -1) {
                return toast.error("CSV Headers missing. Required: Roll, Name, Branch, Year. Found: " + headers.join(',').substring(0, 50));
            }

            const records = rows.slice(1).map(row => {
                const cols = parseCsvRow(row);
                let rRoll = cols[rollIdx] ? cols[rollIdx].trim() : '';
                let rName = cols[nameIdx] ? cols[nameIdx].trim() : '';

                if (!rRoll && rName) {
                    const match = rName.match(/^(\d+|\d\.\d+E\+\d+)\s+(.+)$/i);
                    if (match) {
                        rRoll = match[1];
                        rName = match[2];
                    }
                }

                return {
                    rollNumber: rRoll,
                    name: rName,
                    email: emailIdx !== -1 ? cols[emailIdx] : '',
                    branch: cols[branchIdx] ? cols[branchIdx].trim() : '',
                    degree: (degreeIdx !== -1 && cols[degreeIdx]) ? cols[degreeIdx].trim() : 'B.Tech',
                    year: cols[yearIdx] ? cols[yearIdx].trim() : ''
                }
            }).filter(r => r.rollNumber && r.name && r.branch && r.year)

            if (records.length === 0) {
                return toast.error("No valid records found in the CSV. Make sure each row has Roll, Name, Branch, and strictly includes the Year.");
            }

            await axios.post(`${backendUrl}/api/admin/student-records/bulk`, { records }, await getAdminHeaders())
            toast.success(`Successfully processed ${records.length} valid records! Duplicate IDs skipped.`)
            fetchBackendData()
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to parse or upload CSV: " + err.message)// console.(err)
        }

        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='container mx-auto p-2 sm:p-4'
        >
            <div className="flex border-b border-gray-200 mb-6 gap-6">
                <button
                    onClick={() => setActiveTab('registered')}
                    className={`flex items-center gap-2 pb-3 font-semibold transition-colors ${activeTab === 'registered' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Users size={18} /> Registered Accounts
                </button>
                <button
                    onClick={() => setActiveTab('ledger')}
                    className={`flex items-center gap-2 pb-3 font-semibold transition-colors ${activeTab === 'ledger' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <FileSpreadsheet size={18} /> Master Ledger
                </button>
            </div>

            <div className='glass-panel p-6 rounded-3xl mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 shadow-sm border border-gray-100'>
                <div>
                    <h2 className='text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3'>
                        {activeTab === 'registered' && 'Student Directory'}
                        {activeTab === 'ledger' && 'Official Batch Ledger'}
                    </h2>
                    {activeTab === 'registered' && studentRecords.length > 0 && (
                        <div className="mt-3 flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg text-sm font-bold text-indigo-700 w-fit shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            {students.length} / {studentRecords.length} Master Ledger Students Registered
                        </div>
                    )}
                    <p className='text-gray-500 text-sm mt-3'>
                        {activeTab === 'registered' && 'Manage registered candidates and enforce strict disciplinary actions.'}
                        {activeTab === 'ledger' && 'Upload official CSVs and track the entire enrolled branch.'}
                    </p>
                </div>

                <div className='flex flex-wrap items-center gap-3 w-full xl:w-auto'>
                    <div className="relative flex-grow sm:flex-grow-0 sm:w-56">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            placeholder="Search Name or Roll No..."
                            className="glass-input pl-9 pr-4 py-2.5 text-sm w-full font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter size={14} className="text-gray-400" />
                        </div>
                        <select
                            value={branchFilter}
                            onChange={(e) => setBranchFilter(e.target.value)}
                            className="glass-input pl-9 pr-4 py-2.5 text-sm font-medium min-w-[130px]"
                        >
                            {branches.map(b => (
                                <option key={`branch-${b}`} value={b}>{b === 'All' ? 'All Branches' : b}</option>
                            ))}
                        </select>
                    </div>

                    {activeTab === 'registered' && (
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="glass-input px-4 py-2.5 text-sm font-medium min-w-[130px]"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Active">🟢 Active Only</option>
                                <option value="Blacklisted">🔴 Blacklisted</option>
                            </select>
                        </div>
                    )}

                    {activeTab === 'registered' && (
                        <div className="relative flex gap-2">
                            <button
                                onClick={handleExportRegistered}
                                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl shadow-sm font-semibold text-sm text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-colors border border-gray-200 bg-white cursor-pointer"
                                title="Export Registered Students"
                            >
                                <Download size={16} /> Export Excel
                            </button>
                        </div>
                    )}

                    {activeTab === 'ledger' && (
                        <div className="relative flex gap-2">
                            <button
                                onClick={handleExportLedger}
                                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl shadow-sm font-semibold text-sm text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-colors border border-gray-200 bg-white cursor-pointer"
                                title="Export Master Ledger"
                            >
                                <Download size={16} /> Export Excel
                            </button>
                            <button
                                onClick={handleClearLedger}
                                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl shadow-sm font-semibold text-sm text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors border border-gray-200 bg-white cursor-pointer"
                                title="Clear Entire Ledger"
                            >
                                <Trash2 size={16} /> Clear
                            </button>
                            <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="btn-primary flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl shadow-md"
                            >
                                <Upload size={16} /> Import CSV
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className='glass-panel rounded-3xl overflow-hidden border border-gray-100 bg-white/50 shadow-sm'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left whitespace-nowrap'>
                        <thead className='bg-gray-50/80 border-b border-gray-100 text-gray-600 font-bold uppercase tracking-wider text-xs'>
                            <tr>
                                <th className='py-4 px-6'>Roll Number</th>
                                <th className='py-4 px-6'>Full Name</th>
                                <th className='py-4 px-6'>{activeTab === 'ledger' ? 'Course Details' : 'Branch'}</th>
                                {activeTab === 'registered' && <th className='py-4 px-6 text-center'>Account Status</th>}
                                {activeTab === 'ledger' && <th className='py-4 px-6 text-center'>Placement Status</th>}
                                <th className='py-4 px-6 text-center'>{activeTab === 'ledger' ? 'Verification & Actions' : 'Quick Action'}</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {activeTab === 'registered' && filteredStudents.map((student, index) => (
                                <tr key={index} className={`transition-colors ${student.isBlacklisted ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-blue-50/20'}`}>
                                    <td className='py-3 px-6 font-semibold text-gray-600'>
                                        {student.rollNumber}
                                    </td>
                                    <td className='py-3 px-6'>
                                        <span className={`font-bold ${student.isBlacklisted ? 'text-red-700' : 'text-gray-800'}`}>
                                            {student.name}
                                        </span>
                                    </td>
                                    <td className='py-3 px-6'>
                                        <span className="text-gray-500 font-medium">
                                            {student.branch}
                                        </span>
                                    </td>
                                    <td className='py-3 px-6 text-center'>
                                        {student.isBlacklisted ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                                                <ShieldAlert size={12} /> BANNED
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                                                <UserCheck size={12} /> ACTIVE
                                            </span>
                                        )}
                                    </td>
                                    <td className='py-3 px-6 text-center'>
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => handleToggleBlacklist(student._id)}
                                                title={student.isBlacklisted ? "Lift Ban" : "Blacklist Student"}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${student.isBlacklisted
                                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                                    : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'
                                                    }`}
                                            >
                                                {student.isBlacklisted ? <UserCheck size={14} /> : <UserX size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {activeTab === 'ledger' && filteredLedgerRecords.map((record, index) => {
                                const isRegistered = students.some(rs => rs.rollNumber === record.rollNumber);
                                const placementInfo = offerLetters.find(offer => offer.rollNumber === record.rollNumber);
                                let placementStatus = '-';
                                if (placementInfo) {
                                    if (placementInfo.type === 'Job') {
                                        placementStatus = `Placed - ${placementInfo.company}`;
                                    } else if (placementInfo.type === 'Higher Studies') {
                                        placementStatus = `Higher Studies - ${placementInfo.company}`;
                                    } else if (placementInfo.type === 'Not Placed') {
                                        placementStatus = 'Not Placed';
                                    } else {
                                        placementStatus = placementInfo.type;
                                    }
                                }

                                return (
                                    <tr key={index} className='hover:bg-blue-50/20 transition-colors'>
                                        <td className='py-3 px-6 font-semibold text-gray-600'>{record.rollNumber}</td>
                                        <td className='py-3 px-6 font-bold text-gray-800 break-words'>{record.name}</td>
                                        <td className='py-3 px-6'>
                                            <div className='flex flex-col'>
                                                <span className="text-gray-700 font-semibold text-xs">{record.degree} - {record.branch}</span>
                                                <span className="text-gray-400 text-xs text-left">Graduation Year {record.year}</span>
                                            </div>
                                        </td>
                                        <td className='py-3 px-6 text-center'>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                                                placementInfo?.type === 'Job' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                placementInfo?.type === 'Higher Studies' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                placementInfo?.type === 'Not Placed' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                'bg-gray-100 text-gray-500 border border-gray-200'
                                            }`}>
                                                {placementStatus}
                                            </span>
                                        </td>
                                        <td className='py-3 px-6 text-center'>
                                            <div className="flex items-center justify-center gap-3">
                                                {isRegistered ?
                                                    <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100'>Registered</span> :
                                                    <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200'>Unregistered</span>
                                                }
                                                <button
                                                    onClick={() => handleDeleteLedgerRecord(record._id)}
                                                    title="Delete Ledger Record"
                                                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}

                            {((activeTab === 'registered' && filteredStudents.length === 0) || (activeTab === 'ledger' && filteredLedgerRecords.length === 0)) && (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-gray-500 font-medium">
                                        No students perfectly matched your filters, or database is empty.
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