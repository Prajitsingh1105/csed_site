import React from 'react'
import { assets } from '../assets/assets'
import { Mail, MapPin, Phone } from 'lucide-react'

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'Jobs', href: '/jobs' },
  { name: 'Profile', href: '/profile' },
  { name: 'No Dues Form', href: '/no-dues' },
  { name: 'Doubts Forum', href: '/doubts' },
]

const faqs = [
  {
    question: 'How do I apply for a job?',
    answer: 'Navigate to the Jobs section, check your eligibility criteria, and submit your application before the deadline.',
  },
  {
    question: 'Who can access the portal?',
    answer: 'Registered IET Lucknow students can access all portal services using their institute email credentials.',
  },
  {
    question: 'How to contact the placement cell?',
    answer: 'Reach out via the official placement email address listed in the Contact section below.',
  },
]

const Footer = () => {
  return (
    <footer className="bg-[#11241a] text-gray-300 relative bg-noise overflow-hidden">
      
      {/* Top border accent */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#D4AF37] via-[#f9e596] to-[#D4AF37]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center shrink-0">
                <img src={assets.iet_logo_2} alt="IET Lucknow" className="h-9 w-9 object-contain grayscale opacity-80" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#FFFDF8] font-serif">IET Lucknow</h2>
                <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.2em] font-bold mt-0.5">
                  Dept. of Computer Science
                </p>
              </div>
            </div>

            <p className="text-[14px] leading-relaxed text-gray-400 max-w-xs font-medium">
              Fostering innovation, research, and technical excellence. Empowering the next generation of computer scientists and software engineers.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-[#D4AF37] mt-0.5 shrink-0" />
                <a
                  href="mailto:contact@ietlucknow.ac.in"
                  className="text-[13px] text-gray-400 hover:text-[#FFFDF8] transition-colors"
                >
                  contact@ietlucknow.ac.in
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#D4AF37] mt-0.5 shrink-0" />
                <span className="text-[13px] text-gray-400 leading-relaxed">
                  Institute of Engineering &amp; Technology,<br />
                  Lucknow – 226021, Uttar Pradesh
                </span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 mt-8">
              {[
                { icon: assets.facebook_icon, label: 'Facebook' },
                { icon: assets.instagram_icon, label: 'Instagram' },
                { icon: assets.twitter_icon, label: 'Twitter' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] group transition-all"
                >
                  <img src={s.icon} alt={s.label} className="h-4 invert opacity-70 group-hover:opacity-100 group-hover:invert-0 transition-all" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[13px] font-medium text-gray-400 hover:text-[#FFFDF8] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-6">
              FAQs
            </h3>
            <div className="space-y-5">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <p className="text-[13px] font-bold text-gray-200 mb-1.5">{faq.question}</p>
                  <p className="text-[12px] leading-relaxed text-gray-500 font-medium">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-6">
              Location
            </h3>
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-xl opacity-90 hover:opacity-100 transition-opacity">
              <iframe
                title="IET Lucknow Map"
                src="https://www.google.com/maps?q=Institute%20of%20Engineering%20and%20Technology%20Lucknow&z=15&output=embed"
                width="100%"
                height="220"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.05] py-6 px-4 sm:px-6 lg:px-8 relative z-10 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-gray-500 font-medium">
            © {new Date().getFullYear()} IET Lucknow, Department of Computer Science & Engineering. All rights reserved.
          </p>
          <p className="text-[12px] text-gray-600 font-medium tracking-wide uppercase">
            Excellence & Innovation
          </p>
        </div>
      </div>

    </footer>
  )
}

export default Footer