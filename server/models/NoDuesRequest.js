import mongoose from "mongoose";

const noDuesSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    company: { type: String, default: "", trim: true },
    package: { type: String, default: "", trim: true },
    letterUrl: { type: String, default: "", trim: true },
    type: {
      type: String,
      enum: ["Job", "Higher Studies", "Not Placed"],
      default: "Job",
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectedAt: {
      type: Date,
      default: null,
    },
    remarks: {
      type: String,
      default: "",
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const NoDuesRequest =
  mongoose.models.NoDuesRequest ||
  mongoose.model("NoDuesRequest", noDuesSchema);

export default NoDuesRequest;