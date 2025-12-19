import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false, // Optional for Google Sign-In
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    image: {
        type: String,
    },
    profileImage: { // Keeping for compatibility if needed
        type: String,
        default: "",
    },
    place: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    savedTools: {
        type: [String],
        default: [],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        default: "",
    },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
