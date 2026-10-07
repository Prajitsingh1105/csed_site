import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import { Mail, BookOpen, GraduationCap } from 'lucide-react'

const FACULTY_DATA = {
  'regular': {
    title: 'Regular Faculty',
    description: 'Eminent professors and researchers driving core academic excellence and guiding the next generation of engineers.',
    members: [
      { name: 'Dr. A. K. Singh', designation: 'Professor & Head', email: 'aksingh@ietlucknow.ac.in', expertise: 'Artificial Intelligence, Machine Learning' },
      { name: 'Dr. B. Kumar', designation: 'Professor', email: 'bkumar@ietlucknow.ac.in', expertise: 'Computer Networks, Cyber Security' },
      { name: 'Dr. C. Sharma', designation: 'Associate Professor', email: 'csharma@ietlucknow.ac.in', expertise: 'Data Mining, Big Data' },
    ]
  },
  'contractual': {
    title: 'Contractual Faculty',
    description: 'Dedicated educators bringing diverse industry and academic perspectives to support specialized courses.',
    members: [
      { name: 'Mr. D. Verma', designation: 'Assistant Professor (Contractual)', email: 'dverma@ietlucknow.ac.in', expertise: 'Software Engineering, Web Technologies' },
      { name: 'Ms. E. Gupta', designation: 'Assistant Professor (Contractual)', email: 'egupta@ietlucknow.ac.in', expertise: 'Cloud Computing, IoT' },
    ]
  },
  'supporting': {
    title: 'Teaching Supporting Staff',
    description: 'Technical and administrative pillars ensuring seamless academic operations and laboratory functions.',
    members: [
      { name: 'Mr. F. Ali', designation: 'Technical Superintendent', email: 'fali@ietlucknow.ac.in', expertise: 'Network Administration, Hardware' },
      { name: 'Ms. G. Singh', designation: 'Lab Instructor', email: 'gsingh@ietlucknow.ac.in', expertise: 'Programming Labs, Database Management' },
    ]
  },
  'scholars': {
    title: 'Research Scholars',
    description: 'Ph.D. candidates pushing the boundaries of technology and innovation across various domains of Computer Science.',
    members: [
      { name: 'H. Patel', designation: 'Ph.D. Scholar', email: 'hpatel@ietlucknow.ac.in', expertise: 'Deep Learning for Medical Imaging' },
      { name: 'I. Khan', designation: 'Ph.D. Scholar', email: 'ikhan@ietlucknow.ac.in', expertise: 'Natural Language Processing, Large Language Models' },
      { name: 'J. Das', designation: 'Ph.D. Scholar', email: 'jdas@ietlucknow.ac.in', expertise: 'Quantum Computing Algorithms' },
    ]
  }
}

const FacultyDirectory = () => {
  const { type } = useParams();
  const category = FACULTY_DATA[type] || FACULTY_DATA['regular'];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF8] relative bg-noise">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-10 bg-[#D4AF37]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#11241a]">Department People</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#11241a] tracking-tight leading-tight mb-4">
              {category.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl font-medium leading-relaxed">
              {category.description}
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.members.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-[#11241a]/10 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="h-16 w-16 bg-[#FFFDF8] rounded-full flex items-center justify-center mb-6 border border-[#11241a]/10 group-hover:border-[#D4AF37] group-hover:bg-[#11241a] transition-colors duration-300">
                  <GraduationCap size={24} className="text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#11241a] mb-1">{member.name}</h3>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] mb-5">{member.designation}</p>
                
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-start gap-3 group/link">
                    <Mail size={16} className="text-gray-400 mt-0.5 group-hover/link:text-[#11241a] transition-colors" />
                    <a href={`mailto:${member.email}`} className="text-sm text-gray-500 hover:text-[#11241a] font-medium transition-colors">
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen size={16} className="text-gray-400 mt-0.5" />
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      {member.expertise}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default FacultyDirectory;
