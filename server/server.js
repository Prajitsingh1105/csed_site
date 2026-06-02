import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

// Middlewares
// app.use(cors());
// Robust, Production-Grade CORS Filter
app.use(cors({
    origin: (origin, callback) => {
        // Debug Log: This will print the exact origin hitting your live Render container logs
        console.log("Incoming request origin:", origin);

        // 1. Allow server-to-server or local script requests (where origin is undefined)
        if (!origin) {
            return callback(null, true);
        }

        // 2. Normalize string formatting (strip trailing slashes if present)
        const cleanOrigin = origin.replace(/\/$/, "");

        // 3. Absolute explicitly permitted origins check
        if (
            cleanOrigin.startsWith('http://localhost') || 
            cleanOrigin.endsWith('.vercel.app') || 
            cleanOrigin === 'https://csed.placement.ietlucknow.ac.in'
        ) {
            return callback(null, true);
        } 
        
        // 4. Catch-all rejection safeguard
        return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));

import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

// Base Route
app.get('/', (req, res) => res.send("IET Placement Portal Backend Server is Running"));

// API Routers
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);

// Boot Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
    await connectDB();
});
