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
    <div className="min-h-screen bg-[#F9F8F5] bg-noise">
      <Navbar />
      <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10 pt-20'>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
            <h2 className='text-3xl font-serif font-medium text-[#11241a] mb-6'>Your Dashboard</h2>
            
            <div className='bg-[#FFFDF8] p-6 rounded-[24px] mb-10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm border border-[#11241a]/10 relative overflow-hidden'>
              <div className='absolute right-0 top-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-10'></div>
              
              <div className='flex items-center gap-6 z-10'>
                  <div className='w-16 h-16 bg-[#11241a]/5 rounded-2xl flex items-center justify-center text-[#11241a] border border-[#11241a]/10'>
                      <FileText size={28} />
                  </div>
                  <div>
                      <h3 className='font-serif font-semibold text-[#11241a] text-lg'>Primary Resume</h3>
                      <p className='text-gray-500 font-medium text-sm mt-1'>Upload and manage your main resume</p>
                  </div>
              </div>

              <div className='flex items-center gap-4 w-full md:w-auto z-10'>
                {isEdit ? (
                  <div className='flex items-center gap-3 w-full md:w-auto'>
                    <label className='flex items-center cursor-pointer hover:opacity-80 transition-opacity' htmlFor="resumeUpload">
                      <p className='bg-white border border-[#D4AF37]/30 text-[#11241a] font-bold text-[12px] uppercase tracking-wider px-5 py-2.5 rounded-xl mr-2 flex items-center gap-2'>
                          <img src={assets.profile_upload_icon} alt="" className='w-4' />
                          {resume ? resume.name : "Select Resume PDF"}
                      </p>
                      <input id='resumeUpload' onChange={e => setResume(e.target.files[0])} accept='application/pdf' type="file" hidden />
                    </label>
                    <button onClick={() => setIsEdit(false)} className='bg-[#11241a] text-[#D4AF37] font-bold text-[12px] uppercase tracking-wider rounded-xl px-6 py-2.5 shadow-sm hover:bg-[#1a3828] transition-colors'>Save</button>
                  </div>
                ) : (
                  <div className='flex items-center gap-3 w-full md:w-auto'>
                    <a target='_blank' href="" className='bg-white text-[#11241a] font-bold text-[12px] uppercase tracking-wider px-6 py-2.5 rounded-xl border border-[#11241a]/10 hover:border-[#D4AF37]/50 transition-colors'>
                      View Resume
                    </a>
                    <button onClick={() => setIsEdit(true)} className='bg-[#11241a] text-[#D4AF37] font-bold text-[12px] uppercase tracking-wider rounded-xl px-6 py-2.5 hover:bg-[#1a3828] transition-colors'>
                      Update
                    </button>
                  </div>
                )}
                
                {/* AI Refine Button */}
                <button
                  onClick={() => console.log("AI Resume Refinement")}
                  className="hidden py-2.5 px-5 bg-gradient-to-br from-[#11241a] to-[#1a3828] text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all lg:flex flex-row items-center gap-2 ml-4 border border-[#D4AF37]/20"
                >
                  <Sparkles size={16} className="text-[#D4AF37]" />
                  <span className="font-bold text-[12px] uppercase tracking-wider text-[#D4AF37]">AI Refine</span>
                </button>
              </div>
            </div>

            <h2 className='text-2xl font-serif font-medium text-[#11241a] mb-6'>Application History</h2>
            
            <div className='overflow-hidden rounded-[24px] border border-[#11241a]/10 shadow-sm bg-white'>
              <table className='min-w-full bg-white text-sm'>
                <thead className='bg-[#11241a] border-b border-[#11241a]/10'>
                  <tr>
                    <th className='py-4 px-6 text-left font-bold text-[11px] uppercase tracking-wider text-[#FFFDF8]'>Company</th>
                    <th className='py-4 px-6 text-left font-bold text-[11px] uppercase tracking-wider text-[#FFFDF8]'>Job Role</th>
                    <th className='py-4 px-6 text-left font-bold text-[11px] uppercase tracking-wider text-[#FFFDF8] max-sm:hidden'>Location</th>
                    <th className='py-4 px-6 text-left font-bold text-[11px] uppercase tracking-wider text-[#FFFDF8] max-sm:hidden'>Applied On</th>
                    <th className='py-4 px-6 text-left font-bold text-[11px] uppercase tracking-wider text-[#FFFDF8]'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-[#11241a]/10'>
                  {myApplications.map((job, index) => (
                    <tr key={index} className='hover:bg-[#D4AF37]/5 transition-colors'>
                      <td className='py-4 px-6 flex items-center gap-3'>
                        <div className='p-2 bg-[#11241a]/5 rounded-lg border border-[#11241a]/10'>
                          <img className='w-6 h-6 object-contain' src={assets.company_icon} alt="" />
                        </div>
                        <span className='font-bold text-[#11241a]'>{job.company}</span>
                      </td>
                      <td className='py-4 px-6 text-gray-600 font-medium'>{job.jobTitle}</td>
                      <td className='py-4 px-6 text-gray-500 max-sm:hidden font-medium'>{job.location}</td>
                      <td className='py-4 px-6 text-gray-500 max-sm:hidden font-medium'>{moment(job.date).format('ll')}</td>
                      <td className='py-4 px-6'>
                        <span className={`inline-flex items-center px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-wider
                          ${job.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200' : 
                            job.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                            'bg-[#D4AF37]/10 text-[#11241a] border-[#D4AF37]/30'}`}
                        >
                          {job.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {myApplications.length === 0 && (
                <div className="text-center py-16 bg-[#FFFDF8] rounded-[24px] border border-dashed border-[#D4AF37]/50 mt-6 shadow-sm">
                    <p className="text-gray-500 font-bold uppercase tracking-wider text-[12px]">You haven't applied to any jobs yet.</p>
                </div>
            )}
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}

export default Applications