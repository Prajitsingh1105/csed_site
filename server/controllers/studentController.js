import crypto from 'crypto';
import { createClerkClient } from '@clerk/clerk-sdk-node'; // IMPORT THIS HERE
import User from '../models/User.js';
import ForumQuery from '../models/ForumQuery.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import NoDuesRequest from '../models/NoDuesRequest.js';
import StudentRecord from '../models/StudentRecord.js';
import cloudinary, { uploadToCloudinary } from '../config/cloudinary.js';

// Initialize Clerk Backend SDK to fetch the metadata we seeded
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

/**
 * HELPER FUNCTION: Resolves incoming Production Clerk ID to old Dev ID if it exists.
 * If found, it programmatically updates old collections to the new Production ID so this only runs once.
 */
const resolveAndMigrateUser = async (productionUserId) => {
  try {
    // 1. Get user profile details from Clerk Production
    const clerkUser = await clerkClient.users.getUser(productionUserId);
    
    // 2. Extract old dev ID if it matches our migration pattern
    if (clerkUser.externalId && clerkUser.externalId.startsWith('migrated_')) {
      const developmentUserId = clerkUser.externalId.replace('migrated_', '');

      // Check if they have an unmigrated profile document in MongoDB
      const oldUserExist = await User.findOne({ userId: developmentUserId });
      
      if (oldUserExist) {
        // Update User profile table to use the new Production ID
        await User.updateOne({ userId: developmentUserId }, { $set: { userId: productionUserId } });
        
        // Batch update all related database references across the platform
        await ForumQuery.updateMany({ studentId: developmentUserId }, { $set: { studentId: productionUserId } });
        await Application.updateMany({ userId: developmentUserId }, { $set: { userId: productionUserId } });
        await NoDuesRequest.updateMany({ userId: developmentUserId }, { $set: { userId: productionUserId } });
        
        console.log(`Successfully mapped and migrated historical data for: ${clerkUser.emailAddresses[0]?.emailAddress}`);
      }
    }
  } catch (error) {
    console.error("Migration fallback resolution error:", error.message);
  }
};

// Get Current User Profile
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.auth;
    
    // Run real-time resolution scan
    await resolveAndMigrateUser(userId);

    const user = await User.findOne({ userId });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { name, phone, degree, branch, passingYear } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const updateData = {
      name,
      phone,
      degree,
      branch,
      passingYear,
    };

    if (req.file) {
      try {
        if (user.imagePublicId) {
          await cloudinary.uploader.destroy(user.imagePublicId);
        }

        const uploadedImage = await uploadToCloudinary(
          req.file.buffer,
          'profile_images',
          {
            resource_type: 'image',
            public_id: crypto.randomBytes(12).toString('hex'),
          }
        );

        updateData.image = uploadedImage.secure_url;
        updateData.imagePublicId = uploadedImage.public_id;
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: 'Profile image upload failed',
          error: err.message,
        });
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      user: updatedUser,
      message: 'Profile completely updated!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sync Clerk Verified User to DB with Master Ledger Auto-Population
export const syncUser = async (req, res) => {
  try {
    const { userId } = req.auth; // The new Clerk production ID (e.g., user_4ZXY...)
    const { name, email, image } = req.body;

    // 1. Get the clean roll number from their verified email handle
    const rollNumberRaw = email.split('@')[0].trim();

    // 2. CRITICAL PRODUCTION COUPLING: Look for an existing historical account 
    // using their unique Roll Number before doing anything else.
    let existingHistoricUser = await User.findOne({
      rollNumber: { $regex: new RegExp(`^${rollNumberRaw}$`, 'i') }
    });

    // 3. If we find their old account and it's still using an old development ID,
    // seamlessly migrate all tables to their new ID in one sweep!
    if (existingHistoricUser && existingHistoricUser.userId !== userId) {
      const oldDevId = existingHistoricUser.userId;

      // Update their core profile document to the live production ID
      existingHistoricUser.userId = userId;
      if (email) existingHistoricUser.email = email;
      await existingHistoricUser.save();

      // Cascade the ID update across all application collections instantly
      await ForumQuery.updateMany({ studentId: oldDevId }, { $set: { studentId: userId } });
      await Application.updateMany({ userId: oldDevId }, { $set: { userId: userId } });
      await NoDuesRequest.updateMany({ userId: oldDevId }, { $set: { userId: userId } });

      console.log(`Live Link Patch Success: Restored historical records for Roll Number ${rollNumberRaw}`);
      
      return res.json({ success: true, user: existingHistoricUser });
    }

    // 4. FALLBACK: If they are a genuinely new user, pull structural details from ledger
    const ledgerRecord = await StudentRecord.findOne({ 
      rollNumber: { $regex: new RegExp(`^${rollNumberRaw}$`, 'i') } 
    });

    let branch = '';
    let finalName = name;
    let accurateRollNumber = rollNumberRaw.toUpperCase();

    if (ledgerRecord) {
      branch = ledgerRecord.branch;
      accurateRollNumber = ledgerRecord.rollNumber;
      if (!finalName || finalName.trim() === '') {
        finalName = ledgerRecord.name;
      }
    }

    if (!finalName || finalName.trim() === '') {
      finalName = `Student ${accurateRollNumber}`;
    }

    // Upsert safely if no historical match was encountered
    const user = await User.findOneAndUpdate(
      { userId },
      {
        $set: { email },
        $setOnInsert: {
          userId,
          name: finalName,
          image: image || '',
          rollNumber: accurateRollNumber,
          branch,
          degree: 'B.Tech',
          passingYear: '',
          phone: '',
          isBlacklisted: false,
          blacklistReason: '',
        },
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    console.error("Live Sync Error Caught:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Student Submits a Doubt
export const submitDoubt = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { query } = req.body;

    const user = await User.findOne({ userId });

    const newQuery = new ForumQuery({
      studentId: userId,
      studentName: user ? user.name : 'Student User',
      query,
    });

    await newQuery.save();
    res.json({ success: true, message: 'Query submitted to Coordinator portal!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Student's Past Doubts
export const getMyDoubts = async (req, res) => {
  try {
    const { userId } = req.auth;
    const queries = await ForumQuery.find({ studentId: userId }).sort({ createdAt: -1 });
    res.json({ success: true, queries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Student Applies to a Job
export const applyForJob = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { jobId, company, jobTitle, location, name, rollNumber, branch, year, resume } = req.body;

    const exists = await Application.findOne({ userId, jobId });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Already applied!' });
    }

    const app = new Application({
      userId,
      name: name || 'Student User',
      rollNumber,
      branch,
      year,
      company,
      jobTitle,
      location,
      resume,
      date: Date.now(),
      jobId,
    });

    await app.save();

    res.json({ success: true, message: 'Application submitted securely!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Student's Own Applications
export const getMyApplications = async (req, res) => {
  try {
    const { userId } = req.auth;
    const applications = await Application.find({ userId }).sort({ date: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit No Dues Form
// Submit No Dues Form
export const submitNoDues = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { name, rollNumber, branch, year, company, package: pkg, type } = req.body;

    // FIX 1: Enforce migration lookup immediately if they land directly on this page
    await resolveAndMigrateUser(userId);

    let letterUrl = req.body.letterUrl || '';

    const existing = await NoDuesRequest.findOne({ userId, status: 'Pending' });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending No Dues request.',
      });
    }

    if (req.file) {
      try {
        const uploadedLetter = await uploadToCloudinary(
          req.file.buffer,
          'placements',
          {
            resource_type: 'raw',
            public_id: crypto.randomBytes(12).toString('hex') + '.pdf',
          }
        );

        letterUrl = uploadedLetter.secure_url;
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: 'File upload failed',
          error: err.message,
        });
      }
    }

    const newRequest = new NoDuesRequest({
      userId,
      name,
      rollNumber,
      branch,
      year,
      company,
      package: pkg,
      letterUrl,
      type,
      date: Date.now(),
    });

    await newRequest.save();

    res.json({
      success: true,
      message: 'No Dues Request submitted successfully! Please wait for Coordinator approval.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get No Dues Status
export const getNoDuesStatus = async (req, res) => {
  try {
    const { userId } = req.auth;

    // FIX 2: Enforce migration tracking here to prevent loading state bugs
    await resolveAndMigrateUser(userId);

    const request = await NoDuesRequest.findOne({ userId }).sort({ createdAt: -1 });

    if (!request) {
      return res.json({ success: true, request: null });
    }

    const responseData = request.toObject();

    if (request.status === 'Approved') {
      const user = await User.findOne({ rollNumber: request.rollNumber });
      if (user?.noDuesApproval?.formData) {
        responseData.formData = user.noDuesApproval.formData;
      }
    }

    res.json({ success: true, request: responseData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};