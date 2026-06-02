import mongoose from "mongoose";
import Notice from "../models/Notice.js";
import Company from "../models/Company.js";
import Placement from "../models/Placement.js";
import User from "../models/User.js";
import ForumQuery from "../models/ForumQuery.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import StudentRecord from "../models/StudentRecord.js";
import NoDuesRequest from "../models/NoDuesRequest.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

const signatureSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 714 440">
  <path d="M452.1 116.4c-1.7 1.3-5.3 2.9-7.8 3.6-4.9 1.2-16.4 7.4-22.5 12.2-4.7 3.7-15.5 8.6-28.8 13.2-5.8 2-15 5.9-20.5 8.6-5.5 2.6-13.6 6.3-18 8s-9.4 4.3-11.2 5.6c-6.2 4.7-6.8 4.7-19.3-1.8-6.3-3.3-12.3-6.7-13.4-7.6-1-1-4.6-2.6-8-3.8-3.3-1.2-11-4.3-17.1-6.9-6-2.6-13.1-5-15.7-5.2-4.4-.5-4.8-.3-6.2 2.6-2.1 4-2 4.4 1 8 2.9 3.5 4.6 4 4.3 1.3-.3-3.7 0-4 4.4-3.1 2.3.4 6.3 1.7 9 2.8 2.6 1.1 4.7 1.8 4.7 1.6 0-.3 2.5.9 5.5 2.5 3.1 1.7 6.2 3 7.1 3 .8 0 2.6 1.1 3.9 2.5 2.2 2.1 2.5 3.3 2.5 9.7 0 13.3-.5 14.4-6.9 17.7-22.9 11.6-72.2 43.5-92.2 59.6-13.3 10.7-30.5 26.2-39.1 35.4-6.9 7.3-9.1 10.5-11.8 16.8-2.9 7.1-3.2 8.4-2.6 14.6.3 3.8 1.1 7.7 1.6 8.7 1.5 2.9 6.6 4 17.9 4 15.7 0 36-3.4 62.1-10.2 5.2-1.4 14-3.6 19.5-4.8 11.7-2.7 17.6-4.4 38.5-11.1 40.7-13.2 60.4-24.3 75.5-42.5 11.7-14 15.2-24.4 13.3-39.1-2.2-16.4-17.1-34.3-37.8-45.6l-3.4-1.8 4-2.4c2.1-1.4 4.6-2.5 5.4-2.5.9 0 3.1-1.1 5-2.4 2-1.3 8.7-4.7 15-7.6s12.9-5.8 14.5-6.6c4.9-2.2 17.9-7.4 18.7-7.4.3 0-.3 1.9-1.5 4.2-5.5 11 1.2 26.3 16.2 37.2 5.7 4.1 17.6 10.6 19.4 10.6.7 0 3.3 1 5.8 2.2 2.4 1.2 4.9 2.3 5.4 2.4.6.1 4.4 1.3 8.5 2.7 4.1 1.3 10.4 3.2 14 4.2 23.3 6.5 42.2 14.4 46 19.3 4 5.1 2 10.2-7.8 20-5.9 5.9-11.9 9.4-18.2 10.6-1.9.3-6.6 2-10.5 3.6-13.8 5.8-22.2 8.8-30.7 10.9-4.8 1.2-12.9 3.6-18 5.3s-12.2 3.6-15.8 4.3c-3.6.8-10.5 2.2-15.5 3.3-4.9 1.1-12.4 2.8-16.5 3.6-8.5 1.9-39.3 10.2-42.7 11.6-1.3.6-2.3 1.8-2.3 2.9 0 2.8 6.3 4 9.9 1.8 2.5-1.4 11.2-4.3 16.2-5.2 1.3-.3 3.5-.9 4.9-1.4 2.6-.9 7.1-2 26.5-6.6 6.1-1.4 12.6-3 14.5-3.5s8.9-2.3 15.5-3.9 14.7-3.9 18-5.1 9.8-3.2 14.5-4.5 13.9-4.4 20.5-7 14-5.4 16.5-6.3c5.5-1.9 18-11.1 23.1-17.2 2.1-2.6 4.3-6.6 5.1-9.3 1.2-4.5 1.1-5.1-1.2-9.5-1.6-3.1-3.9-5.4-6.5-6.9-4.8-2.7-17.8-7.9-22-8.9-1.6-.3-6.1-1.7-9.9-3-3.7-1.4-12.3-4-19-5.9-6.6-1.9-13-3.9-14.1-4.4s-5.4-2.4-9.5-4.2-11.9-6.2-17.3-9.8c-16.5-10.8-23.4-23.4-17.7-32.6 2.7-4.3 11.1-11.2 14.8-12.2 1.5-.3 4.1-1.6 5.7-2.8 1.7-1.3 7.3-4 12.5-6 15.7-6.2 24-11.3 24-14.7 0-2.8-7.7-2.5-11.9.6"/>
</svg>
`;

// --- NOTICES ---
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json({ success: true, notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNotice = async (req, res) => {
  try {
    const { title, content, urgency } = req.body;
    const newNotice = new Notice({ title, content, urgency, date: Date.now() });
    await newNotice.save();
    res.json({ success: true, message: "Notice broadcasted!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Notice deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- COMPANIES ---
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json({ success: true, companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCompanyTag = async (req, res) => {
  try {
    const { tag } = req.body;
    await Company.findByIdAndUpdate(req.params.id, { tag });
    res.json({ success: true, message: "Company status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCompany = async (req, res) => {
  try {
    const newCompany = new Company({ ...req.body });
    await newCompany.save();
    res.json({ success: true, message: "Company Added!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Company Deleted!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- STUDENTS ---
export const getStudents = async (req, res) => {
  try {
    const students = await User.find();
    
    // DIAGNOSTIC LOG: Run this to see if the "users" collection contains items
    console.log("--- DEBUG REQ ---");
    console.log("Raw documents found in User collection:", students.length);

    const populatedStudents = await Promise.all(students.map(async (student) => {
      let studentObj = student.toObject();
      if ((!studentObj.name || studentObj.name.startsWith('Student ')) && studentObj.rollNumber) {
        const ledger = await StudentRecord.findOne({ rollNumber: studentObj.rollNumber });
        if (ledger) {
          studentObj.name = ledger.name;
          studentObj.branch = ledger.branch;
        }
      }
      return studentObj;
    }));

    res.json({ success: true, students: populatedStudents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleBlacklist = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    student.isBlacklisted = !student.isBlacklisted;
    await student.save();

    res.json({
      success: true,
      message: "Blacklist toggled",
      isBlacklisted: student.isBlacklisted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentRecords = async (req, res) => {
  try {
    const records = await StudentRecord.find();
    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkUploadStudentRecords = async (req, res) => {
  try {
    const { records } = req.body;

    await StudentRecord.insertMany(records, { ordered: false }).catch((err) => {
      if (err.code !== 11000) throw err;
    });

    if (records && records.length > 0) {
      const bulkUserOps = records.map((record) => ({
        updateOne: {
          filter: { rollNumber: record.rollNumber },
          update: { $set: { branch: record.branch, name: record.name } },
        },
      }));

      await User.bulkWrite(bulkUserOps, { ordered: false }).catch((err) =>
        console.error("Sync partial error:", err)
      );
    }

    res.json({
      success: true,
      message: "Bulk upload executed & registered users synced!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during bulk upload",
    });
  }
};

export const deleteStudentRecord = async (req, res) => {
  try {
    await StudentRecord.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Ledger record deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearStudentRecords = async (req, res) => {
  try {
    await StudentRecord.deleteMany({});
    res.json({ success: true, message: "Master ledger completely cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- QUERIES ---
export const getQueries = async (req, res) => {
  try {
    const queries = await ForumQuery.find().sort({ createdAt: -1 });
    res.json({ success: true, queries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveQuery = async (req, res) => {
  try {
    const { reply } = req.body;
    await ForumQuery.findByIdAndUpdate(req.params.id, {
      reply: reply || "",
      isResolved: true,
    });
    res.json({ success: true, message: "Query resolved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteQuery = async (req, res) => {
  try {
    await ForumQuery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Query deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- JOBS ---
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ date: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const newJob = new Job({ ...req.body, date: Date.now() });
    await newJob.save();
    res.json({ success: true, message: "Job Posted!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleJobVisibility = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    job.visible = !job.visible;
    await job.save();

    res.json({ success: true, message: "Job visibility toggled!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Job deleted!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- APPLICATIONS ---
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ date: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Application.findByIdAndUpdate(req.params.id, { status });
    res.json({ success: true, message: "Applicant status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- PLACEMENTS ---
export const getPlacements = async (req, res) => {
  try {
    const placements = await Placement.find().sort({ date: -1 });
    res.json({ success: true, placements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPlacement = async (req, res) => {
  try {
    let letterUrl = req.body.letterUrl || "";

    if (req.file) {
      try {
        letterUrl = await uploadToCloudinary(req.file.buffer, "placements");
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "File upload failed",
          error: err.message,
        });
      }
    }

    const newPlacement = new Placement({
      ...req.body,
      letterUrl,
      date: Date.now(),
    });

    await newPlacement.save();

    res.json({
      success: true,
      message: "Placement Record added!",
      record: newPlacement,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePlacement = async (req, res) => {
  try {
    await Placement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Placement Record deleted!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- NO DUES REQUESTS ---
export const getNoDuesRequests = async (req, res) => {
  try {
    const requests = await NoDuesRequest.find().sort({ date: -1 });

    // DIAGNOSTIC LOG: Check raw request lengths
    console.log("Raw documents found in NoDuesRequest collection:", requests.length);
    console.log("-----------------");

    const clearRequests = await Promise.all(requests.map(async (reqCard) => {
      let card = reqCard.toObject();
      if (!card.name || card.name.startsWith('Student ')) {
        const accountDoc = await User.findOne({ rollNumber: card.rollNumber });
        if (accountDoc && accountDoc.name) {
          card.name = accountDoc.name;
        }
      }
      return card;
    }));

    res.json({ success: true, requests: clearRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveNoDuesRequest = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request id",
      });
    }

    let responsePayload = null;

    await session.withTransaction(async () => {
      const request = await NoDuesRequest.findById(req.params.id).session(session);

      if (!request) {
        throw new Error("Request not found");
      }

      if (request.status !== "Pending") {
        throw new Error("Request already processed");
      }

      request.status = "Approved";
      request.approvedAt = new Date();
      request.rejectedAt = null;
      await request.save({ session });

      const placementPayload = {
        name: request.name,
        rollNumber: request.rollNumber,
        branch: request.branch,
        year: request.year,
        company: request.company,
        package: request.package,
        letterUrl: request.letterUrl || "",
        type: request.type || "Job",
        date: new Date(),
      };

      const existingPlacement = await Placement.findOne({
        rollNumber: request.rollNumber,
      }).session(session);

      if (existingPlacement) {
        existingPlacement.name = placementPayload.name;
        existingPlacement.branch = placementPayload.branch;
        existingPlacement.year = placementPayload.year;
        existingPlacement.company = placementPayload.company;
        existingPlacement.package = placementPayload.package;
        existingPlacement.letterUrl = placementPayload.letterUrl;
        existingPlacement.type = placementPayload.type;
        existingPlacement.date = placementPayload.date;

        await existingPlacement.save({ session });
      } else {
        await Placement.create([placementPayload], { session });
      }

      const student = await User.findOne({
        rollNumber: request.rollNumber,
      }).session(session);

      if (student) {
        student.noDuesApproval = {
          approved: true,
          approvedAt: new Date(),
          requestId: request._id,
          formData: {
            name: request.name || student.name || "",
            rollNumber: request.rollNumber || student.rollNumber || "",
            branch: request.branch || student.branch || "",
            year: request.year || "",
            projectStatus: "Yes",
            placementRecordStatus: "Yes",
            feedbackStatus: "Yes",
            verifiedBy: "Faculty Coordinator for Placement / Higher Study Record",
            company: request.company || "",
            package: request.package || "",
            type: request.type || "Job",
            letterUrl: request.letterUrl || "",
            signatureSvg,
          },
        };

        await student.save({ session });
      }

      responsePayload = {
        success: true,
        message:
          "Request approved, placement updated, and no dues form sent to student dashboard!",
      };
    });

    res.json(responsePayload);
  } catch (error) {
    if (error.message === "Request not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Request already processed") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
};

export const rejectNoDuesRequest = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request id",
      });
    }

    const { remarks = "" } = req.body;

    const request = await NoDuesRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Request already processed",
      });
    }

    request.status = "Rejected";
    request.rejectedAt = new Date();
    request.approvedAt = null;
    request.remarks = remarks;
    await request.save();

    const student = await User.findOne({ rollNumber: request.rollNumber });

    if (student) {
      student.noDuesApproval = {
        approved: false,
        approvedAt: null,
        requestId: request._id,
        rejectionReason: remarks || "Request was rejected by verifying authority",
      };

      await student.save();
    }

    res.json({
      success: true,
      message: "Request rejected!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};