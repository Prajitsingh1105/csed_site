import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/react'
import { AppContext } from '../context/AppContext'
import Navbar from '../components/Navbar'
import NoticeBanner from '../components/NoticeBanner'
import NoticeBoard from '../components/NoticeBoard'
import Hero from '../components/Hero'
import JobListing from '../components/JobListing'
import AppDownload from '../components/AppDownload'
import Footer from '../components/Footer' 
import AcademicObjectives from '../components/AcademicObjectives'

const Home = () => {
  const navigate = useNavigate()
  const { isSignedIn, isLoaded } = useUser()
  const { companyToken } = useContext(AppContext)

  useEffect(() => {
    // If a staff/coordinator is logged in, push to their dashboard
    if (companyToken) {
      navigate('/dashboard')
    } 
    // If a student is logged in, push to their dashboard
    else if (isLoaded && isSignedIn) {
      navigate('/student-dashboard')
    }
  }, [companyToken, isLoaded, isSignedIn, navigate])

  return (
    <div>
      <Navbar />
      <Hero/>
      <NoticeBanner />
      <AcademicObjectives />
      <NoticeBoard />
      <AppDownload/>
      <Footer/>
    </div>
  )
}

export default Home
