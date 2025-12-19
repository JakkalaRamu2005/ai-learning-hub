import mongoose, { Document, Model } from "mongoose";

/**
 * Tool document interface
 */
export interface ITool extends Document {
    name: string;
    category: string;
    description: string;
    link: string;
    pricing: string;
    weekAdded?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ToolSchema = new mongoose.Schema<ITool>(
    {
        name: {
            type: String,
            required: [true, "Tool name is required"],
            trim: true,
            minlength: [2, "Tool name must be at least 2 characters"],
            maxlength: [100, "Tool name must be less than 100 characters"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            maxlength: [500, "Description must be less than 500 characters"],
        },
        link: {
            type: String,
            required: [true, "Link is required"],
            trim: true,
            match: [/^https?:\/\/.+/, "Please provide a valid URL"],
        },
        pricing: {
            type: String,
            required: [true, "Pricing is required"],
            enum: ["Free", "Freemium", "Paid", "Trial"],
            default: "Free",
        },
        weekAdded: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
ToolSchema.index({ category: 1 });
ToolSchema.index({ pricing: 1 });
ToolSchema.index({ createdAt: -1 });
ToolSchema.index({ name: "text", description: "text" }); // Text search

const Tool: Model<ITool> = mongoose.models.Tool || mongoose.model<ITool>("Tool", ToolSchema);

export default Tool;
