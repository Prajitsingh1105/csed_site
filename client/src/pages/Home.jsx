import React from 'react'
import Navbar from '../components/Navbar'
import NoticeBanner from '../components/NoticeBanner'
import NoticeBoard from '../components/NoticeBoard'
import Hero from '../components/Hero'
import JobListing from '../components/JobListing'
import AppDownload from '../components/AppDownload'
import Footer from '../components/Footer' 
import AcademicObjectives from '../components/AcademicObjectives'

const Home = () => {
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
