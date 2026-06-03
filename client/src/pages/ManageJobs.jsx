import { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import Loading from '../components/Loading'
import { motion } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'

const ManageJobs = () => {

  const navigate = useNavigate()

  const { jobs, applications, fetchBackendData, backendUrl, getAdminHeaders } = useContext(AppContext)

    const changeJobVisiblity = async (id) => {
    try {
      await axios.put(`${backendUrl}/api/admin/jobs/${id}/visibility`, {}, await getAdminHeaders())
      fetchBackendData()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this job posting?")) return;
    try {
      await axios.delete(`${backendUrl}/api/admin/jobs/${id}`, await getAdminHeaders())
      fetchBackendData()
      toast.success("Job posting deleted.")
    } catch (error) {
      toast.error(error.message)
    }
  }

  return jobs ? jobs.length === 0 ? (
    <div className='flex flex-col items-center justify-center h-[70vh] gap-4'>
      <p className='text-xl sm:text-2xl text-gray-500 font-medium'>No Jobs Available or posted</p>
      <button onClick={() => navigate('/dashboard/add-job')} className='btn-primary px-6 py-2 flex items-center gap-2'>
        <Plus size={18} /> Add New Job
      </button>
    </div>
  ) : (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='container p-4 md:p-8 max-w-5xl'
    >
      <div className='glass-panel p-6 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm border border-gray-100'>
        <div>
          <h2 className='text-2xl font-bold text-gray-800 tracking-tight'>Manage Job Postings</h2>
          <p className='text-gray-500 text-sm mt-1'>View and manage your active and inactive job listings.</p>
        </div>
        <button onClick={() => navigate('/dashboard/add-job')} className='btn-primary px-6 py-2.5 flex items-center gap-2 shadow-md hover:shadow-lg rounded-xl'>
            <Plus size={18} /> Add New Job
        </button>
      </div>

      <div className='glass-panel rounded-3xl overflow-hidden border border-gray-100 shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-left'>
            <thead className='bg-gray-50/80 border-b border-gray-100 text-gray-600 font-medium'>
              <tr>
                <th className='py-4 px-6 text-center max-sm:hidden'>#</th>
                <th className='py-4 px-6'>Job Title</th>
                <th className='py-4 px-6 max-sm:hidden'>Date Posted</th>
                <th className='py-4 px-6 max-sm:hidden'>Location</th>
                <th className='py-4 px-6 text-center'>Applicants</th>
                <th className='py-4 px-6 text-center'>Quick Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {jobs.map((job, index) => (
                <tr key={index} className='hover:bg-blue-50/30 transition-colors'>
                  <td className='py-4 px-6 text-center max-sm:hidden font-medium text-gray-500'>{index + 1}</td>
                  <td className='py-4 px-6'>
                    <div className="font-semibold text-gray-800">{job.title}</div>
                    <div className="text-xs text-gray-500 font-medium">{job.company || "General"}</div>
                  </td>
                  <td className='py-4 px-6 max-sm:hidden text-gray-500' >{moment(job.date).format('ll')}</td>
                  <td className='py-4 px-6 max-sm:hidden text-gray-500' >{job.location}</td>
                  <td className='py-4 px-6 text-center'>
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold text-xs">
                        {applications ? applications.filter(app => app.jobId === job._id).length : 0}
                    </span>
                  </td>
                  <td className='py-4 px-6 text-center'>
                    <div className='flex items-center justify-center gap-2'>
                        <button 
                            onClick={() => changeJobVisiblity(job._id)} 
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm border
                            ${job.visible ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                        >
                          {job.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                          <span className="hidden lg:inline">{job.visible ? 'Visible' : 'Hidden'}</span>
                        </button>
                        <button
                            onClick={() => handleDeleteJob(job._id)}
                            title="Delete Posting"
                            className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  ) : <Loading />
}

export default ManageJobs