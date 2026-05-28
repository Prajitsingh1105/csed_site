import crypto from 'crypto';
import User from '../models/User.js';
import ForumQuery from '../models/ForumQuery.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import NoDuesRequest from '../models/NoDuesRequest.js';
import StudentRecord from '../models/StudentRecord.js';
import cloudinary, { uploadToCloudinary } from '../config/cloudinary.js';

// Get Current User Profile
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.auth;
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
    const { userId } = req.auth;
    const { name, email, image } = req.body;

    const rollNumber = email.split('@')[0].toUpperCase();
    const ledgerRecord = await StudentRecord.findOne({ rollNumber });

    let branch = '';
    let finalName = name;

    if (ledgerRecord) {
      branch = ledgerRecord.branch;
      if (!finalName || finalName.trim() === '') {
        finalName = ledgerRecord.name;
      }
    }

    if (!finalName || finalName.trim() === '') {
      finalName = `Student ${rollNumber}`;
    }

    const user = await User.findOneAndUpdate(
      { userId },
      {
        $set: {
          email,
        },
        $setOnInsert: {
          userId,
          name: finalName,
          image: image || '',
          rollNumber,
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
export const submitNoDues = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { name, rollNumber, branch, year, company, package: pkg, type } = req.body;

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