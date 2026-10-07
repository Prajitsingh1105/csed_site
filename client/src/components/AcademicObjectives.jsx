import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const missionItems = [
  {
    id: 'M1',
    title: 'Academic Excellence',
    text: 'To achieve high academic standards and values to prepare computer science professionals who can augment the industrial, educational, research, innovations and social needs of the nation and the world at large.',
  },
  {
    id: 'M2',
    title: 'Rigorous Education',
    text: 'To provide the education to the students by rigorous course work etc. in such a way that they should be an excellent technocrat.',
  },
  {
    id: 'M3',
    title: 'Leadership Development',
    text: 'To develop human technical potential to its fullest extent so that intellectually capable and imaginatively gifted leaders can emerge in a range of professions to achieve the needs of society and industry.',
  },
  {
    id: 'M4',
    title: 'Core Values',
    text: 'To preserve the core values as an enduring principle adopted by the department: integrity, excellence, transparency, and empathy.',
  },
]

const peos = [
  {
    id: 'PEO1',
    title: 'Problem Formulation',
    text: 'The students will be able to formulate and analyze engineering problems of various domains that may require sound foundation of mathematics, scientific reasoning and computer engineering fundamentals.',
  },
  {
    id: 'PEO2',
    title: 'Tools & Innovation',
    text: 'The students will be able to use techniques, tools and skills in areas aspiring for innovative solutions to challenging problems of Industry and day-to-day life.',
  },
  {
    id: 'PEO3',
    title: 'Teamwork & Ethics',
    text: 'The students will be able to contribute effectively and efficiently in varying roles of teamwork along with the practice of ethical and moral values.',
  },
]

const psos = [
  {
    id: 'PSO1',
    title: 'Core Computing Foundation',
    text: 'Possess strong mathematical & algorithmic skills and background in core subjects of computer science to appreciate the problems of various diverse domains along with standard tools and technologies in practice.',
  },
  {
    id: 'PSO2',
    title: 'Modelling & Solution Design',
    text: 'Use techniques of mathematical abstractions and modelling for formulating real-world problems of various domains and design solutions.',
  },
  {
    id: 'PSO3',
    title: 'Emerging Technologies',
    text: 'Possess knowledge and skills to understand, analyze and develop strategy in areas like data science, machine learning, computer vision, pattern recognition, and natural language processing.',
  },
]

const programsData = [
  { prog: 'Bachelor of Technology (CSE-AI)', type: '(Self Financed)', spec: 'Computer Science and Engineering (AI)', intake: 60, started: 2021 },
  { prog: 'Bachelor of Technology (CSE-R)', type: '(Regular)', spec: 'Computer Science and Engineering', intake: 60, started: 1984 },
  { prog: 'Bachelor of Technology (CSE-SF)', type: '(Self Financed)', spec: 'Computer Science and Engineering', intake: 60, started: 2021 },
  { prog: 'Master of Computer Applications (MCA)', type: '(Regular)', spec: '-', intake: 60, started: 1988 },
  { prog: 'Master of Technology (AI&DS)', type: '(Self Financed)', spec: 'Artificial Intelligence and Data Science', intake: 18, started: 2021 }
]

const syllabusData = [
  { prog: 'Bachelor of Technology (CSE-AI)', spec: 'Computer Science and Engineering (AI)', y1: true, y2: true, y3: true, y4: true },
  { prog: 'Bachelor of Technology (CSE-R)', spec: 'Computer Science and Engineering', y1: true, y2: true, y3: true, y4: true },
  { prog: 'Bachelor of Technology (CSE-SF)', spec: 'Computer Science and Engineering', y1: true, y2: true, y3: true, y4: true },
  { prog: 'Master of Computer Applications (MCA)', spec: '-', y1: true, y2: true, y3: false, y4: false },
  { prog: 'Master of Technology (AI&DS)', spec: 'Artificial Intelligence and Data Science', y1: true, y2: true, y3: false, y4: false }
]

const TABS = [
  { key: 'programs', label: 'Programs Offered', type: 'table-programs', data: programsData, color: '#11241a' },
  { key: 'syllabus', label: 'Syllabus', type: 'table-syllabus', data: syllabusData, color: '#1a1728' },
  { key: 'mission', label: 'Mission', type: 'accordion', items: missionItems, color: '#11241a', accent: '#f4f6f5' },
  { key: 'peo', label: 'Program Educational Objectives', type: 'accordion', items: peos, color: '#1a1728', accent: '#f5f4f8' },
  { key: 'pso', label: 'Program Specific Outcomes', type: 'accordion', items: psos, color: '#D4AF37', accent: '#fcfaf2' },
]

const AccordionItem = ({ item, color, accent, index }) => {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="border border-[#11241a]/10 rounded-lg overflow-hidden bg-white"
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-50"
        style={{ background: open ? accent : undefined }}
      >
        <div className="flex items-center gap-4">
          <span
            className="text-[11px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm shrink-0"
            style={{ background: color, color: color === '#D4AF37' ? '#11241a' : '#fff' }}
          >
            {item.id}
          </span>
          <span className="text-[15px] font-bold text-[#11241a] font-serif">{item.title}</span>
        </div>
        <ChevronDown
          size={16}
          className="text-gray-400 shrink-0 transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 py-5 text-[15px] leading-relaxed text-gray-600 border-t border-[#11241a]/5 bg-white">
              {item.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const AcademicObjectives = () => {
  const [activeTab, setActiveTab] = useState('programs')
  const active = TABS.find((t) => t.key === activeTab)

  return (
    <section id="academics" className="min-h-[100dvh] flex flex-col justify-center py-24 bg-[#FFFDF8] border-b border-gray-200 relative bg-noise">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-10 bg-[#D4AF37]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#11241a]">CSE Department</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif font-medium text-[#11241a] tracking-tight leading-tight">
            Academic Framework
          </h2>
          <p className="mt-6 text-gray-600 text-[16px] leading-relaxed font-medium">
            Our mission, educational objectives and program-specific outcomes define the
            academic direction and commitments of the department.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Tab sidebar */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-3">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full text-left px-6 py-5 rounded-xl border transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'border-[#11241a] bg-[#11241a] text-[#FFFDF8] shadow-lg scale-[1.02]'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 ${activeTab === tab.key ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
                    {tab.key.toUpperCase()}
                  </p>
                  <p className={`text-[15px] font-bold leading-snug ${activeTab === tab.key ? 'font-serif text-lg text-white' : ''}`}>{tab.label}</p>
                </button>
              ))}

              {/* Info card */}
              <div className="mt-6 p-6 bg-white border border-[#11241a]/10 rounded-xl shadow-sm">
                <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                  These frameworks are defined under NAAC and NBA accreditation standards
                  and guide the department's academic planning and student development.
                </p>
              </div>
            </div>
          </div>

          {/* Content panel */}
          <div className="lg:col-span-8 w-full min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full min-w-0"
              >
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#11241a]/10">
                  <div
                    className="h-10 w-1.5 rounded-full"
                    style={{ background: active.color }}
                  />
                  <div>
                    <h3 className="text-2xl font-serif font-medium text-[#11241a]">{active.label}</h3>
                    <p className="text-[13px] font-bold uppercase tracking-wider text-gray-400 mt-1">
                      {active.items ? active.items.length : active.data.length} items
                    </p>
                  </div>
                </div>

                <div className="space-y-4 w-full min-w-0">
                  
                  {active.type === 'table-programs' && (
                    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white" data-lenis-prevent="true">
                      <table className="w-full text-left text-sm text-gray-600 min-w-[500px]">
                        <thead className="bg-gray-50 border-b border-gray-200 text-[#11241a] font-serif font-medium text-[15px]">
                          <tr>
                            <th className="px-6 py-4">Programme</th>
                            <th className="px-6 py-4">Specialization</th>
                            <th className="px-6 py-4 whitespace-nowrap text-center">Intake</th>
                            <th className="px-6 py-4 whitespace-nowrap text-center">Started In</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {active.data.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 font-medium text-[#1a1728]">
                                {row.prog} <span className="text-gray-400 font-normal">{row.type}</span>
                              </td>
                              <td className="px-6 py-4">{row.spec}</td>
                              <td className="px-6 py-4 text-center">{row.intake}</td>
                              <td className="px-6 py-4 text-center">{row.started}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {active.type === 'table-syllabus' && (
                    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white" data-lenis-prevent="true">
                      <table className="w-full text-left text-sm text-gray-600 min-w-[500px]">
                        <thead className="bg-gray-50 border-b border-gray-200 text-[#11241a] font-serif font-medium text-[15px]">
                          <tr>
                            <th className="px-6 py-4">Programme</th>
                            <th className="px-6 py-4">Specialization</th>
                            <th className="px-6 py-4 whitespace-nowrap text-center">First Year</th>
                            <th className="px-6 py-4 whitespace-nowrap text-center">Second Year</th>
                            <th className="px-6 py-4 whitespace-nowrap text-center">Third Year</th>
                            <th className="px-6 py-4 whitespace-nowrap text-center">Fourth Year</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {active.data.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 font-medium text-[#1a1728]">{row.prog}</td>
                              <td className="px-6 py-4">{row.spec}</td>
                              <td className="px-6 py-4 text-center">
                                {row.y1 ? <a href="#syllabus" className="text-[#0e5c94] hover:underline font-serif text-base">I</a> : '-'}
                              </td>
                              <td className="px-6 py-4 text-center">
                                {row.y2 ? <a href="#syllabus" className="text-[#0e5c94] hover:underline font-serif text-base">II</a> : '-'}
                              </td>
                              <td className="px-6 py-4 text-center">
                                {row.y3 ? <a href="#syllabus" className="text-[#0e5c94] hover:underline font-serif text-base">III</a> : '-'}
                              </td>
                              <td className="px-6 py-4 text-center">
                                {row.y4 ? <a href="#syllabus" className="text-[#0e5c94] hover:underline font-serif text-base">IV</a> : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {active.type === 'accordion' && active.items.map((item, i) => (
                    <AccordionItem
                      key={item.id}
                      item={item}
                      color={active.color}
                      accent={active.accent}
                      index={i}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  )
}

export default AcademicObjectives