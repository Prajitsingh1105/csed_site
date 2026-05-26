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

const TABS = [
  { key: 'mission', label: 'Mission', items: missionItems, color: '#003087', accent: '#e8f0fb' },
  { key: 'peo', label: 'Program Educational Objectives', items: peos, color: '#0f5132', accent: '#e8f5ee' },
  { key: 'pso', label: 'Program Specific Outcomes', items: psos, color: '#5c2d91', accent: '#f0eaf8' },
]

const AccordionItem = ({ item, color, accent, index }) => {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
        style={{ background: open ? accent : undefined }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm shrink-0"
            style={{ background: color, color: '#fff' }}
          >
            {item.id}
          </span>
          <span className="text-[14px] font-semibold text-gray-800">{item.title}</span>
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
            <p className="px-5 py-4 text-[14px] leading-7 text-gray-600 border-t border-gray-100">
              {item.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const AcademicObjectives = () => {
  const [activeTab, setActiveTab] = useState('mission')
  const active = TABS.find((t) => t.key === activeTab)

  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-[#003087]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003087]">CSE Department</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Academic Framework
          </h2>
          <p className="mt-4 text-gray-500 text-[15px] leading-relaxed">
            Our mission, educational objectives and program-specific outcomes define the
            academic direction and commitments of the department.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Tab sidebar */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-2">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full text-left px-5 py-4 rounded-lg border transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'border-[#003087] bg-[#003087] text-white shadow-md'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <p className={`text-[11px] font-bold uppercase tracking-[0.16em] mb-1 ${activeTab === tab.key ? 'text-blue-200' : 'text-gray-400'}`}>
                    {tab.key.toUpperCase()}
                  </p>
                  <p className="text-[13px] font-semibold leading-snug">{tab.label}</p>
                </button>
              ))}

              {/* Info card */}
              <div className="mt-4 p-5 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  These frameworks are defined under NAAC and NBA accreditation standards
                  and guide the department's academic planning and student development.
                </p>
              </div>
            </div>
          </div>

          {/* Content panel */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
                  <div
                    className="h-8 w-1 rounded-full"
                    style={{ background: active.color }}
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{active.label}</h3>
                    <p className="text-[12px] text-gray-400 mt-0.5">{active.items.length} items</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {active.items.map((item, i) => (
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