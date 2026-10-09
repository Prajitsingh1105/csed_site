import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },

    image: {
      type: String,
      default: "",
    },

    imagePublicId: {
      type: String,
      default: "",
    },

    rollNumber: { type: String, default: "" },
    branch: { type: String, default: "" },
    phone: { type: String, default: "" },
    degree: { type: String, default: "B.Tech" },
    passingYear: { type: String, default: "" },
    electives: { type: [String], default: [] },
    facultyMentor: { type: String, default: "" },
    departmentRoles: { type: [String], default: [] },
    projects: { 
      type: [{
        title: { type: String },
        techStack: { type: String },
        url: { type: String }
      }], 
      default: [] 
    },
    isBlacklisted: { type: Boolean, default: false },
    blacklistReason: { type: String, default: "" }
  },
  { timestamps: true }
);


const User = mongoose.models.User || mongoose.model("User", fileSchema);

export default User;