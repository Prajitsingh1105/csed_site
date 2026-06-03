import { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { JobCategories, JobLocations } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion'
import { PlusCircle } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddJob = () => {

    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [logo, setLogo] = useState('');
    const [location, setLocation] = useState('Bangalore');
    const [category, setCategory] = useState('Programming');
    const [level, setLevel] = useState('Beginner level');
    const [salary, setSalary] = useState(0);

    const editorRef = useRef(null)
    const quillRef = useRef(null)

    const { backendUrl, fetchBackendData, getAdminHeaders } = useContext(AppContext)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            const description = quillRef.current.root.innerHTML
            const { data } = await axios.post(`${backendUrl}/api/admin/jobs`, {
                title, description, location, category, level, salary, company: company || "General Company", logo
            }, await getAdminHeaders())
            if (data.success) {
                toast.success(data.message)
                setTitle('')
                setCompany('')
                setLogo('')
                setSalary(0)
                quillRef.current.root.innerHTML = ''
                fetchBackendData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    useEffect(() => {
        // Initiate Qill only once
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
            })
        }
    }, [])

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='container p-4 md:p-8 max-w-4xl'
        >
            <div className='glass-panel p-8 rounded-3xl shadow-sm border border-gray-100'>
                <div className='mb-8'>
                    <h2 className='text-3xl font-extrabold text-gray-800 tracking-tight'>Post a New Job</h2>
                    <p className='text-gray-500 mt-2'>Fill in the details below to broadcast an opening to the student portal.</p>
                </div>

                <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-6'>

                    <div className='w-full flex gap-6'>
                        <div className='flex-1'>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Job Title</label>
                            <input type="text" placeholder='e.g. Senior Full Stack Developer'
                                onChange={e => setTitle(e.target.value)} value={title}
                                required
                                className='glass-input w-full px-4 py-3'
                            />
                        </div>
                        <div className='flex-1'>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Company Name</label>
                            <input type="text" placeholder='e.g. Amazon, Google, etc.'
                                onChange={e => setCompany(e.target.value)} value={company}
                                className='glass-input w-full px-4 py-3'
                            />
                        </div>
                    </div>

                    <div className='w-full'>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>Company Logo (Optional)</label>
                        <div className='flex items-center gap-4'>
                            {logo && <img src={logo} alt="Company logo preview" className="w-12 h-12 object-contain rounded-md border border-gray-200" />}
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                    </div>

                    <div className='w-full'>
                        <label className='block text-sm font-semibold text-gray-700 mb-2'>Job Description</label>
                        <div className="rounded-xl overflow-hidden border border-gray-200">
                            <div ref={editorRef} className='min-h-[200px] bg-white text-gray-800'></div>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl'>

                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Job Category</label>
                            <input type='text' list='category-list' className='glass-input w-full px-4 py-3' value={category} onChange={e => setCategory(e.target.value)} placeholder='e.g. Programming' />
                            <datalist id='category-list'>
                                {JobCategories.map((cat, index) => (
                                    <option key={index} value={cat}>{cat}</option>
                                ))}
                            </datalist>
                        </div>

                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Job Location</label>
                            <input type='text' list='location-list' className='glass-input w-full px-4 py-3' value={location} onChange={e => setLocation(e.target.value)} placeholder='e.g. Bangalore' />
                            <datalist id='location-list'>
                                {JobLocations.map((loc, index) => (
                                    <option key={index} value={loc}>{loc}</option>
                                ))}
                            </datalist>
                        </div>

                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Job Level</label>
                            <select className='glass-input w-full px-4 py-3' onChange={e => setLevel(e.target.value)}>
                                <option value="Beginner level">Beginner level</option>
                                <option value="Intermediate level">Intermediate level</option>
                                <option value="Senior level">Senior level</option>
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Job Salary (CTC)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-medium">₹</span>
                                <input min={0} className='glass-input w-full pl-8 px-4 py-3' onChange={e => setSalary(e.target.value)} type="Number" placeholder='e.g. 1500000' />
                            </div>
                        </div>

                    </div>

                    <div className="pt-6 w-full border-t border-gray-100 mt-2">
                        <button className='btn-primary px-8 py-3.5 flex items-center gap-2 shadow-lg hover:shadow-indigo-500/25'>
                            <PlusCircle size={20} /> Post Job Opening
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    )
}

export default AddJob