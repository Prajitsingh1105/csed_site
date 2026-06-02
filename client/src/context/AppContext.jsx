import { createContext, useEffect, useState } from "react";
import { jobsData, initialOfferLetters } from '../assets/assets'
import axios from 'axios'
import { useAuth } from '@clerk/react' // CRITICAL: Import useAuth to access the active session token

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const { getToken, isLoaded, isSignedIn } = useAuth() // Extract authentication helpers

    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: ''
    })

    const [isSearched, setIsSearched] = useState(false)
    const [jobs, setJobs] = useState([])
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setCompanyData] = useState(null)

    // Feature States
    const [notices, setNotices] = useState([])
    const [companies, setCompanies] = useState([])
    const [offerLetters, setOfferLetters] = useState([])
    const [students, setStudents] = useState([])
    const [studentRecords, setStudentRecords] = useState([])
    const [queries, setQueries] = useState([])
    const [noDuesRequests, setNoDuesRequests] = useState([])

    const [applications, setApplications] = useState([])

    // Fetch mock data (stuff not in DB yet)
    const fetchJobs = async () => {
        setOfferLetters(initialOfferLetters)
    }

    // Fetch Database data
    // Fetch Database data
    const fetchBackendData = async () => {
        // Guard Clause: Don't execute if Clerk is still initializing
        if (!isLoaded || !isSignedIn) {
            console.log("Clerk not authenticated yet, skipping fetch.");
            return;
        }

        try {
            // Force Clerk to wait or retry if token is pulling blank initially
            let token = await getToken();
            
            if (!token) {
                console.warn("Token was empty on first try, attempting secondary retrieval...");
                // Brief 300ms timeout cushion to allow the Clerk session state thread to settle
                await new Promise(resolve => setTimeout(resolve, 300));
                token = await getToken();
            }
            
            if (!token) {
                console.error("Clerk session token completely unavailable.");
                return;
            }

            const authConfig = {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            };

            console.log("Fetching backend data with active token...");

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
            ]);

            setNotices(noticesRes.data.notices || []);
            setCompanies(companiesRes.data.companies || []);
            setStudents(studentsRes.data.students || []);
            setStudentRecords(recordsRes.data.records || []);
            setQueries(queriesRes.data.queries || []);
            setJobs(jobsRes.data.jobs || []);
            setApplications(appsRes.data.applications || []);
            setOfferLetters(placementsRes.data.placements || []);
            setNoDuesRequests(noDuesRes.data.requests || []);
            
            console.log("All application datasets loaded successfully.");
        } catch (error) {
            console.error("Backend DB Error during state generation:", error);
        }
    };

    // Watch both authentication changes and explicit loading states
    useEffect(() => {
        fetchJobs();
        if (isLoaded && isSignedIn) {
            fetchBackendData();
        }
    }, [isLoaded, isSignedIn]);

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

    return <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
}