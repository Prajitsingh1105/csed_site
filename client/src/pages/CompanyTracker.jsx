import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Search, Filter, ShieldAlert, BadgeCheck, MoreHorizontal, Plus, X, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import axios from 'axios'

const CompanyTracker = () => {
    const { companies, backendUrl, fetchBackendData, getAdminHeaders } = useContext(AppContext)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('All')

    const [showAddModal, setShowAddModal] = useState(false)
    const [newCompany, setNewCompany] = useState({ name: '', sector: '', tag: 'In Discussion', logo: '' })

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewCompany(prev => ({ ...prev, logo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    }

    const handleAddCompany = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${backendUrl}/api/admin/companies`, newCompany, await getAdminHeaders())
            toast.success("Company Added successfully!")
            setShowAddModal(false)
            setNewCompany({ name: '', sector: '', tag: 'In Discussion', logo: '' })
            fetchBackendData()
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleUpdateTag = async (id, newTag) => {
        try {
            await axios.put(`${backendUrl}/api/admin/companies/${id}/tag`, { tag: newTag }, await getAdminHeaders())
            fetchBackendData()
            if(newTag.includes('Fraud')) toast.error(`Company flagged as Fraud!`)
            else toast.success(`Status updated to ${newTag}`)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDeleteCompany = async (id) => {
        if (!window.confirm("Are you sure you want to remove this company?")) return;
        try {
            await axios.delete(`${backendUrl}/api/admin/companies/${id}`, await getAdminHeaders())
            fetchBackendData()
            toast.success("Company organization deleted.")
        } catch (error) { toast.error(error.message) }
    }

    const filteredCompanies = companies.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = filter === 'All' || c.tag === filter
        return matchesSearch && matchesFilter
    })

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='container mx-auto p-2 sm:p-4'
        >
            <div className='glass-panel p-6 rounded-3xl mb-8 flex flex-col lg:flex-row justify-between items-center gap-6 shadow-sm border border-gray-100'>
                <div>
                    <h2 className='text-2xl font-bold text-gray-800 tracking-tight'>Company Intelligence</h2>
                    <p className='text-gray-500 text-sm mt-1'>Track recruiting partners and blacklist fraudulent organizations.</p>
                </div>
                
                <div className='flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto'>
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input 
                            placeholder="Search companies..."
                            className="glass-input pl-9 pr-4 py-2.5 text-sm w-full font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <div className="relative w-full sm:w-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter size={16} className="text-gray-400" />
                        </div>
                        <select 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="glass-input pl-9 pr-8 py-2.5 text-sm w-full font-medium"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Upcoming Drive">Upcoming Drive</option>
                            <option value="In Discussion">In Discussion</option>
                            <option value="Fraud/Blacklisted">Fraud/Blacklisted</option>
                        </select>
                    </div>

                    <button 
                        onClick={() => setShowAddModal(true)}
                        className='btn-primary px-5 py-2.5 flex items-center justify-center gap-2 shadow-md hover:shadow-lg rounded-xl w-full sm:w-auto whitespace-nowrap text-sm'
                    >
                        <Plus size={16} /> Add Company
                    </button>
                </div>
            </div>

            <div className='glass-panel rounded-3xl overflow-hidden border border-gray-100 bg-white/50 shadow-sm'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left whitespace-nowrap'>
                        <thead className='bg-gray-50/80 border-b border-gray-100 text-gray-600 font-medium uppercase tracking-wider text-xs'>
                            <tr>
                                <th className='py-4 px-6'>Organization</th>
                                <th className='py-4 px-6 text-center'>Sector</th>
                                <th className='py-4 px-6 text-center'>Current Status</th>
                                <th className='py-4 px-6 text-center'>Quick Actions</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {filteredCompanies.map((company, index) => (
                                <tr key={index} className='hover:bg-blue-50/20 transition-colors'>
                                    <td className='py-4 px-6'>
                                        <div className='flex items-center gap-4'>
                                            <div className='w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center p-2'>
                                                <img src={company.logo} alt="" className='max-w-full max-h-full object-contain' />
                                            </div>
                                            <span className='font-bold text-gray-800 text-base'>{company.name}</span>
                                        </div>
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <span className="text-gray-600 font-medium">{company.sector}</span>
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                                            ${company.tag.includes('Fraud') ? 'bg-red-100 text-red-700 border border-red-200' : 
                                              company.tag === 'Upcoming Drive' ? 'bg-green-100 text-green-700 border border-green-200' : 
                                              'bg-blue-100 text-blue-700 border border-blue-200'}`}
                                        >
                                            {company.tag.includes('Fraud') && <ShieldAlert size={12} />}
                                            {company.tag}
                                        </span>
                                    </td>
                                    <td className='py-4 px-6 text-center'>
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => handleUpdateTag(company._id, 'Upcoming Drive')}
                                                title="Mark as Upcoming Drive"
                                                className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
                                            >
                                                <BadgeCheck size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateTag(company._id, 'Fraud/Blacklisted')}
                                                title="Mark as Fraud"
                                                className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                                            >
                                                <ShieldAlert size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteCompany(company._id)}
                                                title="Remove Company"
                                                className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:text-red-500 hover:bg-red-50 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCompanies.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-gray-500 font-medium">
                                        No companies found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
                        
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass-panel w-full max-w-md rounded-3xl shadow-2xl relative z-10 p-6 overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Add Organization</h3>
                                    <p className="text-sm text-gray-500">Track a new recruiting partner</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full"><X size={20}/></button>
                            </div>

                            <form onSubmit={handleAddCompany} className="space-y-4 text-sm">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Company Name</label>
                                    <input required type="text" className="glass-input w-full p-3" value={newCompany.name} onChange={e => setNewCompany({...newCompany, name: e.target.value})} placeholder="e.g. Amazon, TCS, etc." />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Operating Sector</label>
                                    <input required type="text" className="glass-input w-full p-3" value={newCompany.sector} onChange={e => setNewCompany({...newCompany, sector: e.target.value})} placeholder="e.g. IT Services, Fintech, E-Commerce" />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Initial Status</label>
                                    <select className="glass-input w-full p-3" value={newCompany.tag} onChange={e => setNewCompany({...newCompany, tag: e.target.value})}>
                                        <option value="In Discussion">In Discussion</option>
                                        <option value="Upcoming Drive">Upcoming Drive</option>
                                        <option value="Fraud/Blacklisted">Fraud/Blacklisted</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Company Logo (Optional)</label>
                                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border border-gray-200 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 w-full" />
                                </div>

                                <button type="submit" className="btn-primary w-full py-3 mt-4 rounded-xl shadow-lg">Save Company Record</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default CompanyTracker
