import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  User,
  BookOpen,
  GraduationCap,
  Calendar,
  Phone,
  Hash,
  CheckCircle,
  Camera,
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useAuth } from '@clerk/react';
import { useNavigate } from 'react-router-dom';

const THEME = {
  navy: '#001845',
  navySoft: '#0a234f',
  brand: '#003087',
  brandHover: '#00256b',
  blueLight: '#93c5fd',
  blueLine: '#60a5fa',
  blueBg: '#eff6ff',
  blueBorder: '#bfdbfe',
  pageBg: '#f8fafc',
  cardBg: '#ffffff',
  border: '#e5e7eb',
  borderSoft: '#eef2f7',
  text: '#1f2937',
  textMuted: '#6b7280',
  textFaint: '#9ca3af',
  successTint: '#dbeafe',
  successText: '#1d4ed8',
  pendingTint: '#eff6ff',
  pendingText: '#1e40af',
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

  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    degree: 'B.Tech',
    branch: 'Computer Science and Engineering-Regular',
    passingYear: '2026',
    phone: '',
    profileImage: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

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
            profileImage: u.profileImage || '',
          });

          if (u.profileImage) {
            setPreviewUrl(u.profileImage);
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
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
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: THEME.pageBg,
      }}
    >
      <Navbar />
      <ToastContainer position="bottom-right" />

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
                background: `linear-gradient(120deg, ${THEME.navy} 0%, ${THEME.brand} 100%)`,
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
              <SectionHeading>Profile Photo</SectionHeading>

              <div
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: 18,
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `2px solid ${THEME.blueBorder}`,
                    background: THEME.blueBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
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
                    <User size={34} color={THEME.brand} />
                  )}
                </div>

                <div style={{ flex: 1, width: '100%' }}>
                  <Label icon={Camera}>Upload Profile Image</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{
                      ...inputStyle(),
                      padding: '10px 12px',
                    }}
                  />
                  <p style={{ fontSize: 11, color: THEME.textFaint, marginTop: 6 }}>
                    JPG, PNG, or WEBP. Choose a clear passport-style photo.
                  </p>
                </div>
              </div>

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

      <Footer />
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