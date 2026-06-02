import { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import { FileText, Sparkles } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import { useAuth } from '@clerk/react'
import axios from 'axios'

const Applications = () => {

  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)
  
  const { backendUrl } = useContext(AppContext)
  const { getToken, isLoaded } = useAuth()
  const [myApplications, setMyApplications] = useState([])

  const fetchApplications = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await axios.get(`${backendUrl}/api/student/applications`, {
          headers: { Authorization: `Bearer ${token}` }
      })
      setMyApplications(res.data.applications || [])
    } catch (error) {// console.(error)
    }
  }

  useEffect(() => {
    if (isLoaded) {
      fetchApplications()
    }
  }, [isLoaded])

  return (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
            <h2 className='text-3xl font-extrabold text-gray-900 mb-6'>Your Dashboard</h2>
            
            <div className='glass-panel p-6 rounded-3xl mb-10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm border border-gray-100 relative overflow-hidden'>
              <div className='absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10'></div>
              
              <div className='flex items-center gap-6 z-10'>
                  <div className='w-16 h-16 bg-blue-100/50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-200/50'>
                      <FileText size={28} />
                  </div>
                  <div>
                      <h3 className='font-bold text-gray-800 text-lg'>Primary Resume</h3>
                      <p className='text-gray-500 text-sm mt-1'>Upload and manage your main resume</p>
                  </div>
              </div>

              <div className='flex items-center gap-4 w-full md:w-auto z-10'>
                {isEdit ? (
                  <div className='flex items-center gap-3 w-full md:w-auto'>
                    <label className='flex items-center cursor-pointer hover:opacity-80 transition-opacity' htmlFor="resumeUpload">
                      <p className='bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium px-5 py-2.5 rounded-xl mr-2 flex items-center gap-2'>
                          <img src={assets.profile_upload_icon} alt="" className='w-4' />
                          {resume ? resume.name : "Select Resume PDF"}
                      </p>
                      <input id='resumeUpload' onChange={e => setResume(e.target.files[0])} accept='application/pdf' type="file" hidden />
                    </label>
                    <button onClick={() => setIsEdit(false)} className='bg-green-600 text-white font-medium rounded-xl px-6 py-2.5 shadow-sm hover:shadow-md transition-shadow'>Save</button>
                  </div>
                ) : (
                  <div className='flex items-center gap-3 w-full md:w-auto'>
                    <a target='_blank' href="" className='bg-blue-50 text-blue-700 font-medium px-6 py-2.5 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors'>
                      View Resume
                    </a>
                    <button onClick={() => setIsEdit(true)} className='btn-secondary font-medium rounded-xl px-6 py-2.5'>
                      Update
                    </button>
                  </div>
                )}
                
                {/* AI Refine Button */}
                <button
                  onClick={() => console.log("AI Resume Refinement")}
                  className="hidden py-2.5 px-5 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all lg:flex flex-row items-center gap-2 ml-4"
                >
                  <Sparkles size={16} className="text-yellow-400" />
                  <span className="font-semibold text-sm">AI Refine</span>
                </button>
              </div>
            </div>

            <h2 className='text-2xl font-bold text-gray-900 mb-6'>Application History</h2>
            
            <div className='overflow-hidden rounded-2xl border border-gray-200 shadow-sm'>
              <table className='min-w-full bg-white text-sm'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='py-4 px-6 text-left font-semibold text-gray-700 tracking-wide'>Company</th>
                    <th className='py-4 px-6 text-left font-semibold text-gray-700 tracking-wide'>Job Role</th>
                    <th className='py-4 px-6 text-left font-semibold text-gray-700 tracking-wide max-sm:hidden'>Location</th>
                    <th className='py-4 px-6 text-left font-semibold text-gray-700 tracking-wide max-sm:hidden'>Applied On</th>
                    <th className='py-4 px-6 text-left font-semibold text-gray-700 tracking-wide'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {myApplications.map((job, index) => (
                    <tr key={index} className='hover:bg-gray-50/50 transition-colors'>
                      <td className='py-4 px-6 flex items-center gap-3'>
                        <div className='p-2 bg-gray-50 rounded-lg border border-gray-100'>
                          <img className='w-6 h-6 object-contain' src={assets.company_icon} alt="" />
                        </div>
                        <span className='font-medium text-gray-800'>{job.company}</span>
                      </td>
                      <td className='py-4 px-6 text-gray-600 font-medium'>{job.jobTitle}</td>
                      <td className='py-4 px-6 text-gray-500 max-sm:hidden'>{job.location}</td>
                      <td className='py-4 px-6 text-gray-500 max-sm:hidden'>{moment(job.date).format('ll')}</td>
                      <td className='py-4 px-6'>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                          ${job.status === 'Accepted' ? 'bg-green-100 text-green-700 border border-green-200' : 
                            job.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' : 
                            'bg-blue-50 text-blue-700 border border-blue-200'}`}
                        >
                          {(job.status === 'Pending' || !job.status) ? <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></span> : null}
                          {job.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {myApplications.length === 0 && (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200 mt-6 mt-4">
                    <p className="text-gray-500 font-medium">You haven't applied to any jobs yet.</p>
                </div>
            )}
        </motion.div>
      </div>
      <Footer />
    </>
  )
}

export default Applications