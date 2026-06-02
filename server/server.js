import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

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
        // 1. FIX: Explicitly allow requests with no origin header 
        // (like mobile routing, direct API fetches, or specific browser GET requests)
        if (!origin || origin === 'undefined') {
            return callback(null, true);
        }

        const cleanOrigin = origin.replace(/\/$/, "");

        // 2. Subdomain check for security
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

// Ensure parsing limits are active directly underneath
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

// Base Route
app.get('/', (req, res) => res.send("IET Placement Portal Backend Server is Running"));

// API Routers
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);

// Add this right before your app.listen block to trap the exact bug
app.use((err, req, res, next) => {
    console.error("=== GLOBAL CRASH TRAP ===");
    console.error("Path:", req.method, req.path);
    console.error("Error Message:", err.message);
    console.error("Stack Trace:", err.stack);
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
    await connectDB();
});
