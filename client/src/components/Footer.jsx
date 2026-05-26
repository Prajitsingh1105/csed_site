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
    <footer className="bg-[#0a1628] text-gray-300">

      {/* Top border accent */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#003087] via-[#0055b3] to-[#003087]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center shrink-0">
                <img src={assets.iet_logo_2} alt="IET Lucknow" className="h-9 w-9 object-contain" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">IET Lucknow</h2>
                <p className="text-[11px] text-blue-400 uppercase tracking-[0.18em] font-semibold mt-0.5">
                  Placement Portal
                </p>
              </div>
            </div>

            <p className="text-[14px] leading-7 text-gray-400 max-w-xs">
              One unified platform connecting students, recruiters, and placement
              coordinators at the Department of Computer Science &amp; Engineering.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-2.5">
                <Mail size={14} className="text-blue-400 mt-0.5 shrink-0" />
                <a
                  href="mailto:placement@ietlucknow.ac.in"
                  className="text-[13px] text-gray-400 hover:text-white transition-colors"
                >
                  placement@ietlucknow.ac.in
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-blue-400 mt-0.5 shrink-0" />
                <span className="text-[13px] text-gray-400">
                  Institute of Engineering &amp; Technology,<br />
                  Lucknow – 226021, Uttar Pradesh
                </span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2 mt-6">
              {[
                { icon: assets.facebook_icon, label: 'Facebook' },
                { icon: assets.instagram_icon, label: 'Instagram' },
                { icon: assets.twitter_icon, label: 'Twitter' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="h-9 w-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <img src={s.icon} alt={s.label} className="h-3.5 invert opacity-70" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[13px] text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-5">
              FAQs
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <p className="text-[13px] font-semibold text-gray-200 mb-1">{faq.question}</p>
                  <p className="text-[13px] leading-6 text-gray-500">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-5">
              Location
            </h3>
            <div className="rounded-lg overflow-hidden border border-white/10">
              <iframe
                title="IET Lucknow Map"
                src="https://www.google.com/maps?q=Institute%20of%20Engineering%20and%20Technology%20Lucknow&z=15&output=embed"
                width="100%"
                height="200"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.07] py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-gray-600">
            © {new Date().getFullYear()} IET Lucknow, Department of Computer Science & Engineering. All rights reserved.
          </p>
          <p className="text-[12px] text-gray-700">
            Built for students, by students.
          </p>
        </div>
      </div>

    </footer>
  )
}

export default Footer