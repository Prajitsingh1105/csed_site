import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, BookOpen, GraduationCap, Calendar, Phone, Hash, CheckCircle, Camera, X, ZoomIn, Layers, Briefcase, Code, Plus, Trash2, Terminal, Link, Award, Users } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useAuth } from '@clerk/react';
import { useNavigate } from 'react-router-dom';

const THEME = {
  navy: '#11241a',
  navySoft: '#1a3828',
  brand: '#D4AF37',
  brandHover: '#b5932b',
  blueLight: '#e0c878',
  blueLine: '#D4AF37',
  blueBg: '#F9F8F5',
  blueBorder: 'rgba(17,36,26,0.1)',
  pageBg: '#F9F8F5',
  cardBg: '#FFFDF8',
  border: 'rgba(17,36,26,0.1)',
  borderSoft: 'rgba(17,36,26,0.05)',
  text: '#11241a',
  textMuted: '#6b7280',
  textFaint: '#9ca3af',
  successTint: '#ecfdf5',
  successText: '#047857',
  pendingTint: '#F9F8F5',
  pendingText: '#11241a',
  rejectedTint: '#fef2f2',
  rejectedText: '#b91c1c',
};

const BRANCHES = [
  'Computer Science and Engineering-Regular',
  'Computer Science and Engineering-Self Finance',
  'Computer Science and Engineering-Artificial Intelligence',
];

const DEGREES = ['B.Tech', 'MBA', 'MCA', 'M.Tech'];
const PASSING_YEARS = ['2024', '2025', '2026', '2027', '2028'];

const Label = ({ icon: Icon, children }) => (
  <label
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12.5,
      fontWeight: 600,
      color: THEME.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      marginBottom: 8,
    }}
  >
    <Icon size={13} color={THEME.blueLight} />
    {children}
  </label>
);

const inputStyle = (readOnly = false) => ({
  width: '100%',
  minHeight: 44,
  padding: '11px 14px',
  fontSize: 14,
  fontWeight: 500,
  color: readOnly ? THEME.textFaint : THEME.text,
  background: readOnly ? THEME.borderSoft : THEME.cardBg,
  border: `1px solid ${THEME.blueBorder}`,
  borderRadius: 9,
  outline: 'none',
  cursor: readOnly ? 'not-allowed' : 'text',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
});

const selectStyle = () => ({
  ...inputStyle(),
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: 36,
  cursor: 'pointer',
});

const StudentProfile = () => {
  const { backendUrl } = useContext(AppContext);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [focused, setFocused] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [activeTab, setActiveTab] = useState('personal');

  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    degree: 'B.Tech',
    branch: 'Computer Science and Engineering-Regular',
    passingYear: '2026',
    phone: '',
    profileImage: '',
    electives: [],
    facultyMentor: '',
    departmentRoles: [],
    projects: [],
  });
  const [electiveInput, setElectiveInput] = useState('');
  const [roleInput, setRoleInput] = useState('');
  

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showEnlarged, setShowEnlarged] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await axios.get(`${backendUrl}/api/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.user) {
          const u = res.data.user;
          setFormData({
            name: u.name || '',
            rollNumber: u.rollNumber || '',
            degree: u.degree || 'B.Tech',
            branch: u.branch || 'Computer Science and Engineering-Regular',
            passingYear: u.passingYear || '2026',
            phone: u.phone || '',
            profileImage: u.image || '',
            electives: u.electives || [],
            facultyMentor: u.facultyMentor || '',
            departmentRoles: u.departmentRoles || [],
            projects: u.projects || [],
          });

          if (u.image) {
            setPreviewUrl(u.image);
          }
        }
      } catch (err) {
// console.('Failed to load profile:', err);
      }
    };

    fetchProfile();
  }, [backendUrl, getToken]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setPreviewUrl((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return objectUrl;
    });
  };

  
  const handleAddElective = (e) => {
    if (e.key === 'Enter' && electiveInput.trim()) {
      e.preventDefault();
      if (!formData.electives.includes(electiveInput.trim())) {
        setFormData({ ...formData, electives: [...formData.electives, electiveInput.trim()] });
      }
      setElectiveInput('');
    }
  };
  const removeElective = (item) => {
    setFormData({ ...formData, electives: formData.electives.filter(i => i !== item) });
  };

  const handleAddRole = (e) => {
    if (e.key === 'Enter' && roleInput.trim()) {
      e.preventDefault();
      if (!formData.departmentRoles.includes(roleInput.trim())) {
        setFormData({ ...formData, departmentRoles: [...formData.departmentRoles, roleInput.trim()] });
      }
      setRoleInput('');
    }
  };
  const removeRole = (item) => {
    setFormData({ ...formData, departmentRoles: formData.departmentRoles.filter(i => i !== item) });
  };

  const addProject = () => {
    setFormData({ ...formData, projects: [...formData.projects, { title: '', techStack: '', url: '' }] });
  };
  const removeProject = (index) => {
    const newProjects = [...formData.projects];
    newProjects.splice(index, 1);
    setFormData({ ...formData, projects: newProjects });
  };
  const updateProject = (index, field, value) => {
    const newProjects = [...formData.projects];
    newProjects[index][field] = value;
    setFormData({ ...formData, projects: newProjects });
  };

  const calculateCompletion = () => {
    const fields = [
      formData.name,
      formData.phone,
      formData.branch,
      formData.passingYear,
      previewUrl,
      formData.facultyMentor,
      formData.electives?.length > 0,
      formData.departmentRoles?.length > 0,
      formData.projects?.length > 0,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();

      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('phone', formData.phone);
      payload.append('degree', formData.degree);
      payload.append('branch', formData.branch);
      payload.append('passingYear', formData.passingYear);
      payload.append('electives', JSON.stringify(formData.electives));
      payload.append('facultyMentor', formData.facultyMentor);
      payload.append('departmentRoles', JSON.stringify(formData.departmentRoles));
      payload.append('projects', JSON.stringify(formData.projects));

      if (selectedImage) {
        payload.append('profileImage', selectedImage);
      }

      const res = await axios.put(
        `${backendUrl}/api/student/profile`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setSaved(true);
        toast.success('Profile updated successfully!');
        setTimeout(() => navigate('/'), 1600);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (name) =>
    focused === name
      ? { borderColor: THEME.blueLine, boxShadow: `0 0 0 3px ${THEME.blueBg}` }
      : {};

  const sectionGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: isMobile ? '16px' : '18px 24px',
    marginBottom: isMobile ? 24 : 28,
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '20px 12px' : '40px 16px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: 680 }}
        >
          <div
            style={{
              background: THEME.cardBg,
              borderRadius: isMobile ? 14 : 18,
              border: `1px solid ${THEME.border}`,
              overflow: 'hidden',
              boxShadow: '0 4px 32px rgba(0,24,69,0.08)',
            }}
          >
            <div
              style={{
                background: THEME.navy,
                padding: isMobile ? '24px 18px 22px' : '32px 40px 30px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.07)',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.05)',
                  pointerEvents: 'none',
                }}
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: 18,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <User size={24} color="white" />
                </div>

                <div>
                  <p
                    style={{
                      color: THEME.blueLight,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}
                  >
                    Student Profile
                  </p>
                  <h1
                    style={{
                      color: 'white',
                      fontSize: isMobile ? 19 : 22,
                      fontFamily: 'serif',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      margin: 0,
                    }}
                  >
                    Complete Your Profile
                  </h1>
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.68)',
                      fontSize: isMobile ? 12 : 13,
                      marginTop: 5,
                      lineHeight: 1.5,
                    }}
                  >
                    Keep your details accurate so coordinators can reach you.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{ padding: isMobile ? '22px 18px 24px' : '36px 40px 40px' }}
            >

              <div style={{ display: 'flex', borderBottom: `1px solid ${THEME.borderSoft}`, marginBottom: 32 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('personal')}
                  style={{
                    flex: 1, padding: '16px 8px', fontWeight: 800, fontSize: 13, background: 'transparent',
                    border: 'none', borderBottom: activeTab === 'personal' ? `3px solid ${THEME.brand}` : '3px solid transparent',
                    color: activeTab === 'personal' ? THEME.brand : THEME.textMuted, cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}
                >
                  Personal Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('professional')}
                  style={{
                    flex: 1, padding: '16px 8px', fontWeight: 800, fontSize: 13, background: 'transparent',
                    border: 'none', borderBottom: activeTab === 'professional' ? `3px solid ${THEME.brand}` : '3px solid transparent',
                    color: activeTab === 'professional' ? THEME.brand : THEME.textMuted, cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}
                >
                  Professional Details
                </button>
              </div>

              <div style={{ display: activeTab === 'personal' ? 'block' : 'none' }}>

              <SectionHeading>Profile Photo</SectionHeading>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 32,
                  marginTop: 12,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    border: `4px solid ${THEME.blueBorder}`,
                    background: THEME.blueBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                  className="group"
                  onClick={() => {
                    if (previewUrl) setShowEnlarged(true);
                    else fileInputRef.current?.click();
                  }}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <User size={48} color={THEME.brand} />
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={28} color="white" className="mb-1" />
                    <span className="text-white text-[10px] uppercase font-bold tracking-wider">
                      {previewUrl ? 'Change/View' : 'Upload'}
                    </span>
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />

                <p style={{ fontSize: 12, color: THEME.textFaint, textAlign: 'center', maxWidth: 280, margin: 0 }}>
                  JPG, PNG, or WEBP. Choose a clear passport-style photo.
                </p>
              </div>

              {/* Full Image Modal */}
              <AnimatePresence>
                {showEnlarged && previewUrl && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'fixed',
                      inset: 0,
                      backgroundColor: 'rgba(0,0,0,0.85)',
                      zIndex: 9999,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 20,
                    }}
                    onClick={() => setShowEnlarged(false)}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEnlarged(false);
                      }}
                      style={{
                        position: 'absolute',
                        top: 24,
                        right: 24,
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: 'white',
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      className="hover:bg-white/20 transition-colors"
                    >
                      <X size={24} />
                    </button>

                    <motion.img
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                      src={previewUrl}
                      alt="Enlarged profile"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        maxWidth: '90%',
                        maxHeight: '75vh',
                        objectFit: 'contain',
                        borderRadius: 16,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                      }}
                    />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                        setShowEnlarged(false);
                      }}
                      className="mt-8 flex items-center gap-2 px-6 py-3 bg-white text-[#11241a] rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
                    >
                      <Camera size={18} />
                      Change Picture
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <SectionHeading>Personal Information</SectionHeading>

              <div style={sectionGridStyle}>
                <div>
                  <Label icon={User}>Full Name</Label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Abhinav Singh"
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    style={{ ...inputStyle(), ...focusStyle('name') }}
                  />
                </div>

                <div>
                  <Label icon={Hash}>Roll Number</Label>
                  <input
                    type="text"
                    name="rollNumber"
                    readOnly
                    value={formData.rollNumber}
                    style={inputStyle(true)}
                    title="Roll Number is linked to your registered email and cannot be changed."
                  />
                  <p style={{ fontSize: 11, color: THEME.textFaint, marginTop: 5 }}>
                    Linked to your email — cannot be edited.
                  </p>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <Label icon={Phone}>Phone Number</Label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    onFocus={() => setFocused('phone')}
                    onBlur={() => setFocused(null)}
                    style={{
                      ...inputStyle(),
                      ...focusStyle('phone'),
                      maxWidth: isMobile ? '100%' : 320,
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  height: 1,
                  background: THEME.borderSoft,
                  margin: '4px 0 28px',
                }}
              />

              <SectionHeading>Academic Details</SectionHeading>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: isMobile ? '16px' : '18px 24px',
                  marginBottom: 36,
                }}
              >
                <div>
                  <Label icon={GraduationCap}>Degree</Label>
                  <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    onFocus={() => setFocused('degree')}
                    onBlur={() => setFocused(null)}
                    style={{ ...selectStyle(), ...focusStyle('degree') }}
                  >
                    {DEGREES.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label icon={Calendar}>Year of Passing</Label>
                  <select
                    name="passingYear"
                    value={formData.passingYear}
                    onChange={handleChange}
                    onFocus={() => setFocused('passingYear')}
                    onBlur={() => setFocused(null)}
                    style={{ ...selectStyle(), ...focusStyle('passingYear') }}
                  >
                    {PASSING_YEARS.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <Label icon={BookOpen}>Branch</Label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    onFocus={() => setFocused('branch')}
                    onBlur={() => setFocused(null)}
                    style={{ ...selectStyle(), ...focusStyle('branch') }}
                  >
                    {BRANCHES.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>


              </div>
              <div style={{ display: activeTab === 'professional' ? 'block' : 'none' }}>
              <div style={{ height: 1, background: THEME.borderSoft, margin: '4px 0 28px' }} />
              
              <SectionHeading>Academic Track</SectionHeading>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '16px' : '18px 24px', marginBottom: 36 }}>
                <div>
                  <Label icon={Users}>Faculty Mentor</Label>
                  <input
                    type="text"
                    name="facultyMentor"
                    value={formData.facultyMentor}
                    onChange={handleChange}
                    placeholder="E.g., Dr. A. Sharma"
                    onFocus={() => setFocused('facultyMentor')}
                    onBlur={() => setFocused(null)}
                    style={{ ...inputStyle(), ...focusStyle('facultyMentor') }}
                  />
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label icon={BookOpen}>Current Semester Electives</Label>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 8, 
                    padding: '12px', 
                    border: `1px solid ${focused === 'electives' ? THEME.brand : THEME.border}`, 
                    borderRadius: 9, 
                    background: THEME.bgLight,
                    transition: 'all 0.2s',
                    boxShadow: focused === 'electives' ? `0 0 0 3px ${THEME.blueLight}` : 'none',
                  }}>
                    {formData.electives.map(item => (
                      <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 4, background: THEME.navy, color: THEME.brand, padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>
                        {item} <X size={12} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => removeElective(item)} />
                      </span>
                    ))}
                    <input
                      type="text"
                      value={electiveInput}
                      onChange={(e) => setElectiveInput(e.target.value)}
                      onKeyDown={handleAddElective}
                      placeholder="Type elective & press Enter..."
                      onFocus={() => setFocused('electives')}
                      onBlur={() => setFocused(null)}
                      style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, minWidth: 150, fontSize: 14, color: THEME.text }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ height: 1, background: THEME.borderSoft, margin: '4px 0 28px' }} />

              <SectionHeading>Department Roles</SectionHeading>
              <div style={{ marginBottom: 36 }}>
                <Label icon={Award}>Roles & Memberships</Label>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 8, 
                  padding: '12px', 
                  border: `1px solid ${focused === 'roles' ? THEME.brand : THEME.border}`, 
                  borderRadius: 9, 
                  background: THEME.bgLight,
                  transition: 'all 0.2s',
                  boxShadow: focused === 'roles' ? `0 0 0 3px ${THEME.blueLight}` : 'none',
                }}>
                  {formData.departmentRoles.map(item => (
                    <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 4, background: THEME.brand + '20', color: THEME.navy, border: `1px solid ${THEME.brand}40`, padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 700 }}>
                      {item} <X size={12} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => removeRole(item)} />
                    </span>
                  ))}
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    onKeyDown={handleAddRole}
                    placeholder="e.g. Class Representative (Press Enter)"
                    onFocus={() => setFocused('roles')}
                    onBlur={() => setFocused(null)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, minWidth: 150, fontSize: 14, color: THEME.text }}
                  />
                </div>
              </div>

              <div style={{ height: 1, background: THEME.borderSoft, margin: '4px 0 28px' }} />

              <SectionHeading>Projects & Portfolio</SectionHeading>
              <div style={{ marginBottom: 36, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {formData.projects.map((proj, i) => (
                  <div key={i} style={{ border: `1px solid ${THEME.border}`, borderRadius: 9, padding: 16, background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: THEME.navy }}>Project {i + 1}</span>
                      <Trash2 size={16} color="red" style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => removeProject(i)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                      <div>
                        <Label icon={Code}>Project Title</Label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => updateProject(i, 'title', e.target.value)}
                          placeholder="E.g., Smart Portal"
                          style={inputStyle()}
                        />
                      </div>
                      <div>
                        <Label icon={Terminal}>Tech Stack / Domain</Label>
                        <input
                          type="text"
                          value={proj.techStack}
                          onChange={(e) => updateProject(i, 'techStack', e.target.value)}
                          placeholder="MERN, AI/ML, etc."
                          style={inputStyle()}
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <Label icon={Link}>Project Link</Label>
                        <input
                          type="url"
                          value={proj.url}
                          onChange={(e) => updateProject(i, 'url', e.target.value)}
                          placeholder="https://github.com/..."
                          style={inputStyle()}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addProject}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '10px 16px', background: THEME.bgLight, border: `1px dashed ${THEME.brand}`,
                    color: THEME.navy, fontWeight: 600, fontSize: 13, borderRadius: 9, cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = THEME.brand + '10'}
                  onMouseLeave={(e) => e.currentTarget.style.background = THEME.bgLight}
                >
                  <Plus size={16} /> Add Project
                </button>
              </div>

              </div>

              <div
                style={{
                  borderTop: `1px solid ${THEME.borderSoft}`,
                  paddingTop: 28,
                  display: 'flex',
                  flexDirection: isMobile ? 'column-reverse' : 'row',
                  justifyContent: 'flex-end',
                  gap: 12,
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  style={{
                    minHeight: 44,
                    width: isMobile ? '100%' : 'auto',
                    padding: '11px 22px',
                    borderRadius: 9,
                    border: `1px solid ${THEME.border}`,
                    background: 'white',
                    color: THEME.textMuted,
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = THEME.pageBg)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || saved}
                  style={{
                    minHeight: 44,
                    width: isMobile ? '100%' : 'auto',
                    padding: '11px 32px',
                    borderRadius: 9,
                    border: 'none',
                    background: saved
                      ? THEME.successTint
                      : loading
                      ? THEME.blueBorder
                      : THEME.brand,
                    color: saved ? THEME.successText : 'white',
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: loading || saved ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'background 0.15s',
                    minWidth: isMobile ? '100%' : 140,
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && !saved) e.currentTarget.style.background = THEME.brandHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && !saved) e.currentTarget.style.background = THEME.brand;
                  }}
                >
                  {saved ? (
                    <>
                      <CheckCircle size={15} />
                      Saved!
                    </>
                  ) : loading ? (
                    <>
                      <Spinner />
                      Saving…
                    </>
                  ) : (
                    'Save Profile'
                  )}
                </button>
              </div>
            </form>
          </div>

          <p
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: THEME.textFaint,
              marginTop: 16,
              paddingInline: 8,
            }}
          >
            IET Lucknow — Department of Computer Science &amp; Engineering
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const SectionHeading = ({ children }) => (
  <p
    style={{
      fontSize: 11.5,
      fontWeight: 700,
      color: THEME.brand,
      textTransform: 'uppercase',
      letterSpacing: '0.09em',
      marginBottom: 16,
    }}
  >
    {children}
  </p>
);

const Spinner = () => (
  <span
    style={{
      width: 14,
      height: 14,
      borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTopColor: 'white',
      display: 'inline-block',
      animation: 'profileSpin 0.7s linear infinite',
    }}
  />
);

export default StudentProfile;

