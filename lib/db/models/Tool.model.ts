import mongoose, { Document, Model } from "mongoose";

/**
 * Tool document interface
 */
export interface ITool extends Document {
    tool: string;
    category: string;
    description: string;
    url: string;
    pricing: string;
    week?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ToolSchema = new mongoose.Schema<ITool>(
    {
        tool: {
            type: String,
            required: [true, "Tool name is required"],
            trim: true,
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
            maxlength: [1000, "Description must be less than 1000 characters"],
        },
        url: {
            type: String,
            required: [true, "URL is required"],
            trim: true,
        },
        pricing: {
            type: String,
            required: [true, "Pricing is required"],
        },
        week: {
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
ToolSchema.index({ tool: "text", description: "text" }); // Text search

const Tool: Model<ITool> = mongoose.models.Tool || mongoose.model<ITool>("Tool", ToolSchema, "ai-tools");

export default Tool;
