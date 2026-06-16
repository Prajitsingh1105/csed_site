import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    branch: { type: String, required: true },
    degree: { type: String, required: true },
    year: { type: String, required: true },
    placementType: { type: String, default: "" },
    company: { type: String, default: "" }
});

// FIX: Check mongoose.models first to prevent fatal compilation crashes on multi-route production loads
const StudentRecord = mongoose.models.StudentRecord || mongoose.model('StudentRecord', fileSchema);

export default StudentRecord;