import mongoose, { Document, Model } from "mongoose";

/**
 * Review document interface
 */
export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    tool: mongoose.Types.ObjectId;
    rating: number; // 1-5
    comment: string;
    likes: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new mongoose.Schema<IReview>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        tool: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tool",
            required: [true, "Tool ID is required"],
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating must be at most 5"],
        },
        comment: {
            type: String,
            required: [true, "Comment is required"],
            trim: true,
            maxlength: [280, "Comment cannot exceed 280 characters"],
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Indexes
ReviewSchema.index({ tool: 1, createdAt: -1 });
ReviewSchema.index({ user: 1 });

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
