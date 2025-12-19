import mongoose, { Document, Model } from "mongoose";

/**
 * Course Module Interface
 */
export interface ICourseModule {
    moduleId: string;
    title: string;
    description: string;
    videoLink?: string;
    duration: number; // in minutes
    order: number;
    resources?: string[];
}

/**
 * Course Document Interface
 */
export interface ICourse extends Document {
    title: string;
    description: string;
    category: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    thumbnail?: string;
    modules: ICourseModule[];
    totalDuration: number; // in minutes
    prerequisites?: string[];
    learningOutcomes: string[];
    instructor?: string;
    publishStatus: "draft" | "published" | "archived";
    enrollmentCount: number;
    completionCount: number;
    createdBy?: string; // Admin user ID
    createdAt: Date;
    updatedAt: Date;
}

const CourseModuleSchema = new mongoose.Schema<ICourseModule>({
    moduleId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: [true, "Module title is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Module description is required"],
    },
    videoLink: {
        type: String,
        trim: true,
    },
    duration: {
        type: Number,
        required: [true, "Module duration is required"],
        min: [1, "Duration must be at least 1 minute"],
    },
    order: {
        type: Number,
        required: true,
    },
    resources: {
        type: [String],
        default: [],
    },
});

const CourseSchema = new mongoose.Schema<ICourse>(
    {
        title: {
            type: String,
            required: [true, "Course title is required"],
            trim: true,
            minlength: [5, "Title must be at least 5 characters"],
            maxlength: [200, "Title must be less than 200 characters"],
        },
        description: {
            type: String,
            required: [true, "Course description is required"],
            trim: true,
            minlength: [20, "Description must be at least 20 characters"],
            maxlength: [2000, "Description must be less than 2000 characters"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },
        difficulty: {
            type: String,
            required: [true, "Difficulty level is required"],
            enum: {
                values: ["Beginner", "Intermediate", "Advanced"],
                message: "Difficulty must be Beginner, Intermediate, or Advanced",
            },
        },
        thumbnail: {
            type: String,
            default: "",
        },
        modules: {
            type: [CourseModuleSchema],
            required: [true, "Course must have at least one module"],
            validate: {
                validator: function (modules: ICourseModule[]) {
                    return modules.length > 0;
                },
                message: "Course must have at least one module",
            },
        },
        totalDuration: {
            type: Number,
            required: true,
            min: [1, "Total duration must be at least 1 minute"],
        },
        prerequisites: {
            type: [String],
            default: [],
        },
        learningOutcomes: {
            type: [String],
            required: [true, "Learning outcomes are required"],
            validate: {
                validator: function (outcomes: string[]) {
                    return outcomes.length > 0;
                },
                message: "Course must have at least one learning outcome",
            },
        },
        instructor: {
            type: String,
            default: "AI Learning Hub",
        },
        publishStatus: {
            type: String,
            enum: ["draft", "published", "archived"],
            default: "draft",
        },
        enrollmentCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        completionCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        createdBy: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
CourseSchema.index({ category: 1 });
CourseSchema.index({ difficulty: 1 });
CourseSchema.index({ publishStatus: 1 });
CourseSchema.index({ createdAt: -1 });
CourseSchema.index({ title: "text", description: "text" }); // Text search

// Virtual for module count
CourseSchema.virtual("moduleCount").get(function () {
    return this.modules.length;
});

const Course: Model<ICourse> =
    mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
