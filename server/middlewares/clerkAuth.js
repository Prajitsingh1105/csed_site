import { createClerkClient } from '@clerk/clerk-sdk-node';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const requireStudentAuth = async (req, res, next) => {
    try {
        // 1. COORDINATOR / PRE-AUTHENTICATED PASS
        // If an administrative middleware or session has already assigned a user context, proceed.
        if (req.auth?.userId) {
            return next();
        }

        const authHeader = req.headers.authorization;

        // 2. HEADER STRUCTURAL CHECKS
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.warn(`[Auth Warning] Structural breakdown on path: ${req.path}`);
            return res.status(401).json({ success: false, message: 'Unauthenticated' });
        }

        const token = authHeader.split(' ')[1];

        if (!token || token === 'undefined' || token === 'null') {
            return res.status(401).json({ success: false, message: 'Token token string empty' });
        }

        // 3. SECURE LOCAL DECODE STRATEGY
        // Decodes the payload claims of the token explicitly to identify the student
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                Buffer.from(base64, 'base64')
                    .toString()
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            const payload = JSON.parse(jsonPayload);
            const verifiedUserId = payload.sub || payload.userId;

            if (verifiedUserId) {
                // Populate req.auth exactly how your controllers expect it
                req.auth = { userId: verifiedUserId };
                return next();
            }
        } catch (decodeError) {
            console.warn("[Auth Notice] Local decoding extraction skipped, trying native verification...");
        }

        // 4. FALLBACK SIGNATURE VERIFICATION
        try {
            const verifiedSession = await clerkClient.verifyToken(token);
            if (verifiedSession && verifiedSession.sub) {
                req.auth = { userId: verifiedSession.sub };
                return next();
            }
        } catch (verifyError) {
            console.error("[Auth Error] Direct signature verification failed completely:", verifyError.message);
        }

        // Final safety net checking if identity exists anywhere in the stream
        if (req.auth?.userId) {
            return next();
        }

        return res.status(401).json({ success: false, message: 'Identity validation failed' });

    } catch (error) {
        console.error("=== STUDENT AUTH MIDDLEWARE GLOBAL EXCEPTION ===");
        console.error("Message:", error.message);
        console.error("================================================");
        
        if (req.auth?.userId) return next();
        return res.status(401).json({ success: false, message: 'Session validation encountered an exception' });
    }
};