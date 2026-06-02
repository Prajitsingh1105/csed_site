import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, required: true },
    branch: { type: String, required: true },
    year: { type: String, required: true },
    company: { type: String, default: "" },
    package: { type: String, default: "" },
    letterUrl: { type: String, default: "" },
    type: { type: String, enum: ['Job', 'Higher Studies', 'Not Placed'], default: 'Job' },
    date: { type: Number, required: true }
});

// FIX: Prevent overwrite and re-compilation crashes on concurrent production requests
const Placement = mongoose.models.Placement || mongoose.model('Placement', fileSchema);

export default Placement;