import dotenv from 'dotenv';
dotenv.config(); // CRITICAL FIX: This must be lines 1 and 2 so environment variables exist for all subsequent imports

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js'; // Now safely imports with valid env keys loaded
import studentRoutes from './routes/studentRoutes.js'; // Now safely imports with valid env keys loaded

const app = express();

// Middlewares
const allowedOrigins = [
    'https://csed.placement.ietlucknow.ac.in',
    'https://placement.ietlucknow.ac.in',
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin header (like mobile routing, direct API fetches, etc.)
        if (!origin || origin === 'undefined') {
            return callback(null, true);
        }

        const cleanOrigin = origin.replace(/\/$/, "");

        // Subdomain check for security
        const isAllowed = allowedOrigins.includes(cleanOrigin) || 
                          cleanOrigin.includes('ietlucknow.ac.in') || 
                          cleanOrigin.startsWith('http://localhost') || 
                          cleanOrigin.endsWith('.vercel.app');

        if (isAllowed) {
            return callback(null, true);
        } else {
            console.error(`Blocked Origin via CORS: ${origin}`);
            return callback(null, false); // Returns a clean CORS block instead of a 500 crash
        }
    },
    credentials: true
}));

// Parsing limits configuration
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Base Route
app.get('/', (req, res) => res.send("IET Placement Portal Backend Server is Running"));

// API Routers
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);

// Global Error Handler & Crash Trap
app.use((err, req, res, next) => {
    // Catch Clerk's unauthenticated error state cleanly
    if (err.message === 'Unauthenticated') {
        return res.status(401).json({ 
            success: false, 
            message: 'Session token missing or expired. Please sign in again.' 
        });
    }

    console.error("=== GLOBAL CRASH TRAP ===");
    console.error("Path:", req.method, req.path);
    console.error("Error Message:", err.message);
    console.error("=========================");
    
    res.status(500).json({ 
        success: false, 
        message: err.message || "Internal Server Error trapped globally" 
    });
});

// Boot Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
    try {
        await connectDB();
    } catch (dbError) {
        console.error("Critical: Failed to connect to Database on startup:", dbError.message);
    }
});