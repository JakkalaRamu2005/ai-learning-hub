import mongoose, { Document, Model } from "mongoose";

/**
 * Module Progress Interface
 */
export interface IModuleProgress {
    moduleId: string;
    completed: boolean;
    completedAt?: Date;
    timeSpent: number; // in minutes
    lastAccessedAt: Date;
}

/**
 * Enrollment Document Interface
 */
export interface IEnrollment extends Document {
    userId: string;
    courseId: string;
    enrolledAt: Date;
    progress: IModuleProgress[];
    overallProgress: number; // percentage (0-100)
    completedModules: number;
    totalModules: number;
    isCompleted: boolean;
    completedAt?: Date;
    totalTimeSpent: number; // in minutes
    lastAccessedAt: Date;
    certificateIssued: boolean;
    certificateId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ModuleProgressSchema = new mongoose.Schema<IModuleProgress>({
    moduleId: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Date,
    },
    timeSpent: {
        type: Number,
        default: 0,
        min: 0,
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now,
    },
});

const EnrollmentSchema = new mongoose.Schema<IEnrollment>(
    {
        userId: {
            type: String,
            required: [true, "User ID is required"],
            index: true,
        },
        courseId: {
            type: String,
            required: [true, "Course ID is required"],
            index: true,
        },
        enrolledAt: {
            type: Date,
            default: Date.now,
        },
        progress: {
            type: [ModuleProgressSchema],
            default: [],
        },
        overallProgress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        completedModules: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalModules: {
            type: Number,
            required: true,
            min: 1,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        completedAt: {
            type: Date,
        },
        totalTimeSpent: {
            type: Number,
            default: 0,
            min: 0,
        },
        lastAccessedAt: {
            type: Date,
            default: Date.now,
        },
        certificateIssued: {
            type: Boolean,
            default: false,
        },
        certificateId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure one enrollment per user per course
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Indexes for better query performance
EnrollmentSchema.index({ userId: 1, isCompleted: 1 });
EnrollmentSchema.index({ courseId: 1 });
EnrollmentSchema.index({ lastAccessedAt: -1 });
EnrollmentSchema.index({ enrolledAt: -1 });

// Method to calculate overall progress
EnrollmentSchema.methods.calculateProgress = function () {
    if (this.totalModules === 0) {
        this.overallProgress = 0;
        return;
    }

    const completedCount = this.progress.filter(
        (p: IModuleProgress) => p.completed
    ).length;
    this.completedModules = completedCount;
    this.overallProgress = Math.round((completedCount / this.totalModules) * 100);

    // Check if course is completed
    if (this.overallProgress === 100 && !this.isCompleted) {
        this.isCompleted = true;
        this.completedAt = new Date();
    }
};

// Pre-save hook to calculate progress
EnrollmentSchema.pre("save", function (next) {
    if (this.isModified("progress")) {
        this.calculateProgress();
    }
    next();
});

const Enrollment: Model<IEnrollment> =
    mongoose.models.Enrollment ||
    mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);

export default Enrollment;
