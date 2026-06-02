import { createContext, useEffect, useState } from "react";
import { initialOfferLetters } from '../assets/assets'
import axios from 'axios'
import { useAuth } from '@clerk/react'

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const { getToken, isLoaded, isSignedIn } = useAuth()

    // Main Data States
    const [jobs, setJobs] = useState([])
    const [notices, setNotices] = useState([])
    const [companies, setCompanies] = useState([])
    const [offerLetters, setOfferLetters] = useState([])
    const [students, setStudents] = useState([])
    const [studentRecords, setStudentRecords] = useState([])
    const [queries, setQueries] = useState([])
    const [applications, setApplications] = useState([])
    const [noDuesRequests, setNoDuesRequests] = useState([])

    // UI/Misc States
    const [searchFilter, setSearchFilter] = useState({ title: '', location: '' })
    const [isSearched, setIsSearched] = useState(false)
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)
    const [companyToken, setCompanyToken] = useState(() => localStorage.getItem('companyToken'))
    const [companyData, setCompanyData] = useState(() => {
        const data = localStorage.getItem('companyData');
        return data ? JSON.parse(data) : null;
    })

    const fetchBackendData = async () => {
        const localCompanyToken = localStorage.getItem('companyToken');
        
        if (!localCompanyToken) {
            if (!isLoaded || !isSignedIn) {// console.("🔍 [CONTEXT LOG] Clerk not authenticated yet.");
                return;
            }
        }

        try {
            const token = localCompanyToken || await getToken();
            const authConfig = { headers: { Authorization: `Bearer ${token}` } };// console.("🚀 [CONTEXT LOG] Fetching data...");

            const [noticesRes, companiesRes, studentsRes, recordsRes, queriesRes, jobsRes, appsRes, placementsRes, noDuesRes] = await Promise.all([
                axios.get(`${backendUrl}/api/admin/notices`, authConfig),
                axios.get(`${backendUrl}/api/admin/companies`, authConfig),
                axios.get(`${backendUrl}/api/admin/students`, authConfig),
                axios.get(`${backendUrl}/api/admin/student-records`, authConfig),
                axios.get(`${backendUrl}/api/admin/queries`, authConfig),
                axios.get(`${backendUrl}/api/admin/jobs`, authConfig),
                axios.get(`${backendUrl}/api/admin/applications`, authConfig),
                axios.get(`${backendUrl}/api/admin/placements`, authConfig),
                axios.get(`${backendUrl}/api/admin/no-dues`, authConfig)
            ]);// console.("📊 === RAW BACKEND PAYLOAD INSPECTION ===");
            
            // Helper to handle data mapping safely
            const mapData = (data, key, setter) => {
                if (data && data[key]) {
                    setter(data[key]);
                } else if (Array.isArray(data)) {
                    setter(data);
                } else {// console.(`⚠️ [CONTEXT WARNING] Key "${key}" not found. Payload structure:`, data);
                    setter([]);
                }
            };

            mapData(noticesRes.data, 'notices', setNotices);
            mapData(companiesRes.data, 'companies', setCompanies);
            mapData(studentsRes.data, 'students', setStudents);
            mapData(recordsRes.data, 'records', setStudentRecords);
            mapData(queriesRes.data, 'queries', setQueries);
            mapData(jobsRes.data, 'jobs', setJobs);
            mapData(appsRes.data, 'applications', setApplications);
            mapData(placementsRes.data, 'placements', setOfferLetters);
            mapData(noDuesRes.data, 'requests', setNoDuesRequests);// console.("✅ [CONTEXT LOG] All states updated.");

        } catch (error) {// console.("💥 [CONTEXT LOG] API Error:", error.response?.data || error.message);
            toast.error("Failed to fetch dashboard data: " + (error.response?.data?.message || error.message));
        }
    };

    // Auto-fetch trigger when Clerk session is ready
    // Inside AppContext.jsx

useEffect(() => {// console.(`🔄 [AUTH STATUS CHANGE] isLoaded: ${isLoaded}, isSignedIn: ${isSignedIn}, companyToken: ${!!companyToken}`);
    
    if ((isLoaded && isSignedIn) || companyToken) {// console.("🔓 [CONTEXT FLOW] Auth validated. Triggering fetch...");
        fetchBackendData();
    } else if (isLoaded && !isSignedIn && !companyToken) {// console.("🚫 [CONTEXT FLOW] User is NOT signed in.");
    }
}, [isLoaded, isSignedIn, companyToken]);

    const value = {
        backendUrl, fetchBackendData,
        setSearchFilter, searchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        notices, setNotices,
        companies, setCompanies,
        offerLetters, setOfferLetters,
        students, setStudents,
        studentRecords, setStudentRecords,
        queries, setQueries,
        applications, setApplications,
        noDuesRequests, setNoDuesRequests
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}