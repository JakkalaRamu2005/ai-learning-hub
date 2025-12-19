import mongoose, { Document, Model } from "mongoose";

/**
 * User document interface
 */
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    image?: string;
    profileImage?: string;
    place?: string;
    bio?: string;
    savedTools: string[];
    isVerified: boolean;
    verificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name must be less than 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: false, // Optional for Google Sign-In
            minlength: [6, "Password must be at least 6 characters"],
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        image: {
            type: String,
        },
        profileImage: {
            type: String,
            default: "",
        },
        place: {
            type: String,
            default: "",
            maxlength: [100, "Place must be less than 100 characters"],
        },
        bio: {
            type: String,
            default: "",
            maxlength: [500, "Bio must be less than 500 characters"],
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
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ resetPasswordToken: 1 });

// Prevent password from being returned in queries by default
UserSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.verificationToken;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        return ret;
    },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
